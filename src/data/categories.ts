
import type { Category } from "@/types/category";

// In-memory store for mock categories
let mockCategoriesStore: Category[] = [
  { id: "1", name: "Minuman Dingin", description: "Berbagai minuman dingin penyegar." },
  { id: "2", name: "Minuman Panas", description: "Minuman hangat untuk menemani." },
  { id: "3", name: "Makanan Berat", description: "Pilihan makanan utama yang mengenyangkan." },
  { id: "4", name: "Makanan Ringan", description: "Camilan lezat untuk setiap saat." },
  { id: "5", name: "Dessert", description: "Hidangan penutup yang manis dan nikmat." },
  { id: "6", name: "Roti & Pastry", description: "Produk bakery segar setiap hari." },
  { id: "7", name: "Tambahan", description: "Ekstra topping atau item pelengkap." },
];

export const getMockCategories = (): Category[] => {
  return [...mockCategoriesStore];
};

export const getMockCategoryById = (id: string): Category | undefined => {
  return mockCategoriesStore.find(category => category.id === id);
};

export const addMockCategory = (categoryData: Omit<Category, 'id'>): Category => {
  const newCategory: Category = {
    id: (mockCategoriesStore.length + 1).toString(), // Simple ID generation
    ...categoryData,
  };
  mockCategoriesStore.push(newCategory);
  return newCategory;
};

export const updateMockCategory = (id: string, updates: Partial<Omit<Category, 'id'>>): Category | undefined => {
  const categoryIndex = mockCategoriesStore.findIndex(category => category.id === id);
  if (categoryIndex === -1) {
    return undefined;
  }
  mockCategoriesStore[categoryIndex] = { ...mockCategoriesStore[categoryIndex], ...updates };
  return mockCategoriesStore[categoryIndex];
};

export const deleteMockCategory = (id: string): boolean => {
  const initialLength = mockCategoriesStore.length;
  mockCategoriesStore = mockCategoriesStore.filter(category => category.id !== id);
  return mockCategoriesStore.length < initialLength;
};

// This export is for ProductForm, which expects an array of strings for categories.
// We can adapt ProductForm later or provide a getter for names only.
// For now, let's keep ProductForm as is, and this can be used for display purposes.
export const mockCategoryNames: string[] = mockCategoriesStore.map(c => c.name);

