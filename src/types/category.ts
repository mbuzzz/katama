
export interface Category {
  id: string;
  name: string;
  description?: string;
  companyId: string; // Ditambahkan untuk isolasi data
}
