
import type { RawMaterial } from "@/types/raw-material"; 

interface RawMaterialSaaS extends RawMaterial {
  companyId: string;
}

let mockRawMaterialsStore: RawMaterialSaaS[] = [
  { id: "rm1", name: "Biji Kopi Arabika", unitId: "6", stock: 10000, costPerUnit: 150, companyId: "comp_es_teh_jaya" },
  { id: "rm2", name: "Susu UHT Full Cream", unitId: "7", stock: 20000, costPerUnit: 10, companyId: "comp_es_teh_jaya" },
  { id: "rm3", name: "Gula Aren Cair", unitId: "7", stock: 5000, costPerUnit: 20, companyId: "comp_es_teh_jaya" },
  { id: "rm4", name: "Tepung Terigu", unitId: "6", stock: 50000, costPerUnit: 10, companyId: "comp_kopi_maju" },
  { id: "rm5", name: "Cokelat Batangan", unitId: "6", stock: 1000, costPerUnit: 50, companyId: "comp_kopi_maju" },
  { id: "rm6", name: "Daun Teh Melati", unitId: "6", stock: 1000, costPerUnit: 30, companyId: "comp_es_teh_jaya" },
  { id: "rm7", name: "Air Mineral Galon", unitId: "2", stock: 100, costPerUnit: 5000, companyId: "comp_es_teh_jaya" },
  { id: "rm8", name: "Gelas Plastik 16oz", unitId: "3", stock: 1000, costPerUnit: 500, companyId: "comp_es_teh_jaya" },
  { id: "rm9", name: "Sedotan Plastik", unitId: "3", stock: 2000, costPerUnit: 100, companyId: "comp_es_teh_jaya" },
  { id: "rm10", name: "Kentang Beku", unitId: "6", stock: 10000, costPerUnit: 20, companyId: "comp_kopi_maju" },
  { id: "rm11", name: "Roti Tawar", unitId: "8", stock: 200, costPerUnit: 1000, companyId: "comp_roti_lezat_selalu" },
  { id: "rm12", name: "Keju Lembaran", unitId: "8", stock: 300, costPerUnit: 1500, companyId: "comp_roti_lezat_selalu" },
  { id: "rm13", name: "Telur Ayam", unitId: "9", stock: 100, costPerUnit: 2000, companyId: "comp_kopi_maju" },
];

export const getMockRawMaterials = (companyId?: string): RawMaterialSaaS[] => {
  if (companyId) {
    return [...mockRawMaterialsStore].filter(rm => rm.companyId === companyId);
  }
  return []; 
};

export const getMockRawMaterialById = (id: string, companyId?: string): RawMaterialSaaS | undefined => {
  const material = mockRawMaterialsStore.find(m => m.id === id);
  if (material && companyId && material.companyId !== companyId) {
    return undefined; 
  }
  return material;
};

export const addMockRawMaterial = (materialData: Omit<RawMaterialSaaS, 'id' | 'companyId'>, companyId: string): RawMaterialSaaS => {
  if (!companyId) throw new Error("companyId diperlukan untuk menambah bahan baku");
  const newMaterial: RawMaterialSaaS = {
    id: `rm${mockRawMaterialsStore.length + 1 + Date.now().toString().slice(-3)}`,
    ...materialData,
    companyId: companyId, 
  };
  mockRawMaterialsStore.push(newMaterial);
  return newMaterial;
};

export const updateMockRawMaterial = (id: string, updates: Partial<Omit<RawMaterialSaaS, 'id' | 'companyId'>>, companyId: string): RawMaterialSaaS | undefined => {
  const materialIndex = mockRawMaterialsStore.findIndex(m => m.id === id && m.companyId === companyId);
  if (materialIndex === -1) {
    return undefined;
  }
  mockRawMaterialsStore[materialIndex] = { ...mockRawMaterialsStore[materialIndex], ...updates };
  return mockRawMaterialsStore[materialIndex];
};

export const deleteMockRawMaterial = (id: string, companyId: string): boolean => {
  const initialLength = mockRawMaterialsStore.length;
  mockRawMaterialsStore = mockRawMaterialsStore.filter(m => !(m.id === id && m.companyId === companyId));
  return mockRawMaterialsStore.length < initialLength;
};

export const updateRawMaterialStock = (materialId: string, companyId: string, quantityChange: number): RawMaterialSaaS | undefined => {
  const materialIndex = mockRawMaterialsStore.findIndex(m => m.id === materialId && m.companyId === companyId);
  if (materialIndex === -1) {
    console.warn(`DATA_RAW_MATERIALS: Bahan baku dengan ID ${materialId} tidak ditemukan untuk perusahaan ${companyId} saat update stok.`);
    return undefined;
  }
  mockRawMaterialsStore[materialIndex].stock += quantityChange;
  if (mockRawMaterialsStore[materialIndex].stock < 0) {
    console.warn(`DATA_RAW_MATERIALS: Stok bahan baku ${materialId} (company ${companyId}) menjadi negatif: ${mockRawMaterialsStore[materialIndex].stock}, direset ke 0.`);
    mockRawMaterialsStore[materialIndex].stock = 0; 
  }
  console.log(`DATA_RAW_MATERIALS: Stok untuk bahan baku ${materialId} (company ${companyId}) diperbarui menjadi: ${mockRawMaterialsStore[materialIndex].stock}`);
  return mockRawMaterialsStore[materialIndex];
};

