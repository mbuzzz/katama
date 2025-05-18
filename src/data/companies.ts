
import type { Company, CompanyFormData } from '@/types/company';

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

export const addMockCompany = (companyData: CompanyFormData): Company => {
  const newCompany: Company = {
    id: `comp_${companyData.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now().toString().slice(-5)}`,
    name: companyData.name,
  };
  mockCompaniesStore.push(newCompany);
  return newCompany;
};

export const updateMockCompany = (id: string, updates: CompanyFormData): Company | undefined => {
  const companyIndex = mockCompaniesStore.findIndex(company => company.id === id);
  if (companyIndex === -1) {
    return undefined;
  }
  mockCompaniesStore[companyIndex] = { ...mockCompaniesStore[companyIndex], ...updates };
  return mockCompaniesStore[companyIndex];
};

export const deleteMockCompany = (id: string): boolean => {
  const initialLength = mockCompaniesStore.length;
  mockCompaniesStore = mockCompaniesStore.filter(company => company.id !== id);
  // Perlu juga menghapus ID perusahaan yang dipilih jika itu yang dihapus
  if (typeof window !== 'undefined') {
    const selectedCompanyIdKey = 'katama-pos-selectedCompanyId';
    if (localStorage.getItem(selectedCompanyIdKey) === id) {
        localStorage.removeItem(selectedCompanyIdKey);
        // Mungkin default ke perusahaan pertama jika ada, atau kosongkan
        if (mockCompaniesStore.length > 0) {
            localStorage.setItem(selectedCompanyIdKey, mockCompaniesStore[0].id);
        }
         // Memberi tahu CompanySwitcher untuk memperbarui
        window.dispatchEvent(new CustomEvent('companyListChanged'));
    }
  }
  return mockCompaniesStore.length < initialLength;
};
