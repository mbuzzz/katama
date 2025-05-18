
import type { Category } from "@/types/category";

// In-memory store for mock categories
let mockCategoriesStore: Category[] = [
  { id: "1", name: "Minuman Dingin", description: "Berbagai minuman dingin penyegar.", companyId: "comp_es_teh_jaya" },
  { id: "2", name: "Minuman Panas", description: "Minuman hangat untuk menemani.", companyId: "comp_es_teh_jaya" },
  { id: "3", name: "Makanan Berat", description: "Pilihan makanan utama yang mengenyangkan.", companyId: "comp_kopi_maju" },
  { id: "4", name: "Makanan Ringan", description: "Camilan lezat untuk setiap saat.", companyId: "comp_es_teh_jaya" },
  { id: "5", name: "Hidangan Penutup", description: "Hidangan penutup yang manis dan nikmat.", companyId: "comp_kopi_maju" },
  { id: "6", name: "Roti & Pastri", description: "Produk bakery segar setiap hari.", companyId: "comp_roti_lezat_selalu" },
  { id: "7", name: "Tambahan", description: "Ekstra topping atau item pelengkap.", companyId: "comp_es_teh_jaya" },
];

// Fungsi getMockCategories sekarang idealnya menerima companyId untuk filter
// Untuk saat ini, kita bisa membiarkannya mengembalikan semua, atau memfilter berdasarkan companyId jika disediakan
export const getMockCategories = (companyId?: string): Category[] => {
  if (companyId) {
    return [...mockCategoriesStore].filter(category => category.companyId === companyId);
  }
  return [...mockCategoriesStore]; // Kembalikan semua jika tidak ada companyId (perilaku sementara)
};

// getMockCategoryById juga idealnya mempertimbangkan companyId, tapi ID kategori harus unik global atau per company
export const getMockCategoryById = (id: string, companyId?: string): Category | undefined => {
  const category = mockCategoriesStore.find(category => category.id === id);
  if (category && companyId && category.companyId !== companyId) {
    // Jika companyId diberikan dan tidak cocok, anggap tidak ditemukan untuk perusahaan ini
    return undefined; 
  }
  return category;
};

// addMockCategory sekarang membutuhkan companyId
export const addMockCategory = (categoryData: Omit<Category, 'id'>, companyId: string): Category => {
  const newCategory: Category = {
    id: (mockCategoriesStore.length + 1).toString(), // Simple ID generation, perlu strategi ID yang lebih baik untuk multi-tenant
    ...categoryData,
    companyId: companyId, // Simpan companyId
  };
  mockCategoriesStore.push(newCategory);
  return newCategory;
};

// updateMockCategory idealnya juga menggunakan companyId untuk memastikan update pada data yang benar
export const updateMockCategory = (id: string, updates: Partial<Omit<Category, 'id' | 'companyId'>>, companyId: string): Category | undefined => {
  const categoryIndex = mockCategoriesStore.findIndex(category => category.id === id && category.companyId === companyId);
  if (categoryIndex === -1) {
    return undefined;
  }
  mockCategoriesStore[categoryIndex] = { ...mockCategoriesStore[categoryIndex], ...updates };
  return mockCategoriesStore[categoryIndex];
};

// deleteMockCategory idealnya juga menggunakan companyId
export const deleteMockCategory = (id: string, companyId: string): boolean => {
  const initialLength = mockCategoriesStore.length;
  mockCategoriesStore = mockCategoriesStore.filter(category => !(category.id === id && category.companyId === companyId));
  return mockCategoriesStore.length < initialLength;
};

// Untuk ProductForm, kita mungkin perlu menyediakan daftar kategori yang sudah difilter berdasarkan companyId aktif
export const getMockCategoryNamesForCompany = (companyId: string): string[] => {
    return mockCategoriesStore.filter(c => c.companyId === companyId).map(c => c.name);
};
