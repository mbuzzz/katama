
import type { Purchase, PurchaseFormData } from "@/types/purchase";
import { getMockRawMaterials, updateRawMaterialStock, getMockRawMaterialById } from "@/data/raw-materials";
import { getMockUnitById } from "@/data/units";
import { getMockUserById } from "@/data/users";

// Mock data for purchases, now with companyId
let mockPurchasesStore: Purchase[] = [
  { id: "P001", companyId: "comp_es_teh_jaya", outlet: "Outlet Pusat", timestamp: "2024-07-20T10:00:00.000Z", userId: "2", userName: "Budi Santoso", rawMaterialId: "rm1", itemName: "Biji Kopi Arabika", price: 150000, quantity: 10, unit: "kg", total: 1500000, shiftId: "shift1", supplier: "Supplier Kopi Jaya" },
  { id: "P002", companyId: "comp_es_teh_jaya", outlet: "Outlet Pusat", timestamp: "2024-07-19T15:30:00.000Z", userId: "2", userName: "Budi Santoso", rawMaterialId: "rm2", itemName: "Susu UHT Full Cream", price: 80000, quantity: 5, unit: "karton", total: 400000, shiftId: "shift1", supplier: "Distributor Susu Segar" },
  { id: "P003", companyId: "comp_kopi_maju", outlet: "Outlet Cabang A", timestamp: "2024-07-18T09:00:00.000Z", userId: "3", userName: "Candra Wijaya", rawMaterialId: "rm3", itemName: "Gula Aren Cair", price: 25000, quantity: 20, unit: "liter", total: 500000, shiftId: "shift1", supplier: "Produsen Gula Aren" },
  { id: "P004", companyId: "comp_es_teh_jaya", outlet: "Outlet Pusat", timestamp: "2024-07-22T11:00:00.000Z", userId: "2", userName: "Budi Santoso", rawMaterialId: "rm1", itemName: "Biji Kopi Robusta", price: 120000, quantity: 8, unit: "kg", total: 960000, shiftId: "shift2", supplier: "Supplier Kopi Robusta" },
  { id: "P005", companyId: "comp_roti_lezat_selalu", outlet: "Outlet Cabang Sudirman", timestamp: "2024-07-22T14:00:00.000Z", userId: "3", userName: "Candra Wijaya", rawMaterialId: "rm6", itemName: "Bubuk Es Teh", price: 50000, quantity: 10, unit: "kg", total: 500000, shiftId: "shift3", supplier: "Supplier Teh Nusantara" },
];

export const getMockPurchases = (companyId?: string): Purchase[] => {
  let purchasesToReturn: Purchase[];
  if (companyId) {
    purchasesToReturn = [...mockPurchasesStore].filter(purchase => purchase.companyId === companyId);
  } else {
    purchasesToReturn = []; 
  }
  // Populate userName and unit for display
  return purchasesToReturn.map(p => {
    const user = getMockUserById(p.userId);
    const rawMaterial = getMockRawMaterialById(p.rawMaterialId, p.companyId);
    const unit = rawMaterial ? getMockUnitById(rawMaterial.unitId) : undefined;
    return {
      ...p,
      userName: user?.name || p.userId,
      itemName: rawMaterial?.name || p.rawMaterialId,
      unit: unit?.abbreviation || p.unit,
    };
  });
};

export const getMockPurchaseById = (id: string, companyId?: string): Purchase | undefined => {
  const purchase = mockPurchasesStore.find(p => p.id === id);
  if (purchase) {
    if (companyId && purchase.companyId !== companyId) {
      return undefined; // Not found for this company
    }
    const user = getMockUserById(purchase.userId);
    const rawMaterial = getMockRawMaterialById(purchase.rawMaterialId, purchase.companyId);
    const unit = rawMaterial ? getMockUnitById(rawMaterial.unitId) : undefined;
    return {
      ...purchase,
      userName: user?.name || purchase.userId,
      itemName: rawMaterial?.name || purchase.rawMaterialId,
      unit: unit?.abbreviation || purchase.unit,
    };
  }
  return undefined;
};

