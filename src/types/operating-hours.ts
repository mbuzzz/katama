
export interface ShiftTemplate {
  id: string; // ID unik untuk template shift, bisa uuid atau kombinasi
  name: string; // e.g., "Pagi", "Siang", "Malam"
  startTime: string; // "HH:mm" format
  closeTime: string; // "HH:mm" format, diganti dari endTime agar konsisten dengan DayOperatingHours
}

export interface DayOperatingHours {
  isOpen: boolean;
  openTime: string; // "HH:mm" format
  closeTime: string; // "HH:mm" format
  shiftTemplates?: ShiftTemplate[];
}

export type DaysOfWeek = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export const ALL_DAYS: DaysOfWeek[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export const DAY_NAMES_ID: Record<DaysOfWeek, string> = {
  monday: "Senin",
  tuesday: "Selasa",
  wednesday: "Rabu",
  thursday: "Kamis",
  friday: "Jumat",
  saturday: "Sabtu",
  sunday: "Minggu",
};

export interface OperatingHours {
  id: string; // Unique ID for the operating hours setting, can be `ophr-${outletId}`
  outletId: string;
  outletName?: string; // Denormalized for easier display
  schedule: Record<DaysOfWeek, DayOperatingHours>;
}

// FormData will be slightly different as we might handle outletId separately
export interface OperatingHoursFormData {
  schedule: Record<DaysOfWeek, DayOperatingHours>;
}
