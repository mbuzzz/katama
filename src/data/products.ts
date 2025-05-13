
import type { Product, ProductIngredient } from "@/types/product";
import type { RawMaterial } from "@/types/raw-material";
import { getMockRawMaterials, updateRawMaterialStock } from "@/data/raw-materials"; // For HPP calc and stock updates

// In-memory store for mock products
let mockProductsStore: Product[] = [
  { id: "1", name: "Kopi Susu Aren", price: 18000, stock: 48, category: "Minuman Dingin", ingredients: [{rawMaterialId: "rm1", quantity: 20}, {rawMaterialId: "rm2", quantity: 100}, {rawMaterialId: "rm3", quantity: 15}], image: "https://picsum.photos/150/150?random=1" , hpp: 0 }, // HPP will be calculated
  { id: "2", name: "Croissant Coklat", price: 22000, stock: 28, category: "Roti & Pastry", image: "https://picsum.photos/150/150?random=2", hpp: 0 },
  { id: "3", name: "Teh Melati Panas", price: 15000, stock: 97, category: "Minuman Panas", ingredients: [{rawMaterialId: "rm6", quantity: 5}], image: "https://picsum.photos/150/150?random=3", hpp: 0 },
  { id: "4", name: "Nasi Goreng Spesial", price: 35000, stock: 25, category: "Makanan Berat", image: "https://picsum.photos/150/150?random=4", hpp: 0 },
  { id: "5", name: "Americano", price: 16000, stock: 100, category: "Minuman Dingin", image: "https://picsum.photos/150/150?random=5", hpp: 0 },
  { id: "6", name: "Donat Gula", price: 10000, stock: 80, category: "Makanan Ringan", image: "https://picsum.photos/150/150?random=6", hpp: 0 },
  { id: "7", name: "Cappuccino", price: 20000, stock: 100, category: "Minuman Dingin", image: "https://picsum.photos/150/150?random=7", hpp: 0 },
  { id: "8", name: "Red Velvet Latte", price: 25000, stock: 70, category: "Minuman Dingin", image: "https://picsum.photos/150/150?random=8", hpp: 0 },
  { id: "9", name: "Matcha Latte", price: 25000, stock: 70, category: "Minuman Dingin", image: "https://picsum.photos/150/150?random=9", hpp: 0 },
  { id: "10", name: "Kentang Goreng", price: 18000, stock: 120, category: "Makanan Ringan", image: "https://picsum.photos/150/150?random=10", hpp: 0 },
  { id: "11", name: "Roti Bakar Coklat Keju", price: 20000, stock: 60, category: "Makanan Ringan", image: "https://picsum.photos/150/150?random=11", hpp: 0 },
  { id: "12", name: "Es Teh Lemon", price: 12000, stock: 150, category: "Minuman Dingin", image: "https://picsum.photos/150/150?random=12", hpp: 0 },
  { id: "13", name: "Muffin Blueberry", price: 18000, stock: 40, category: "Makanan Ringan", image: "https://picsum.photos/150/150?random=13", hpp: 0 },
  { id: "14", name: "Air Mineral", price: 5000, stock: 200, category: "Minuman Dingin", image: "https://picsum.photos/150/150?random=14", hpp: 0 },
  { id: "15", name: "Mie Ayam", price: 28000, stock: 25, category: "Makanan Berat", image: "https://picsum.photos/150/150?random=15", hpp: 0 },
];

// Initialize HPPs
const allInitialRawMaterials = getMockRawMaterials(); // Get raw materials once
mockProductsStore = mockProductsStore.map(p => ({
    ...p,
    hpp: _calculateHPP(p.ingredients, allInitialRawMaterials)
}));


export function _calculateHPP(ingredients: ProductIngredient[] | undefined, allRawMaterials: RawMaterial[]): number {
  if (!ingredients || ingredients.length === 0) {
    return 0;
  }
  return ingredients.reduce((totalHPP, ingredient) => {
    const rawMaterial = allRawMaterials.find(rm => rm.id === ingredient.rawMaterialId);
    if (rawMaterial && rawMaterial.costPerUnit) {
      return totalHPP + (ingredient.quantity * rawMaterial.costPerUnit);
    }
    return totalHPP;
  }, 0);
}

