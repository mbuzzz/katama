
import type { Outlet, OutletFormData } from "@/types/outlet";

// Mock data - sekarang dengan companyId
let mockOutletsStore: Outlet[] = [
  { id: "1", companyId: "comp_es_teh_jaya", name: "KATAMA Pusat (Es Teh)", address: "Jl. Merdeka No. 1, Kota Bahagia", status: "Aktif", manager: "Budi Santoso" },
  { id: "2", companyId: "comp_es_teh_jaya", name: "KATAMA Express Stasiun (Es Teh)", address: "Stasiun Kota Lama Lt. 1, Kota Bahagia", status: "Aktif", manager: "Siti Aminah" },
  { id: "3", companyId: "comp_kopi_maju", name: "Kedai Kopi Maju Jaya Pusat", address: "Jl. Kopi No. 10, Kota Kopi", status: "Aktif", manager: "Candra Wijaya" },
  { id: "4", companyId: "comp_roti_lezat_selalu", name: "Toko Roti Lezat (Pusat)", address: "Jl. Roti Enak No. 5, Kota Roti", status: "Aktif", manager: "Rina Melati" },
  { id: "5", companyId: "comp_kopi_maju", name: "Kopi Maju Cabang Taman", address: "Jl. Taman Indah Blok A1, Kota Kopi", status: "Tidak Aktif", manager: "-" },
];

export const getMockOutlets = (companyId?: string): Outlet[] => {
  if (companyId) {
    return [...mockOutletsStore].filter(outlet => outlet.companyId === companyId);
  }
  // Mengembalikan array kosong jika tidak ada companyId, karena outlet harus spesifik per perusahaan
  return []; 
};

export const getMockOutletById = (id: string, companyId?: string): Outlet | undefined => {
  const outlet = mockOutletsStore.find(o => o.id === id);
  // Jika companyId diberikan, pastikan outlet tersebut milik perusahaan yang benar
  if (outlet && companyId && outlet.companyId !== companyId) {
    return undefined;
  }
  return outlet;
};

// Function to get company details based on companyId, needed for edit page header
// This might be better placed in /data/companies.ts but including a basic version here for simplicity if needed by outlet logic
export const getMockCompanyById = (companyId: string): { id: string; name: string } | undefined => {
  // This is a simplified mock. In a real app, you'd fetch this from your companies data source.
  // For now, assuming companyId itself can be used or you have a predefined list.
  const companies = [
    { id: 'comp_es_teh_jaya', name: 'Perusahaan Es Teh Jaya' },
    { id: 'comp_kopi_maju', name: 'Kedai Kopi Maju Jaya' },
    { id: 'comp_roti_lezat_selalu', name: 'Toko Roti Lezat Selalu' },
  ];
  return companies.find(c => c.id === companyId);
};


export const addMockOutlet = (outletData: OutletFormData, companyId: string): Outlet => {
  if (!companyId) {
    throw new Error("companyId diperlukan untuk menambahkan outlet.");
  }
  const newOutlet: Outlet = {
    id: `outlet-${mockOutletsStore.length + 1}-${Date.now().toString().slice(-4)}`,
    ...outletData,
    companyId: companyId,
  };
  mockOutletsStore.push(newOutlet);
  // Dispatch event to notify listeners (e.g., operating hours page) that outlets might have changed
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('outletListChanged', { detail: { companyId } }));
  }
  return newOutlet;
};

export const updateMockOutlet = (id: string, updates: Partial<OutletFormData>, companyId: string): Outlet | undefined => {
  const outletIndex = mockOutletsStore.findIndex(o => o.id === id && o.companyId === companyId);
  if (outletIndex === -1) {
    console.warn(`Outlet dengan ID ${id} tidak ditemukan untuk perusahaan ${companyId} saat update.`);
    return undefined;
  }
  mockOutletsStore[outletIndex] = { ...mockOutletsStore[outletIndex], ...updates };
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('outletListChanged', { detail: { companyId } }));
  }
  return mockOutletsStore[outletIndex];
};

export const deleteMockOutlet = (id: string, companyId: string): boolean => {
  const initialLength = mockOutletsStore.length;
  mockOutletsStore = mockOutletsStore.filter(o => !(o.id === id && o.companyId === companyId));
  const success = mockOutletsStore.length < initialLength;
  if (success && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('outletListChanged', { detail: { companyId } }));
    // Also, if the deleted outlet was the one whose hours are being viewed, the operating hours page might need a more specific update
  }
  return success;
};
