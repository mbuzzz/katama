
"use server";

import type { ProductIngredient, Product } from "@/types/product";
import { getMockProductById, processSaleTransaction as dataProcessSaleTransaction } from "@/data/products"; // updateProductStock is internal to products.ts now
import { getMockRawMaterials, updateRawMaterialStock } from "@/data/raw-materials";

interface CartItem extends Product {
  quantity: number;
}

// Server action to process the sale
export async function handleProcessSaleAction(cartItems: CartItem[]): Promise<{ success: boolean; message?: string }> {
  const itemsToProcess = cartItems.map(item => ({
    productId: item.id,
    quantity: item.quantity,
    // The 'ingredients' field here is primarily for context if needed,
    // but processSaleTransaction re-fetches product details including ingredients
    // from the mock store to ensure it uses the most current recipe for deductions.
    ingredients: item.ingredients, 
  }));
  return dataProcessSaleTransaction(itemsToProcess);
}

