
export interface Shift {
  id: string;
  userId: string;
  userName?: string; // Denormalized for display
  outletId: string;
  outletName?: string; // Denormalized for display
  startTime: string; // ISO string date
  endTime?: string | null; // ISO string date, null if ongoing
  initialCash: number;
  finalCash?: number | null;
  totalSales?: number | null; // Calculated at end of shift
  notes?: string;
  status: 'Berjalan' | 'Selesai' | 'Dibatalkan';
}

export interface ShiftFormData {
  userId: string;
  outletId: string;
  initialCash: number;
  notes?: string;
}

export interface EndShiftFormData {
  finalCash: number;
  notes?: string;
}
