
import type { RawMaterial } from "@/types/raw-material"; // Will create this type

// In-memory store for mock raw materials
let mockRawMaterialsStore: RawMaterial[] = [
  { id: "rm1", name: "Biji Kopi Arabika", unitId: "6", stock: 10000, costPerUnit: 150 }, // gram
  { id: "rm2", name: "Susu UHT Full Cream", unitId: "7", stock: 20000, costPerUnit: 10 }, // ml
  { id: "rm3", name: "Gula Aren Cair", unitId: "7", stock: 5000, costPerUnit: 20 }, // ml
  { id: "rm4", name: "Tepung Terigu", unitId: "6", stock: 50000, costPerUnit: 10 }, // gram
  { id: "rm5", name: "Cokelat Batangan", unitId: "6", stock: 1000, costPerUnit: 50 }, // gram
  { id: "rm6", name: "Daun Teh Melati", unitId: "6", stock: 1000, costPerUnit: 30 }, // gram
  { id: "rm7", name: "Air Mineral Galon", unitId: "2", stock: 100, costPerUnit: 5000 }, // liter
  { id: "rm8", name: "Gelas Plastik 16oz", unitId: "3", stock: 1000, costPerUnit: 500 }, // pcs
  { id: "rm9", name: "Sedotan Plastik", unitId: "3", stock: 2000, costPerUnit: 100 }, // pcs
  { id: "rm10", name: "Kentang Beku", unitId: "6", stock: 10000, costPerUnit: 20 }, // gram
  { id: "rm11", name: "Roti Tawar", unitId: "8", stock: 200, costPerUnit: 1000 }, // lembar
  { id: "rm12", name: "Keju Lembaran", unitId: "8", stock: 300, costPerUnit: 1500 }, // lembar
  { id: "rm13", name: "Telur Ayam", unitId: "9", stock: 100, costPerUnit: 2000 }, // butir
];

export const getMockRawMaterials = (): RawMaterial[] => {
  return [...mockRawMaterialsStore];
};

export const getMockRawMaterialById = (id: string): RawMaterial | undefined => {
  return mockRawMaterialsStore.find(material => material.id === id);
};

export const addMockRawMaterial = (materialData: Omit<RawMaterial, 'id'>): RawMaterial => {
  const newMaterial: RawMaterial = {
    id: `rm${mockRawMaterialsStore.length + 1 + Date.now().toString().slice(-3)}`, // Simple unique ID generation
    ...materialData,
  };
  mockRawMaterialsStore.push(newMaterial);
  return newMaterial;
};

export const updateMockRawMaterial = (id: string, updates: Partial<Omit<RawMaterial, 'id'>>): RawMaterial | undefined => {
  const materialIndex = mockRawMaterialsStore.findIndex(material => material.id === id);
  if (materialIndex === -1) {
    return undefined;
  }
  mockRawMaterialsStore[materialIndex] = { ...mockRawMaterialsStore[materialIndex], ...updates };
  return mockRawMaterialsStore[materialIndex];
};

export const deleteMockRawMaterial = (id: string): boolean => {
  const initialLength = mockRawMaterialsStore.length;
  mockRawMaterialsStore = mockRawMaterialsStore.filter(material => material.id !== id);
  return mockRawMaterialsStore.length < initialLength;
};

export const updateRawMaterialStock = (materialId: string, quantityChange: number): RawMaterial | undefined => {
  const materialIndex = mockRawMaterialsStore.findIndex(m => m.id === materialId);
  if (materialIndex === -1) return undefined;

  mockRawMaterialsStore[materialIndex].stock += quantityChange;
  if (mockRawMaterialsStore[materialIndex].stock < 0) {
    // This case should ideally be prevented by checks before calling updateProductStock
    console.warn(`Raw material ${materialId} stock fell below zero.`);
    mockRawMaterialsStore[materialIndex].stock = 0; 
  }
  return mockRawMaterialsStore[materialIndex];
};
