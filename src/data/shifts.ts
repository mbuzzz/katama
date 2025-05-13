
import type { Shift, ShiftFormData, EndShiftData } from '@/types/shift';
import { mockUsers } from '@/app/dashboard/settings/users/page'; 
import { mockOutlets } from '@/app/dashboard/settings/outlets/page'; 
import { differenceInMinutes, formatDistanceStrict } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import type { User } from '@/types/user'; // Import User type

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
];

const calculateDuration = (startTime: string, endTime: string | null): string | null => {
  if (!endTime) return null;
  const start = new Date(startTime);
  const end = new Date(endTime);
  return formatDistanceStrict(end, start, { locale: idLocale, unit: 'minute' });
};

export const getMockShifts = (): Shift[] => {
  return [...mockShiftsStore].map(shift => ({
    ...shift,
    userName: mockUsers.find(u => u.id === shift.userId)?.name || 'Tidak Diketahui',
    outletName: mockOutlets.find(o => o.id === shift.outletId)?.name || 'Tidak Diketahui',
    duration: calculateDuration(shift.startTime, shift.endTime),
  })).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

export const getMockShiftById = (id: string): Shift | undefined => {
  const shift = mockShiftsStore.find((s) => s.id === id);
  if (shift) {
    return {
      ...shift,
      userName: mockUsers.find(u => u.id === shift.userId)?.name || 'Tidak Diketahui',
      outletName: mockOutlets.find(o => o.id === shift.outletId)?.name || 'Tidak Diketahui',
      duration: calculateDuration(shift.startTime, shift.endTime),
    };
  }
  return undefined;
};

export const addMockShift = (shiftData: ShiftFormData): Shift => {
  const user = mockUsers.find(u => u.id === shiftData.userId);
  const outlet = mockOutlets.find(o => o.id === shiftData.outletId);

  const newShift: Shift = {
    id: `shift${mockShiftsStore.length + 1}-${Date.now().toString().slice(-4)}`,
    startTime: new Date().toISOString(),
    endTime: null,
    finalCash: null,
    totalSales: null, // Sales are typically tracked via POS transactions during the shift
    status: 'Berjalan',
    ...shiftData,
    userName: user?.name || 'Tidak Diketahui',
    outletName: outlet?.name || 'Tidak Diketahui',
    duration: null,
  };
  mockShiftsStore.unshift(newShift); // Add to the beginning
  return newShift;
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
  // For simplicity in mock, totalSales is finalCash - initialCash.
  // In a real system, totalSales would be the sum of transactions by this user during this shift.
  const totalSales = finalCash - shiftToEnd.initialCash; 

  mockShiftsStore[shiftIndex] = {
    ...shiftToEnd,
    endTime: new Date().toISOString(),
    finalCash,
    totalSales, // Store the calculated sales
    notes: `${shiftToEnd.notes || ''}\nCatatan Akhir: ${endShiftData.endNotes || 'Tidak ada catatan.'}`.trim(),
    status: 'Selesai',
  };
  // Duration will be calculated by getMockShifts or getMockShiftById
  return mockShiftsStore[shiftIndex];
};

export const cancelMockShift = (id: string, notes?: string): Shift | undefined => {
  const shiftIndex = mockShiftsStore.findIndex((s) => s.id === id);
  if (shiftIndex === -1) {
    return undefined;
  }
   mockShiftsStore[shiftIndex] = {
    ...mockShiftsStore[shiftIndex],
    endTime: new Date().toISOString(), // Cancellation also marks an end time
    status: 'Dibatalkan',
    notes: `${mockShiftsStore[shiftIndex].notes || ''}\nShift Dibatalkan: ${notes || 'Tidak ada alasan spesifik.'}`.trim(),
  };
  // Duration will be calculated
  return mockShiftsStore[shiftIndex];
}

// For shift form user selection
export const getMockUsersForSelect = () => mockUsers.map((u: User) => ({ value: u.id, label: u.name })); // Ensure 'u' is typed as User

// For shift form outlet selection
export const getMockOutletsForSelect = () => mockOutlets.map(o => ({ value: o.id, label: o.name }));

