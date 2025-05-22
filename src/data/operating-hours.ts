
import type { OperatingHours, OperatingHoursFormData, DayOperatingHours, DaysOfWeek, ShiftTemplate } from "@/types/operating-hours";
import { getMockOutlets } from "@/data/outlets"; // Menggunakan fungsi data outlet terpusat
import { ALL_DAYS } from "@/types/operating-hours";

const getDefaultShiftTemplates = (): ShiftTemplate[] => [
  { id: `st-${Date.now()}-1-${Math.random().toString(36).substr(2, 5)}`, name: "Shift Pagi", startTime: "09:00", closeTime: "15:00" },
  { id: `st-${Date.now()}-2-${Math.random().toString(36).substr(2, 5)}`, name: "Shift Sore", startTime: "15:00", closeTime: "21:00" },
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

// Fungsi untuk menginisialisasi mockOperatingHoursStore berdasarkan outlet yang ada
const initializeOperatingHours = (): OperatingHours[] => {
  const allCompaniesMock = [ // Asumsi ini adalah daftar perusahaan mock Anda jika tidak ada di file terpisah
    { id: 'comp_es_teh_jaya', name: 'Perusahaan Es Teh Jaya' },
    { id: 'comp_kopi_maju', name: 'Kedai Kopi Maju Jaya' },
    { id: 'comp_roti_lezat_selalu', name: 'Toko Roti Lezat Selalu' },
  ];

  let initialHours: OperatingHours[] = [];
  allCompaniesMock.forEach(company => {
    const outletsForCompany = getMockOutlets(company.id);
    outletsForCompany.forEach(outlet => {
      initialHours.push({
        id: `ophr-${outlet.id}`,
        companyId: company.id, // Tambahkan companyId
        outletId: outlet.id,
        outletName: outlet.name,
        schedule: getDefaultSchedule(),
      });
    });
  });
  return initialHours;
};


let mockOperatingHoursStore: OperatingHours[] = initializeOperatingHours();

// Example: Customize hours and shifts for one outlet
const outletPusatEsTehIndex = mockOperatingHoursStore.findIndex(oh => oh.outletId === "1" && oh.companyId === "comp_es_teh_jaya");
if (outletPusatEsTehIndex !== -1) {
  mockOperatingHoursStore[outletPusatEsTehIndex].schedule.saturday = { 
    isOpen: true, 
    openTime: "10:00", 
    closeTime: "22:00",
    shiftTemplates: [
      { id: "st-sat-1", name: "Shift Siang", startTime: "10:00", closeTime: "16:00" },
      { id: "st-sat-2", name: "Shift Malam", startTime: "16:00", closeTime: "22:00" },
    ]
  };
  mockOperatingHoursStore[outletPusatEsTehIndex].schedule.sunday = { 
    isOpen: true, 
    openTime: "12:00", 
    closeTime: "20:00",
    shiftTemplates: [
        { id: "st-sun-1", name: "Shift Full", startTime: "12:00", closeTime: "20:00"}
    ]
  };
   mockOperatingHoursStore[outletPusatEsTehIndex].schedule.monday.shiftTemplates = [ 
      { id: "st-mon-1", name: "Shift Pagi Utama", startTime: "09:00", closeTime: "17:00" },
      { id: "st-mon-2", name: "Shift Rapat", startTime: "17:00", closeTime: "18:00" }, 
    ];
}
const outletKopiMajuPusatIndex = mockOperatingHoursStore.findIndex(oh => oh.outletId === "3" && oh.companyId === "comp_kopi_maju"); 
if (outletKopiMajuPusatIndex !== -1) {
    mockOperatingHoursStore[outletKopiMajuPusatIndex].schedule.monday.isOpen = true;
    mockOperatingHoursStore[outletKopiMajuPusatIndex].schedule.monday.openTime = "08:00";
    mockOperatingHoursStore[outletKopiMajuPusatIndex].schedule.monday.closeTime = "20:00";
    mockOperatingHoursStore[outletKopiMajuPusatIndex].schedule.monday.shiftTemplates = [
      { id: "st-kopi-mon-1", name: "Shift Pagi Kopi", startTime: "08:00", closeTime: "14:00" },
      { id: "st-kopi-mon-2", name: "Shift Sore Kopi", startTime: "14:00", closeTime: "20:00" },
    ];
    mockOperatingHoursStore[outletKopiMajuPusatIndex].schedule.saturday.isOpen = false; 
    mockOperatingHoursStore[outletKopiMajuPusatIndex].schedule.saturday.shiftTemplates = [];
}


export const getMockOperatingHours = (companyId?: string): OperatingHours[] => {
  const hoursToReturn = companyId 
    ? mockOperatingHoursStore.filter(oh => oh.companyId === companyId)
    : []; // Jika tidak ada companyId, kembalikan kosong
    
  return hoursToReturn.map(oh => {
    const outlet = getMockOutlets(oh.companyId).find(o => o.id === oh.outletId);
    return {
      ...oh,
      outletName: outlet?.name || oh.outletName || "Outlet Tidak Diketahui",
    };
  });
};

export const getMockOperatingHoursByOutletId = (outletId: string, companyId?: string): OperatingHours | undefined => {
  let hours = mockOperatingHoursStore.find(oh => oh.outletId === outletId);
  if (hours) {
    if (companyId && hours.companyId !== companyId) return undefined; // Pastikan milik perusahaan yg benar
    const outlet = getMockOutlets(hours.companyId).find(o => o.id === outletId);
    return {
      ...hours,
      outletName: outlet?.name || hours.outletName || "Outlet Tidak Diketahui",
    };
  }
  // Jika tidak ada data jam operasional tersimpan, buat default untuk outlet tersebut jika outlet ada
  if (companyId) {
      const outlet = getMockOutlets(companyId).find(o => o.id === outletId);
      if (outlet) {
        return {
          id: `ophr-${outletId}-${Date.now()}`, // Ensure unique ID for new default
          companyId: companyId,
          outletId: outletId,
          outletName: outlet.name,
          schedule: getDefaultSchedule(),
        };
      }
  }
  return undefined;
};

export const upsertMockOperatingHours = (outletId: string, formData: OperatingHoursFormData): OperatingHours | undefined => {
  const outlet = getMockOutlets().find(o => o.id === outletId) || getMockOutlets("comp_es_teh_jaya").find(o => o.id === outletId) || getMockOutlets("comp_kopi_maju").find(o => o.id === outletId) || getMockOutlets("comp_roti_lezat_selalu").find(o => o.id === outletId); // Need to find outlet from any company to get its companyId
  if (!outlet || !outlet.companyId) {
    console.error(`Outlet dengan ID ${outletId} atau companyId-nya tidak ditemukan.`);
    return undefined;
  }
  const companyId = outlet.companyId;

  const existingIndex = mockOperatingHoursStore.findIndex(oh => oh.outletId === outletId && oh.companyId === companyId);
  
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
    id: existingIndex !== -1 ? mockOperatingHoursStore[existingIndex].id : `ophr-${outletId}-${Date.now()}`,
    companyId: companyId,
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

export const deleteMockOperatingHoursForOutlet = (outletId: string, companyId: string): boolean => {
  const initialLength = mockOperatingHoursStore.length;
  mockOperatingHoursStore = mockOperatingHoursStore.filter(oh => !(oh.outletId === outletId && oh.companyId === companyId));
  const success = mockOperatingHoursStore.length < initialLength;
  if (success) {
    console.log(`Jam operasional untuk outlet ${outletId} perusahaan ${companyId} telah dihapus.`);
  }
  return success;
};
