
import type { Shift, ShiftFormData, EndShiftData } from '@/types/shift';
import { getMockUsers } from '@/data/users'; 
import { getMockOutlets, getMockOutletById } from '@/data/outlets'; // Menggunakan getMockOutlets dari file terpusat
import { differenceInMinutes, formatDistanceStrict, format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import type { User } from '@/types/user';
import type { Outlet } from '@/types/outlet';

let mockShiftsStore: Shift[] = [
  {
    id: 'shift1',
    companyId: "comp_es_teh_jaya",
    userId: '2', // Budi Santoso
    userName: 'Budi Santoso',
    outletId: '1', // KATAMA Pusat (Es Teh)
    outletName: 'KATAMA Pusat (Es Teh)',
    startTime: "2024-07-23T02:00:00.000Z", 
    endTime: "2024-07-23T09:00:00.000Z",  
    initialCash: 500000,
    finalCash: 1250000,
    totalSales: 750000,
    notes: 'Shift pagi berjalan lancar.',
    status: 'Selesai',
  },
  {
    id: 'shift2',
    companyId: "comp_es_teh_jaya",
    userId: '1', // Ana Maria
    userName: 'Ana Maria',
    outletId: '1', // KATAMA Pusat (Es Teh)
    outletName: 'KATAMA Pusat (Es Teh)',
    startTime: "2024-07-23T08:00:00.000Z", 
    endTime: null,
    initialCash: 300000,
    finalCash: null,
    totalSales: null,
    notes: 'Memulai shift sore.',
    status: 'Berjalan',
  },
  {
    id: 'shift3',
    companyId: "comp_kopi_maju",
    userId: '3', // Candra Wijaya
    userName: 'Candra Wijaya',
    outletId: '3', // Kedai Kopi Maju Jaya Pusat
    outletName: 'Kedai Kopi Maju Jaya Pusat',
    startTime: "2024-07-22T10:00:00.000Z", 
    endTime: "2024-07-22T16:00:00.000Z",  
    initialCash: 400000,
    finalCash: 900000,
    totalSales: 500000,
    notes: 'Shift kemarin oke.',
    status: 'Selesai',
  }
];

const calculateDuration = (startTime: string, endTime: string | null): string | null => {
  if (!endTime) return null;
  const start = new Date(startTime);
  const end = new Date(endTime);
  return formatDistanceStrict(end, start, { locale: idLocale, unit: 'minute' });
};

// Populate shift names based on potentially company-specific users and outlets
const populateShiftNames = (shift: Shift): Shift => {
  const users = getMockUsers(); // Users are global for now
  const user = users.find(u => u.id === shift.userId);
  // Outlets are company-specific, so we need companyId from the shift
  const outlet = getMockOutletById(shift.outletId, shift.companyId); 
  
  return {
    ...shift,
    userName: user?.name || 'Tidak Diketahui',
    outletName: outlet?.name || 'Outlet Tidak Diketahui',
    duration: calculateDuration(shift.startTime, shift.endTime),
  };
};


export const getMockShifts = (companyId?: string): Shift[] => {
  const filteredShifts = companyId 
    ? mockShiftsStore.filter(s => s.companyId === companyId) 
    : []; // Jika tidak ada companyId, kembalikan kosong (shift harus per perusahaan)

  return filteredShifts
    .map(populateShiftNames)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

export const getMockShiftById = (id: string, companyId?: string): Shift | undefined => {
  const shift = mockShiftsStore.find((s) => s.id === id);
  if (shift) {
    if (companyId && shift.companyId !== companyId) {
      return undefined; // Not found for this company
    }
    return populateShiftNames(shift);
  }
  return undefined;
};

export const addMockShift = (shiftData: ShiftFormData, companyId: string): Shift => {
  if (!companyId) throw new Error("companyId is required to add a shift.");
  const users = getMockUsers(); // Global users for now
  const user = users.find(u => u.id === shiftData.userId);
  const outlet = getMockOutletById(shiftData.outletId, companyId); // Company-specific outlet

  if (!outlet) throw new Error(`Outlet dengan ID ${shiftData.outletId} tidak ditemukan untuk perusahaan ini.`);

  const newShift: Shift = {
    id: `shift${mockShiftsStore.length + 1}-${Date.now().toString().slice(-4)}`,
    companyId: companyId,
    startTime: new Date().toISOString(),
    endTime: null,
    finalCash: null,
    totalSales: null, 
    status: 'Berjalan',
    ...shiftData,
    userName: user?.name || 'Tidak Diketahui',
    outletName: outlet.name,
    duration: null,
  };
  mockShiftsStore.unshift(newShift); 
  return populateShiftNames(newShift);
};

export const endMockShift = (id: string, endShiftData: EndShiftData, companyId: string): Shift | undefined => {
  const shiftIndex = mockShiftsStore.findIndex((s) => s.id === id && s.companyId === companyId);
  if (shiftIndex === -1) {
    return undefined;
  }

  const shiftToEnd = mockShiftsStore[shiftIndex];
  if (shiftToEnd.status !== 'Berjalan') {
    throw new Error("Hanya shift yang sedang berjalan yang bisa diakhiri.");
  }

  const finalCash = endShiftData.finalCashInput;
  // TODO: totalSales should be calculated based on actual sales transactions during the shift.
  // For mock, we can use a placeholder or keep it simple: finalCash - initialCash
  const totalSales = finalCash - shiftToEnd.initialCash; 

  mockShiftsStore[shiftIndex] = {
    ...shiftToEnd,
    endTime: new Date().toISOString(),
    finalCash,
    totalSales, 
    notes: `${shiftToEnd.notes || ''}\nCatatan Akhir: ${endShiftData.endNotes || 'Tidak ada catatan.'}`.trim(),
    status: 'Selesai',
  };
  return populateShiftNames(mockShiftsStore[shiftIndex]);
};

export const cancelMockShift = (id: string, companyId: string, notes?: string): Shift | undefined => {
  const shiftIndex = mockShiftsStore.findIndex((s) => s.id === id && s.companyId === companyId);
  if (shiftIndex === -1) {
    return undefined;
  }
   mockShiftsStore[shiftIndex] = {
    ...mockShiftsStore[shiftIndex],
    endTime: new Date().toISOString(), 
    status: 'Dibatalkan',
    notes: `${mockShiftsStore[shiftIndex].notes || ''}\nShift Dibatalkan: ${notes || 'Tidak ada alasan spesifik.'}`.trim(),
  };
  return populateShiftNames(mockShiftsStore[shiftIndex]);
}


export const getMockUsersForSelect = (): { value: string; label: string }[] => getMockUsers().map((u: User) => ({ value: u.id, label: u.name })); 

// Sekarang getMockOutletsForSelect membutuhkan companyId
export const getMockOutletsForSelect = (companyId: string): { value: string; label: string }[] => {
  return getMockOutlets(companyId).map(o => ({ value: o.id, label: o.name }));
};

export const getMockShiftsForSelect = (companyId?: string): {value: string; label: string}[] => {
  return getMockShifts(companyId).map(shift => {
    const startTimeFormatted = format(new Date(shift.startTime), "dd MMM, HH:mm", { locale: idLocale });
    const label = `Shift ${shift.id.slice(-4)}: ${shift.userName} @ ${shift.outletName} (${startTimeFormatted}${shift.status !== 'Berjalan' ? ` - ${shift.status}` : ''})`;
    return { value: shift.id, label };
  });
};