export const getMockProducts = (): Product[] => {
  return [...mockProductsStore]; // Return a copy
};

export const getMockProductById = (id: string): Product | undefined => {
  return mockProductsStore.find(product => product.id === id);
};

export const addMockProduct = (productData: Omit<Product, 'id' | 'hpp'>, allRawMaterials: RawMaterial[]): Product => {
  const hpp = _calculateHPP(productData.ingredients, allRawMaterials);
  const newProduct: Product = {
    id: `prod${mockProductsStore.length + 1 + Date.now().toString().slice(-3)}`, // Simple unique ID
    ...productData,
    hpp: hpp,
  };
  mockProductsStore.push(newProduct);
  return newProduct;
};

export const updateMockProduct = (id: string, updates: Partial<Omit<Product, 'id' | 'hpp'>>, allRawMaterials: RawMaterial[]): Product | undefined => {
  const productIndex = mockProductsStore.findIndex(product => product.id === id);
  if (productIndex === -1) {
    return undefined;
  }
  
  const existingProduct = mockProductsStore[productIndex];
  const updatedProductData = { ...existingProduct, ...updates };
  
  // Recalculate HPP if ingredients are part of the updates or if it's a new product from form
  const hpp = _calculateHPP(updatedProductData.ingredients, allRawMaterials);
  
  mockProductsStore[productIndex] = {
    ...updatedProductData,
    hpp: hpp,
  };
  return mockProductsStore[productIndex];
};

export const deleteMockProduct = (id: string): boolean => {
  const initialLength = mockProductsStore.length;
  mockProductsStore = mockProductsStore.filter(product => product.id !== id);
  return mockProductsStore.length < initialLength;
};

export const updateProductStock = (productId: string, quantityChange: number): Product | undefined => {
  const productIndex = mockProductsStore.findIndex(p => p.id === productId);
  if (productIndex === -1) return undefined;

  mockProductsStore[productIndex].stock += quantityChange;
  if (mockProductsStore[productIndex].stock < 0) {
    // This case should ideally be prevented by checks before calling updateProductStock
    // console.warn(`Product ${productId} stock fell below zero.`);
    mockProductsStore[productIndex].stock = 0; 
  }
  return mockProductsStore[productIndex];
};

// This function will be called from the POS server action
export const processSaleTransaction = (
  items: Array<{ productId: string; quantity: number; ingredients?: ProductIngredient[] }>
): { success: boolean; message?: string } => {
  const currentRawMaterials = getMockRawMaterials(); // Get current state of raw materials

  // First, check if all items and their raw materials are in stock
  for (const item of items) {
    const product = getMockProductById(item.productId); // Fetch current product details
    if (!product) {
      return { success: false, message: `Produk dengan ID ${item.productId} tidak ditemukan.` };
    }
    if (product.stock < item.quantity) {
      return { success: false, message: `Stok produk ${product.name} tidak mencukupi.` };
    }

    if (product.ingredients && product.ingredients.length > 0) {
      for (const ing of product.ingredients) {
        const rawMat = currentRawMaterials.find(rm => rm.id === ing.rawMaterialId);
        if (!rawMat) {
          return { success: false, message: `Bahan baku dengan ID ${ing.rawMaterialId} untuk produk ${product.name} tidak ditemukan.` };
        }
        const requiredRawMaterialQuantity = ing.quantity * item.quantity;
        if (rawMat.stock < requiredRawMaterialQuantity) {
          return { success: false, message: `Stok bahan baku ${rawMat.name} untuk produk ${product.name} tidak mencukupi.` };
        }
      }
    }
  }

  // If all checks pass, proceed with stock deduction
  for (const item of items) {
    updateProductStock(item.productId, -item.quantity); // Deduct product stock
    
    // Re-fetch product to ensure we use its definitive ingredients list for deduction
    const product = getMockProductById(item.productId); 
    if (product && product.ingredients && product.ingredients.length > 0) {
      product.ingredients.forEach(ingredient => {
        const consumedRawMaterialQuantity = ingredient.quantity * item.quantity;
        updateRawMaterialStock(ingredient.rawMaterialId, -consumedRawMaterialQuantity); // Deduct raw material stock
      });
    }
  }
  return { success: true };
};

