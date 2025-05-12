
export interface RawMaterial {
  id: string;
  name: string;
  unitId: string; // Foreign key to Unit type
  stock: number;
  costPerUnit?: number; // For HPP calculation, optional
}
