
import type { OperatingHours, OperatingHoursFormData, DayOperatingHours, DaysOfWeek } from "@/types/operating-hours";
import { mockOutlets } from "@/app/dashboard/settings/outlets/page"; // Assuming mockOutlets are here
import { ALL_DAYS } from "@/types/operating-hours";

const getDefaultSchedule = (): Record<DaysOfWeek, DayOperatingHours> => {
  const schedule: Partial<Record<DaysOfWeek, DayOperatingHours>> = {};
  ALL_DAYS.forEach(day => {
    schedule[day] = { isOpen: true, openTime: "09:00", closeTime: "17:00" };
  });
  return schedule as Record<DaysOfWeek, DayOperatingHours>;
};


let mockOperatingHoursStore: OperatingHours[] = mockOutlets.map(outlet => ({
  id: `ophr-${outlet.id}`,
  outletId: outlet.id,
  outletName: outlet.name,
  schedule: getDefaultSchedule(), // Default schedule for all outlets initially
}));

// Example: Customize hours for one outlet
const outletPusatIndex = mockOperatingHoursStore.findIndex(oh => oh.outletId === "1");
if (outletPusatIndex !== -1) {
  mockOperatingHoursStore[outletPusatIndex].schedule.saturday = { isOpen: true, openTime: "10:00", closeTime: "20:00" };
  mockOperatingHoursStore[outletPusatIndex].schedule.sunday = { isOpen: false, openTime: "09:00", closeTime: "17:00" };
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
  // If not found, create a default one for the form
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
  const operatingHoursData: OperatingHours = {
    id: `ophr-${outletId}`,
    outletId: outletId,
    outletName: outlet.name,
    schedule: formData.schedule,
  };

  if (existingIndex !== -1) {
    mockOperatingHoursStore[existingIndex] = operatingHoursData;
  } else {
    mockOperatingHoursStore.push(operatingHoursData);
  }
  return operatingHoursData;
};

// Delete is not strictly necessary if hours are tied to outlets and outlets are deleted,
// but can be added if operating hours settings can be removed independently.
export const deleteMockOperatingHoursForOutlet = (outletId: string): boolean => {
  const initialLength = mockOperatingHoursStore.length;
  mockOperatingHoursStore = mockOperatingHoursStore.filter(oh => oh.outletId !== outletId);
  return mockOperatingHoursStore.length < initialLength;
};
