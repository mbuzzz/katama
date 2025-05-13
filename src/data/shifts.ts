
import type { Shift, ShiftFormData, EndShiftFormData } from '@/types/shift';
import { mockUsers } from '@/app/dashboard/settings/users/page'; // Assuming this exports users
import { mockOutlets } // Assuming this exports outlets
from '@/app/dashboard/settings/outlets/page'; 

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

export const getMockShifts = (): Shift[] => {
  return [...mockShiftsStore].map(shift => ({
    ...shift,
    userName: mockUsers.find(u => u.id === shift.userId)?.name || 'Tidak Diketahui',
    outletName: mockOutlets.find(o => o.id === shift.outletId)?.name || 'Tidak Diketahui',
  })).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
};

export const getMockShiftById = (id: string): Shift | undefined => {
  const shift = mockShiftsStore.find((s) => s.id === id);
  if (shift) {
    return {
      ...shift,
      userName: mockUsers.find(u => u.id === shift.userId)?.name || 'Tidak Diketahui',
      outletName: mockOutlets.find(o => o.id === shift.outletId)?.name || 'Tidak Diketahui',
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
    totalSales: null,
    status: 'Berjalan',
    ...shiftData,
    userName: user?.name || 'Tidak Diketahui',
    outletName: outlet?.name || 'Tidak Diketahui',
  };
  mockShiftsStore.unshift(newShift); // Add to the beginning
  return newShift;
};

export const endMockShift = (id: string, endShiftData: EndShiftFormData): Shift | undefined => {
  const shiftIndex = mockShiftsStore.findIndex((s) => s.id === id);
  if (shiftIndex === -1) {
    return undefined;
  }

  const shiftToEnd = mockShiftsStore[shiftIndex];
  if (shiftToEnd.status !== 'Berjalan') {
    throw new Error("Hanya shift yang sedang berjalan yang bisa diakhiri.");
  }

  const finalCash = endShiftData.finalCash;
  const totalSales = finalCash - shiftToEnd.initialCash; // Simple calculation

  mockShiftsStore[shiftIndex] = {
    ...shiftToEnd,
    endTime: new Date().toISOString(),
    finalCash,
    totalSales,
    notes: `${shiftToEnd.notes || ''}\nCatatan Akhir: ${endShiftData.notes || ''}`.trim(),
    status: 'Selesai',
  };
  return mockShiftsStore[shiftIndex];
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
  return mockShiftsStore[shiftIndex];
}

// For shift form user selection
export const getMockUsersForSelect = () => mockUsers.map(u => ({ value: u.id, label: u.name }));

// For shift form outlet selection
export const getMockOutletsForSelect = () => mockOutlets.map(o => ({ value: o.id, label: o.name }));