export const addMockPurchase = (formData: PurchaseFormData, companyId: string): Purchase => {
  if (!companyId) {
    throw new Error("companyId harus disediakan untuk menambahkan pembelanjaan.");
  }

  const rawMaterial = getMockRawMaterialById(formData.rawMaterialId, companyId);
  if (!rawMaterial) {
    throw new Error(`Bahan baku dengan ID ${formData.rawMaterialId} tidak ditemukan untuk perusahaan ini.`);
  }

  const unit = getMockUnitById(rawMaterial.unitId);
  if (!unit) {
    throw new Error(`Satuan untuk bahan baku ${rawMaterial.name} tidak ditemukan.`);
  }
  
  const user = getMockUserById(formData.userId);
  if (!user) {
    throw new Error(`Pengguna dengan ID ${formData.userId} tidak ditemukan.`);
  }

  const newPurchase: Purchase = {
    id: `P${mockPurchasesStore.length + 1}${Date.now().toString().slice(-3)}`,
    companyId: companyId,
    outlet: formData.outlet,
    timestamp: new Date().toISOString(),
    userId: formData.userId,
    userName: user.name, // Denormalized for convenience
    rawMaterialId: formData.rawMaterialId,
    itemName: rawMaterial.name, // Denormalized for convenience
    price: formData.price,
    quantity: formData.quantity,
    unit: unit.abbreviation, // Denormalized for convenience
    total: formData.quantity * formData.price,
    supplier: formData.supplier,
    // shiftId can be added if needed
  };

  mockPurchasesStore.push(newPurchase);

  // Update raw material stock
  const stockUpdateResult = updateRawMaterialStock(formData.rawMaterialId, companyId, formData.quantity);
  if (!stockUpdateResult) {
    // This case should ideally not happen if rawMaterial was found earlier, but good for robustness
    console.warn(`Gagal memperbarui stok untuk bahan baku ID ${formData.rawMaterialId} setelah pembelian.`);
    // Potentially rollback purchase or log error, for now, we proceed
  }

  return newPurchase;
};


// Placeholder for updating a purchase - more complex due to stock adjustments
export const updateMockPurchase = (id: string, updates: Partial<PurchaseFormData>, companyId: string): Purchase | undefined => {
  const purchaseIndex = mockPurchasesStore.findIndex(p => p.id === id && p.companyId === companyId);
  if (purchaseIndex === -1) {
    return undefined;
  }
  // This is a simplified update. A real update would need to handle:
  // - Reverting old stock change if quantity/rawMaterialId changed.
  // - Applying new stock change.
  // - Recalculating total if price/quantity changed.
  // For now, it's a simple merge, which is not fully correct for a real app.
  const existingPurchase = mockPurchasesStore[purchaseIndex];
  const updatedData = { 
    ...existingPurchase, 
    ...updates,
    total: (updates.quantity !== undefined ? updates.quantity : existingPurchase.quantity) * (updates.price !== undefined ? updates.price : existingPurchase.price)
  };
  
  // If raw material or quantity changed, stock logic needs to be more complex.
  // For simplicity, this mock doesn't handle that complex rollback/reapply of stock.

  mockPurchasesStore[purchaseIndex] = updatedData;
  return updatedData;
};

export const deleteMockPurchase = (id: string, companyId: string): boolean => {
  const purchaseIndex = mockPurchasesStore.findIndex(p => p.id === id && p.companyId === companyId);
  if (purchaseIndex === -1) {
    return false;
  }
  const purchaseToDelete = mockPurchasesStore[purchaseIndex];
  
  // Revert stock update
  updateRawMaterialStock(purchaseToDelete.rawMaterialId, companyId, -purchaseToDelete.quantity);

  mockPurchasesStore.splice(purchaseIndex, 1);
  return true;
};
