
import type { OperatingHours, OperatingHoursFormData, DayOperatingHours, DaysOfWeek, ShiftTemplate } from "@/types/operating-hours";
import { mockOutlets } from "@/app/dashboard/settings/outlets/page";
import { ALL_DAYS } from "@/types/operating-hours";

const getDefaultShiftTemplates = (): ShiftTemplate[] => [
  { id: `st-${Date.now()}-1`, name: "Shift Pagi", startTime: "09:00", closeTime: "15:00" },
  { id: `st-${Date.now()}-2`, name: "Shift Sore", startTime: "15:00", closeTime: "21:00" },
];

const getDefaultSchedule = (): Record<DaysOfWeek, DayOperatingHours> => {
  const schedule: Partial<Record<DaysOfWeek, DayOperatingHours>> = {};
  ALL_DAYS.forEach(day => {
    schedule[day] = { 
      isOpen: true, 
      openTime: "09:00", 
      closeTime: "21:00",
      shiftTemplates: getDefaultShiftTemplates(),
    };
  });
  return schedule as Record<DaysOfWeek, DayOperatingHours>;
};


let mockOperatingHoursStore: OperatingHours[] = mockOutlets.map(outlet => ({
  id: `ophr-${outlet.id}`,
  outletId: outlet.id,
  outletName: outlet.name,
  schedule: getDefaultSchedule(),
}));

// Example: Customize hours and shifts for one outlet
const outletPusatIndex = mockOperatingHoursStore.findIndex(oh => oh.outletId === "1"); // KATAMA Pusat
if (outletPusatIndex !== -1) {
  mockOperatingHoursStore[outletPusatIndex].schedule.saturday = { 
    isOpen: true, 
    openTime: "10:00", 
    closeTime: "22:00",
    shiftTemplates: [
      { id: "st-sat-1", name: "Shift Siang", startTime: "10:00", closeTime: "16:00" },
      { id: "st-sat-2", name: "Shift Malam", startTime: "16:00", closeTime: "22:00" },
    ]
  };
  mockOperatingHoursStore[outletPusatIndex].schedule.sunday = { 
    isOpen: true, // Misal Minggu tetap buka
    openTime: "12:00", 
    closeTime: "20:00",
    shiftTemplates: [
        { id: "st-sun-1", name: "Shift Full", startTime: "12:00", closeTime: "20:00"}
    ]
  };
   mockOperatingHoursStore[outletPusatIndex].schedule.monday.shiftTemplates = [ // Custom Senin
      { id: "st-mon-1", name: "Shift Pagi Utama", startTime: "09:00", closeTime: "17:00" },
      { id: "st-mon-2", name: "Shift Rapat", startTime: "17:00", closeTime: "18:00" }, // Contoh shift pendek
    ];
}
const outletSudirmanIndex = mockOperatingHoursStore.findIndex(oh => oh.outletId === "2"); // KATAMA Cabang Sudirman
if (outletSudirmanIndex !== -1) {
    mockOperatingHoursStore[outletSudirmanIndex].schedule.monday.isOpen = true;
    mockOperatingHoursStore[outletSudirmanIndex].schedule.monday.openTime = "08:00";
    mockOperatingHoursStore[outletSudirmanIndex].schedule.monday.closeTime = "20:00";
    mockOperatingHoursStore[outletSudirmanIndex].schedule.monday.shiftTemplates = [
      { id: "st-sud-mon-1", name: "Shift Pagi A", startTime: "08:00", closeTime: "14:00" },
      { id: "st-sud-mon-2", name: "Shift Sore A", startTime: "14:00", closeTime: "20:00" },
    ];
    mockOperatingHoursStore[outletSudirmanIndex].schedule.saturday.isOpen = false; // Contoh Sabtu tutup
    mockOperatingHoursStore[outletSudirmanIndex].schedule.saturday.shiftTemplates = [];
}


export const getMockOperatingHours = (): OperatingHours[] => {
  return [...mockOperatingHoursStore].map(oh => {
    const outlet = mockOutlets.find(o => o.id === oh.outletId);
    return {
      ...oh,
      outletName: outlet?.name || oh.outletName || "Outlet Tidak Diketahui",
    };
  });
};

export const getMockOperatingHoursByOutletId = (outletId: string): OperatingHours | undefined => {
  let hours = mockOperatingHoursStore.find(oh => oh.outletId === outletId);
  if (hours) {
    const outlet = mockOutlets.find(o => o.id === outletId);
    return {
      ...hours,
      outletName: outlet?.name || hours.outletName || "Outlet Tidak Diketahui",
    };
  }
  const outlet = mockOutlets.find(o => o.id === outletId);
  if (outlet) {
    return {
      id: `ophr-${outletId}`,
      outletId: outletId,
      outletName: outlet.name,
      schedule: getDefaultSchedule(),
    };
  }
  return undefined;
};

export const upsertMockOperatingHours = (outletId: string, formData: OperatingHoursFormData): OperatingHours | undefined => {
  const outlet = mockOutlets.find(o => o.id === outletId);
  if (!outlet) {
    console.error(`Outlet dengan ID ${outletId} tidak ditemukan.`);
    return undefined;
  }

  const existingIndex = mockOperatingHoursStore.findIndex(oh => oh.outletId === outletId);
  
  // Pastikan setiap shift template memiliki ID unik jika belum ada
  const scheduleWithTemplateIds = { ...formData.schedule };
  ALL_DAYS.forEach(dayKey => {
    const daySchedule = scheduleWithTemplateIds[dayKey];
    if (daySchedule.shiftTemplates) {
      daySchedule.shiftTemplates = daySchedule.shiftTemplates.map(st => ({
        ...st,
        id: st.id || `st-${dayKey}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` 
      }));
    }
  });

  const operatingHoursData: OperatingHours = {
    id: existingIndex !== -1 ? mockOperatingHoursStore[existingIndex].id : `ophr-${outletId}`,
    outletId: outletId,
    outletName: outlet.name,
    schedule: scheduleWithTemplateIds,
  };

  if (existingIndex !== -1) {
    mockOperatingHoursStore[existingIndex] = operatingHoursData;
  } else {
    mockOperatingHoursStore.push(operatingHoursData);
  }
  return operatingHoursData;
};

export const deleteMockOperatingHoursForOutlet = (outletId: string): boolean => {
  const initialLength = mockOperatingHoursStore.length;
  mockOperatingHoursStore = mockOperatingHoursStore.filter(oh => oh.outletId !== outletId);
  return mockOperatingHoursStore.length < initialLength;
};
