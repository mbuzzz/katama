
export interface ProductIngredient {
  rawMaterialId: string;
  quantity: number;
  // unit will be derived from the RawMaterial's unit
}

export interface Product {
  id: string;
  companyId: string; // Ditambahkan untuk isolasi data SaaS
  name: string;
  hpp?: number; // Harga Pokok Penjualan (Cost Price)
  price: number; // Harga Jual (Selling Price)
  category: string;
  stock: number;
  image?: string; // Optional image URL
  variants?: { name: string; price: number }[];
  ingredients?: ProductIngredient[];
  // Add other product properties as needed
}
