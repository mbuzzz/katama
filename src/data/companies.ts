
import type { Company } from '@/types/company';

// Mock data for companies
let mockCompaniesStore: Company[] = [
  { id: 'comp_es_teh_jaya', name: 'Perusahaan Es Teh Jaya' },
  { id: 'comp_kopi_maju', name: 'Kedai Kopi Maju Jaya' },
  { id: 'comp_roti_lezat', name: 'Toko Roti Lezat Selalu' },
];

export const getMockCompanies = (): Company[] => {
  return [...mockCompaniesStore];
};

export const getMockCompanyById = (id: string): Company | undefined => {
  return mockCompaniesStore.find(company => company.id === id);
};

// Functions to add/update/delete companies can be added later
// export const addMockCompany = (companyData: Omit<Company, 'id'>): Company => { ... }
// export const updateMockCompany = (id: string, updates: Partial<Omit<Company, 'id'>>): Company | undefined => { ... }
// export const deleteMockCompany = (id: string): boolean => { ... }
