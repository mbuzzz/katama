
'use server';

import type { PurchaseFormData, Purchase } from "@/types/purchase";
import { addMockPurchase as dataAddMockPurchase } from "@/data/purchases";

export async function createPurchaseAction(
  formData: PurchaseFormData,
  activeCompanyId: string
): Promise<Purchase> {
  if (!activeCompanyId) {
    console.error("Gagal menyimpan pembelanjaan: ID Perusahaan aktif tidak ditemukan.");
    throw new Error("ID Perusahaan aktif tidak ditemukan.");
  }
  try {
    // The addMockPurchase function in data/purchases.ts already handles the core logic
    const newPurchase = dataAddMockPurchase(formData, activeCompanyId);
    return newPurchase;
  } catch (error: any) {
    console.error("Gagal menambahkan pembelanjaan:", error.message);
    // It's good to rethrow the original error or a new one with context
    throw new Error(`Gagal menambahkan pembelanjaan: ${error.message}`);
  }
}
