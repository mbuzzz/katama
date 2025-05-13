
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
  duration?: string | null; // Calculated for display or reporting
  notes?: string;
  status: 'Berjalan' | 'Selesai' | 'Dibatalkan';
}

export interface ShiftFormData {
  userId: string;
  outletId: string;
  initialCash: number;
  notes?: string;
}

// Renamed for clarity in form context
export interface EndShiftDialogFormData {
  finalCashInput: number; // Field for user input
  endNotes?: string; // Field for user input
}
// This is what's passed to the actual endMockShift function
export interface EndShiftData extends EndShiftDialogFormData {
  // Potentially add other derived data if needed here in future
}

