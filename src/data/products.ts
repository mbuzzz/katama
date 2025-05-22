
import type { Product, ProductIngredient } from "@/types/product";
import type { RawMaterial } from "@/types/raw-material";
import { getMockRawMaterials, updateRawMaterialStock } from "@/data/raw-materials"; 
import { getMockCompanyById } from "./companies"; 

let mockProductsStore: Product[] = [
  { id: "1", companyId: "comp_es_teh_jaya", name: "Kopi Susu Aren", price: 18000, stock: 48, category: "Minuman Dingin", ingredients: [{rawMaterialId: "rm1", quantity: 20}, {rawMaterialId: "rm2", quantity: 100}, {rawMaterialId: "rm3", quantity: 15}], image: "https://placehold.co/200x150.png", dataAiHint:"coffee milk", hpp: 0 },
  { id: "2", companyId: "comp_kopi_maju", name: "Croissant Coklat", price: 22000, stock: 28, category: "Roti & Pastry", image: "https://placehold.co/200x150.png", dataAiHint:"croissant chocolate", hpp: 0 },
  { id: "3", companyId: "comp_es_teh_jaya", name: "Teh Melati Panas", price: 15000, stock: 97, category: "Minuman Panas", ingredients: [{rawMaterialId: "rm6", quantity: 5}], image: "https://placehold.co/200x150.png", dataAiHint:"jasmine tea", hpp: 0 },
  { id: "4", companyId: "comp_kopi_maju", name: "Nasi Goreng Spesial", price: 35000, stock: 25, category: "Makanan Berat", image: "https://placehold.co/200x150.png", dataAiHint:"fried rice", hpp: 0 },
  { id: "5", companyId: "comp_es_teh_jaya", name: "Americano", price: 16000, stock: 100, category: "Minuman Dingin", image: "https://placehold.co/200x150.png", dataAiHint:"americano coffee", ingredients: [{rawMaterialId: "rm1", quantity: 25}], hpp: 0 },
  { id: "6", companyId: "comp_roti_lezat_selalu", name: "Donat Gula", price: 10000, stock: 80, category: "Makanan Ringan", image: "https://placehold.co/200x150.png", dataAiHint:"donut sugar", hpp: 0 },
  { id: "7", companyId: "comp_es_teh_jaya", name: "Cappuccino", price: 20000, stock: 100, category: "Minuman Dingin", image: "https://placehold.co/200x150.png", dataAiHint:"cappuccino coffee", ingredients: [{rawMaterialId: "rm1", quantity: 20}, {rawMaterialId: "rm2", quantity: 120}], hpp: 0 },
  { id: "8", companyId: "comp_es_teh_jaya", name: "Red Velvet Latte", price: 25000, stock: 70, category: "Minuman Dingin", image: "https://placehold.co/200x150.png", dataAiHint:"red velvet", hpp: 0 },
  { id: "9", companyId: "comp_es_teh_jaya", name: "Matcha Latte", price: 25000, stock: 70, category: "Minuman Dingin", image: "https://placehold.co/200x150.png", dataAiHint:"matcha latte", hpp: 0 },
  { id: "10", companyId: "comp_kopi_maju", name: "Kentang Goreng", price: 18000, stock: 120, category: "Makanan Ringan", ingredients: [{rawMaterialId: "rm10", quantity: 150}], image: "https://placehold.co/200x150.png", dataAiHint:"french fries", hpp: 0 },
  { id: "11", companyId: "comp_roti_lezat_selalu", name: "Roti Bakar Coklat Keju", price: 20000, stock: 60, category: "Makanan Ringan", ingredients: [{rawMaterialId: "rm11", quantity: 2}, {rawMaterialId: "rm5", quantity: 30}, {rawMaterialId: "rm12", quantity: 1}], image: "https://placehold.co/200x150.png", dataAiHint:"toast bread", hpp: 0 },
  { id: "12", companyId: "comp_es_teh_jaya", name: "Es Teh Lemon", price: 12000, stock: 150, category: "Minuman Dingin", image: "https://placehold.co/200x150.png", dataAiHint:"lemon tea", hpp: 0 },
  { id: "13", companyId: "comp_roti_lezat_selalu", name: "Muffin Blueberry", price: 18000, stock: 40, category: "Makanan Ringan", image: "https://placehold.co/200x150.png", dataAiHint:"muffin blueberry", hpp: 0 },
  { id: "14", companyId: "comp_es_teh_jaya", name: "Air Mineral", price: 5000, stock: 200, category: "Minuman Dingin", image: "https://placehold.co/200x150.png", dataAiHint:"mineral water", hpp: 0 },
  { id: "15", companyId: "comp_kopi_maju", name: "Mie Ayam", price: 28000, stock: 25, category: "Makanan Berat", image: "https://placehold.co/200x150.png", dataAiHint:"chicken noodle", hpp: 0 },
  { id: "16", companyId: "comp_es_teh_jaya", name: "Es Teh Manis", price: 10000, stock: 150, category: "Minuman Dingin", ingredients: [{rawMaterialId: "rm6", quantity: 3}, {rawMaterialId: "rm7", quantity: 200}], image: "https://placehold.co/200x150.png", dataAiHint:"sweet tea", hpp: 0 },
];

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

// Initialize HPPs for all products based on their company's raw materials
mockProductsStore = mockProductsStore.map(p => ({
    ...p,
    hpp: _calculateHPP(p.ingredients, getMockRawMaterials(p.companyId))
}));


