
export interface Outlet {
  id: string;
  companyId: string; // Kunci untuk isolasi data
  name: string;
  address: string;
  status: "Aktif" | "Tidak Aktif";
  manager?: string; // Opsional
}

export interface OutletFormData {
  name: string;
  address: string;
  status: "Aktif" | "Tidak Aktif";
  manager?: string;
}
