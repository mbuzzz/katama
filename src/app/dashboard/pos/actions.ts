
"use server";

import type { ProductIngredient, Product } from "@/types/product";
import { getMockProductById, processSaleTransaction as dataProcessSaleTransaction } from "@/data/products"; 
import { getMockRawMaterials, updateRawMaterialStock } from "@/data/raw-materials";

interface CartItem extends Product {
  quantity: number;
}

// Server action untuk memproses penjualan
export async function handleProcessSaleAction(cartItems: CartItem[], companyId: string): Promise<{ success: boolean; message?: string }> {
  if (!companyId) {
    return { success: false, message: "ID Perusahaan tidak valid." };
  }
  const itemsToProcess = cartItems.map(item => ({
    productId: item.id,
    quantity: item.quantity,
    ingredients: item.ingredients, 
  }));
  // dataProcessSaleTransaction sekarang membutuhkan companyId
  return dataProcessSaleTransaction(itemsToProcess, companyId);
}

    