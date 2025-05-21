
export interface Purchase {
  id: string;
  companyId: string; 
  outlet: string; // Could be outletId if you have a separate Outlet type
  timestamp: string; // ISO date string
  userId: string; // User who made the purchase (linked to User type)
  userName?: string; // Denormalized user name for display
  rawMaterialId: string; // Link to RawMaterial type
  itemName: string; // Denormalized item name for display
  price: number; // Unit price of the purchase
  quantity: number;
  unit: string; // Denormalized unit name/abbreviation for display
  total: number; // quantity * price
  shiftId?: string; // Optional: if purchases are tied to shifts
  supplier?: string; // Optional
}

export interface PurchaseFormData {
  // companyId will be handled by the server action based on active session/selection
  outlet: string; 
  userId: string; 
  rawMaterialId: string;
  price: number;
  quantity: number;
  supplier?: string;
  // date (timestamp) will be auto-generated
  // total will be auto-calculated
}