export const getMockProducts = (companyId?: string): Product[] => {
  const productsForCompany = companyId 
    ? mockProductsStore.filter(p => p.companyId === companyId) 
    : []; 

  const rawMaterialsForCompany = companyId ? getMockRawMaterials(companyId) : [];

  return productsForCompany.map(p => ({ 
    ...p,
    hpp: _calculateHPP(p.ingredients, rawMaterialsForCompany) 
  }));
};

export const getMockProductById = (id: string, companyId?: string): Product | undefined => {
  const product = mockProductsStore.find(p => p.id === id);
  if (product) {
    if (companyId && product.companyId !== companyId) {
        return undefined;
    }
    const rawMaterialsForCompany = product.companyId ? getMockRawMaterials(product.companyId) : [];
    return {
      ...product,
      hpp: _calculateHPP(product.ingredients, rawMaterialsForCompany)
    };
  }
  return undefined;
};

export const addMockProduct = (productData: Omit<Product, 'id' | 'hpp'>, companyId: string, allRawMaterialsForCompany: RawMaterial[]): Product => {
  if (!companyId) {
    throw new Error("companyId harus disediakan untuk menambahkan produk.");
  }
  const hpp = _calculateHPP(productData.ingredients, allRawMaterialsForCompany);
  const newProduct: Product = {
    id: `prod${mockProductsStore.length + 1 + Date.now().toString().slice(-3)}`, 
    ...productData,
    companyId: companyId, 
    hpp: hpp,
  };
  mockProductsStore.push(newProduct);
  return newProduct;
};

export const updateMockProduct = (id: string, updates: Partial<Omit<Product, 'id' | 'hpp' | 'companyId'>>, companyId: string, allRawMaterialsForCompany: RawMaterial[]): Product | undefined => {
  const productIndex = mockProductsStore.findIndex(product => product.id === id && product.companyId === companyId);
  if (productIndex === -1) {
    return undefined;
  }
  
  const existingProduct = mockProductsStore[productIndex];
  const updatedProductData = { ...existingProduct, ...updates };
  
  const hpp = _calculateHPP(updatedProductData.ingredients, allRawMaterialsForCompany);
  
  mockProductsStore[productIndex] = {
    ...updatedProductData,
    hpp: hpp,
  };
  return mockProductsStore[productIndex];
};

export const deleteMockProduct = (id: string, companyId: string): boolean => {
  const initialLength = mockProductsStore.length;
  mockProductsStore = mockProductsStore.filter(product => !(product.id === id && product.companyId === companyId));
  return mockProductsStore.length < initialLength;
};

export const updateProductStock = (productId: string, companyId: string, quantityChange: number): Product | undefined => {
  const productIndex = mockProductsStore.findIndex(p => p.id === productId && p.companyId === companyId);
  if (productIndex === -1) {
    console.warn(`Produk dengan ID ${productId} tidak ditemukan untuk perusahaan ${companyId} saat update stok.`);
    return undefined;
  }

  mockProductsStore[productIndex].stock += quantityChange;
  if (mockProductsStore[productIndex].stock < 0) {
    mockProductsStore[productIndex].stock = 0; 
  }
  console.log(`Stock for product ${productId} (company ${companyId}) updated to: ${mockProductsStore[productIndex].stock}`); // DEBUG
  return mockProductsStore[productIndex];
};

export const processSaleTransaction = (
  items: Array<{ productId: string; quantity: number; ingredients?: ProductIngredient[] }>,
  companyId: string 
): { success: boolean; message?: string } => {
  if (!companyId) {
    return { success: false, message: "ID Perusahaan tidak valid untuk proses transaksi." };
  }
  const currentRawMaterialsForCompany = getMockRawMaterials(companyId); 

  // Validation phase
  for (const item of items) {
    const product = getMockProductById(item.productId, companyId); 
    if (!product) {
      return { success: false, message: `Produk dengan ID ${item.productId} tidak ditemukan untuk perusahaan ini.` };
    }
    if (product.stock < item.quantity) {
      return { success: false, message: `Stok produk ${product.name} tidak mencukupi.` };
    }

    if (product.ingredients && product.ingredients.length > 0) {
      for (const ing of product.ingredients) {
        const rawMat = currentRawMaterialsForCompany.find(rm => rm.id === ing.rawMaterialId);
        if (!rawMat) {
          return { success: false, message: `Bahan baku dengan ID ${ing.rawMaterialId} untuk produk ${product.name} tidak ditemukan di perusahaan ini.` };
        }
        const requiredRawMaterialQuantity = ing.quantity * item.quantity;
        if (rawMat.stock < requiredRawMaterialQuantity) {
          return { success: false, message: `Stok bahan baku ${rawMat.name} untuk produk ${product.name} tidak mencukupi (dibutuhkan: ${requiredRawMaterialQuantity}, tersedia: ${rawMat.stock}).` };
        }
      }
    }
  }

  // Execution phase: Update stock if all validations passed
  for (const item of items) {
    updateProductStock(item.productId, companyId, -item.quantity); 
    
    const product = getMockProductById(item.productId, companyId); 
    if (product && product.ingredients && product.ingredients.length > 0) {
      product.ingredients.forEach(ingredient => {
        const consumedRawMaterialQuantity = ingredient.quantity * item.quantity;
        updateRawMaterialStock(ingredient.rawMaterialId, companyId, -consumedRawMaterialQuantity); 
      });
    }
  }
  return { success: true };
};
    
