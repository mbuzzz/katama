
export interface RawMaterial {
  id: string;
  name: string;
  unit: string; // e.g., gram, ml, pcs, kg, liter
  stock: number;
  costPerUnit?: number; // For HPP calculation
}

export const mockRawMaterials: RawMaterial[] = [
  { id: "rm1", name: "Biji Kopi Arabika", unit: "gram", stock: 10000, costPerUnit: 150 },
  { id: "rm2", name: "Susu UHT Full Cream", unit: "ml", stock: 20000, costPerUnit: 10 },
  { id: "rm3", name: "Gula Aren Cair", unit: "ml", stock: 5000, costPerUnit: 20 },
  { id: "rm4", name: "Tepung Terigu", unit: "gram", stock: 50000, costPerUnit: 10 },
  { id: "rm5", name: "Coklat Batang", unit: "gram", stock: 1000, costPerUnit: 50 },
  { id: "rm6", name: "Daun Teh Melati", unit: "gram", stock: 1000, costPerUnit: 30 },
  { id: "rm7", name: "Air Mineral Galon", unit: "liter", stock: 100, costPerUnit: 5000 },
  { id: "rm8", name: "Cup Plastik 16oz", unit: "pcs", stock: 1000, costPerUnit: 500 },
  { id: "rm9", name: "Sedotan Plastik", unit: "pcs", stock: 2000, costPerUnit: 100 },
  { id: "rm10", name: "Kentang Beku", unit: "gram", stock: 10000, costPerUnit: 20 },
  { id: "rm11", name: "Roti Tawar", unit: "lembar", stock: 200, costPerUnit: 1000 },
  { id: "rm12", name: "Keju Slice", unit: "lembar", stock: 300, costPerUnit: 1500 },
  { id: "rm13", name: "Telur Ayam", unit: "butir", stock: 100, costPerUnit: 2000 },
];
