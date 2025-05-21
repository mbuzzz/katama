
export interface Purchase {
  id: string;
  companyId: string; 
  outlet: string; // Could be outletId if you have a separate Outlet type
  timestamp: string; // ISO date string
  user: string; // User who made the purchase (could be userId)
  itemName: string;
  price: number; // Unit price
  quantity: number;
  unit: string;
  total: number; // quantity * price
  shiftId?: string; // Optional: if purchases are tied to shifts
  supplier?: string; // Optional
}

export interface PurchaseFormData {
  companyId: string;
  outlet: string;
  itemName: string; // Or rawMaterialId
  price: number;
  quantity: number;
  unit: string;
  supplier?: string;
  // date will be auto-generated
}
