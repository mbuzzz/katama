
import type { Purchase } from "@/types/purchase";

// Mock data for purchases, now with companyId
let mockPurchasesStore: Purchase[] = [
  { id: "P001", companyId: "comp_es_teh_jaya", outlet: "Outlet Pusat", timestamp: "2024-07-20T10:00:00.000Z", user: "Admin Toko", itemName: "Biji Kopi Arabika", price: 150000, quantity: 10, unit: "kg", total: 1500000, shiftId: "shift1", supplier: "Supplier Kopi Jaya" },
  { id: "P002", companyId: "comp_es_teh_jaya", outlet: "Outlet Pusat", timestamp: "2024-07-19T15:30:00.000Z", user: "Admin Toko", itemName: "Susu UHT Full Cream", price: 80000, quantity: 5, unit: "karton", total: 400000, shiftId: "shift1", supplier: "Distributor Susu Segar" },
  { id: "P003", companyId: "comp_kopi_maju", outlet: "Outlet Cabang A", timestamp: "2024-07-18T09:00:00.000Z", user: "Manajer Cabang", itemName: "Gula Aren Cair", price: 25000, quantity: 20, unit: "liter", total: 500000, shiftId: "shift1", supplier: "Produsen Gula Aren" },
  { id: "P004", companyId: "comp_es_teh_jaya", outlet: "Outlet Pusat", timestamp: "2024-07-22T11:00:00.000Z", user: "Admin Toko", itemName: "Biji Kopi Robusta", price: 120000, quantity: 8, unit: "kg", total: 960000, shiftId: "shift2", supplier: "Supplier Kopi Robusta" },
  { id: "P005", companyId: "comp_roti_lezat", outlet: "Outlet Cabang Sudirman", timestamp: "2024-07-22T14:00:00.000Z", user: "Manajer Cabang", itemName: "Bubuk Es Teh", price: 50000, quantity: 10, unit: "kg", total: 500000, shiftId: "shift3", supplier: "Supplier Teh Nusantara" },
];

export const getMockPurchases = (companyId?: string): Purchase[] => {
  if (companyId) {
    return [...mockPurchasesStore].filter(purchase => purchase.companyId === companyId);
  }
  // If no companyId, return empty or handle as an error, purchases should be company-specific.
  // For admin/superadmin views that might see all, a different function or no filter would be used.
  // For now, let's return empty if no specific companyId.
  return []; 
};

export const getMockPurchaseById = (id: string, companyId?: string): Purchase | undefined => {
  const purchase = mockPurchasesStore.find(p => p.id === id);
  if (purchase && companyId && purchase.companyId !== companyId) {
    return undefined; // Not found for this company
  }
  return purchase;
};

// Placeholder for adding a purchase
// This would also need to update raw material stock
export const addMockPurchase = (purchaseData: Omit<Purchase, 'id' | 'total' | 'timestamp'>, companyId: string): Purchase => {
  const newPurchase: Purchase = {
    id: `P${mockPurchasesStore.length + 1}${Date.now().toString().slice(-3)}`,
    ...purchaseData,
    companyId: companyId,
    timestamp: new Date().toISOString(),
    total: purchaseData.quantity * purchaseData.price,
  };
  mockPurchasesStore.push(newPurchase);
  // Here, you would also call a function to update raw material stock based on purchaseData.itemName (or rawMaterialId)
  // e.g., updateRawMaterialStock(rawMaterialId, companyId, purchaseData.quantity);
  return newPurchase;
};

// Placeholder for updating a purchase
export const updateMockPurchase = (id: string, updates: Partial<Omit<Purchase, 'id' | 'companyId' | 'total' | 'timestamp'>>, companyId: string): Purchase | undefined => {
  const purchaseIndex = mockPurchasesStore.findIndex(p => p.id === id && p.companyId === companyId);
  if (purchaseIndex === -1) {
    return undefined;
  }
  const existingPurchase = mockPurchasesStore[purchaseIndex];
  const updatedData = { ...existingPurchase, ...updates };
  
  // Recalculate total if quantity or price changed
  if (updates.quantity !== undefined || updates.price !== undefined) {
    updatedData.total = updatedData.quantity * updatedData.price;
  }

  mockPurchasesStore[purchaseIndex] = updatedData;
  return updatedData;
};

// Placeholder for deleting a purchase
export const deleteMockPurchase = (id: string, companyId: string): boolean => {
  const initialLength = mockPurchasesStore.length;
  mockPurchasesStore = mockPurchasesStore.filter(p => !(p.id === id && p.companyId === companyId));
  // If deleting a purchase, you might need to reverse the stock update. This logic can be complex.
  return mockPurchasesStore.length < initialLength;
};
