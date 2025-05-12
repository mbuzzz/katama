
import { PageHeader } from "@/components/page-header";
import ProductForm from "@/components/products/product-form";
import { getMockRawMaterials } from "@/data/raw-materials";
import { getMockCategories } from "@/data/categories";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductFormData } from "@/components/products/product-form";
import { addMockProduct } from "@/data/products"; // Use new product data management

export default async function AddProductPage() {
  const rawMaterials = getMockRawMaterials();
  const categories = getMockCategories().map(cat => cat.name);

  const handleSaveProduct = async (data: ProductFormData) => {
    "use server";
    console.log("Data produk untuk disimpan:", data);

    // HPP calculation is now handled within addMockProduct
    try {
      // Fetch all raw materials again within server action to ensure fresh data for HPP calculation
      const currentRawMaterials = getMockRawMaterials();
      const newProduct = addMockProduct(data, currentRawMaterials); // addMockProduct now calculates HPP
      console.log("Produk ditambahkan:", newProduct);
      // Redirect or toast is handled in ProductForm
      return newProduct; // Return new product so form can use it if needed (though ProductForm expects void)
    } catch (error) {
      console.error("Gagal menambahkan produk:", error);
      throw error; // Re-throw to be caught by form's error handler
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tambah Produk Baru" 
        description="Isi detail produk, harga, stok, dan bahan baku yang digunakan." 
      />
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <ProductForm
            rawMaterials={rawMaterials}
            categories={categories} 
            onSave={handleSaveProduct}
            isEditing={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
