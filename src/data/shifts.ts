
import type { Shift, ShiftFormData, EndShiftData } from '@/types/shift';
import { getMockUsers } from '@/data/users'; 
import { getMockOutlets, getMockOutletById } from '@/data/outlets'; 
import { differenceInMinutes, formatDistanceStrict, format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import type { User } from '@/types/user';
import type { Outlet } from '@/types/outlet';

let mockShiftsStore: Shift[] = [
  {
    id: 'shift1',
    companyId: "comp_es_teh_jaya",
    userId: '2', 
    userName: 'Budi Santoso',
    outletId: '1', 
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
    userId: '1', 
    userName: 'Ana Maria',
    outletId: '1', 
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
    userId: '3', 
    userName: 'Candra Wijaya',
    outletId: '3', 
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

const populateShiftNames = (shift: Shift): Shift => {
  const users = getMockUsers(shift.companyId); // Ambil pengguna dari perusahaan shift
  const user = users.find(u => u.id === shift.userId);
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
    : []; 

  return filteredShifts
    .map(populateShiftNames)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

export const getMockShiftById = (id: string, companyId?: string): Shift | undefined => {
  const shift = mockShiftsStore.find((s) => s.id === id);
  if (shift) {
    if (companyId && shift.companyId !== companyId) {
      return undefined; 
    }
    return populateShiftNames(shift);
  }
  return undefined;
};

export const addMockShift = (shiftData: ShiftFormData, companyId: string): Shift => {
  if (!companyId) throw new Error("companyId is required to add a shift.");
  const users = getMockUsers(companyId); // Ambil pengguna dari perusahaan ini
  const user = users.find(u => u.id === shiftData.userId);
  const outlet = getMockOutletById(shiftData.outletId, companyId); 

  if (!outlet) throw new Error(`Outlet dengan ID ${shiftData.outletId} tidak ditemukan untuk perusahaan ini.`);
  if (!user) throw new Error(`Pengguna dengan ID ${shiftData.userId} tidak ditemukan di perusahaan ini.`);


  const newShift: Shift = {
    id: `shift${mockShiftsStore.length + 1}-${Date.now().toString().slice(-4)}`,
    companyId: companyId,
    startTime: new Date().toISOString(),
    endTime: null,
    finalCash: null,
    totalSales: null, 
    status: 'Berjalan',
    ...shiftData,
    userName: user.name,
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
  // Simulate sales calculation based on cash difference for mock
  // In a real app, totalSales would be accumulated from actual POS transactions during the shift
  let calculatedSales = finalCash - shiftToEnd.initialCash;
  if (calculatedSales < 0) calculatedSales = 0; // Sales cannot be negative

  mockShiftsStore[shiftIndex] = {
    ...shiftToEnd,
    endTime: new Date().toISOString(),
    finalCash,
    totalSales: calculatedSales, // Use calculated sales for mock
    notes: `${shiftToEnd.notes || ''}\nCatatan Akhir: ${endShiftData.endNotes || 'Tidak ada catatan.'}`.trim(),
    status: 'Selesai',
  };
  // After ending shift, potentially award points based on totalSales
  awardPointsToUser(shiftToEnd.userId, calculatedSales); 
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


export const getMockUsersForSelect = (companyId: string): { value: string; label: string }[] => {
  if (!companyId) return [];
  return getMockUsers(companyId).map((u: User) => ({ value: u.id, label: u.name })); 
};

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

