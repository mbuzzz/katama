
import type { Shift, ShiftFormData, EndShiftData } from '@/types/shift';
import { getMockUsers } from '@/data/users'; 
import { mockOutlets } from '@/app/dashboard/settings/outlets/page'; 
import { differenceInMinutes, formatDistanceStrict, format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import type { User } from '@/types/user';

let mockShiftsStore: Shift[] = [
  {
    id: 'shift1',
    userId: '2', // Budi Santoso
    userName: 'Budi Santoso',
    outletId: '1', // KATAMA Pusat
    outletName: 'KATAMA Pusat',
    startTime: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    initialCash: 500000,
    finalCash: 1250000,
    totalSales: 750000,
    notes: 'Shift pagi berjalan lancar.',
    status: 'Selesai',
  },
  {
    id: 'shift2',
    userId: '1', // Ana Maria
    userName: 'Ana Maria',
    outletId: '1', // KATAMA Pusat
    outletName: 'KATAMA Pusat',
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    endTime: null,
    initialCash: 300000,
    finalCash: null,
    totalSales: null,
    notes: 'Memulai shift sore.',
    status: 'Berjalan',
  },
  {
    id: 'shift3',
    userId: '4', // Dewi Lestari
    userName: 'Dewi Lestari',
    outletId: '2', // Cabang Sudirman
    outletName: 'KATAMA Cabang Sudirman',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    endTime: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), // Yesterday
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
  const users = getMockUsers();
  const user = users.find(u => u.id === shift.userId);
  const outlet = mockOutlets.find(o => o.id === shift.outletId);
  return {
    ...shift,
    userName: user?.name || 'Tidak Diketahui',
    outletName: outlet?.name || 'Tidak Diketahui',
    duration: calculateDuration(shift.startTime, shift.endTime),
  };
};


export const getMockShifts = (): Shift[] => {
  return [...mockShiftsStore]
    .map(populateShiftNames)
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

export const getMockShiftById = (id: string): Shift | undefined => {
  const shift = mockShiftsStore.find((s) => s.id === id);
  if (shift) {
    return populateShiftNames(shift);
  }
  return undefined;
};

export const addMockShift = (shiftData: ShiftFormData): Shift => {
  const users = getMockUsers();
  const user = users.find(u => u.id === shiftData.userId);
  const outlet = mockOutlets.find(o => o.id === shiftData.outletId);

  const newShift: Shift = {
    id: `shift${mockShiftsStore.length + 1}-${Date.now().toString().slice(-4)}`,
    startTime: new Date().toISOString(),
    endTime: null,
    finalCash: null,
    totalSales: null, 
    status: 'Berjalan',
    ...shiftData,
    userName: user?.name || 'Tidak Diketahui',
    outletName: outlet?.name || 'Tidak Diketahui',
    duration: null,
  };
  mockShiftsStore.unshift(newShift); 
  return populateShiftNames(newShift);
};

export const endMockShift = (id: string, endShiftData: EndShiftData): Shift | undefined => {
  const shiftIndex = mockShiftsStore.findIndex((s) => s.id === id);
  if (shiftIndex === -1) {
    return undefined;
  }

  const shiftToEnd = mockShiftsStore[shiftIndex];
  if (shiftToEnd.status !== 'Berjalan') {
    throw new Error("Hanya shift yang sedang berjalan yang bisa diakhiri.");
  }

  const finalCash = endShiftData.finalCashInput;
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

export const cancelMockShift = (id: string, notes?: string): Shift | undefined => {
  const shiftIndex = mockShiftsStore.findIndex((s) => s.id === id);
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


export const getMockUsersForSelect = () => getMockUsers().map((u: User) => ({ value: u.id, label: u.name })); 


export const getMockOutletsForSelect = () => mockOutlets.map(o => ({ value: o.id, label: o.name }));

export const getMockShiftsForSelect = () => {
  return getMockShifts().map(shift => {
    const startTimeFormatted = format(new Date(shift.startTime), "dd MMM, HH:mm", { locale: idLocale });
    const label = `Shift ${shift.id.slice(-4)}: ${shift.userName} @ ${shift.outletName} (${startTimeFormatted}${shift.status !== 'Berjalan' ? ` - ${shift.status}` : ''})`;
    return { value: shift.id, label };
  });
};
