
import { PageHeader } from "@/components/page-header";
import ProductForm from "@/components/products/product-form";
import { mockRawMaterials } from "@/data/raw-materials";
import { mockCategoryNames } from "@/data/categories"; // Changed to use mockCategoryNames
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types/product"; 
import type { z } from "zod";


interface ProductFormData {
  name: string;
  category: string;
  hpp?: number;
  price: number;
  stock: number;
  image?: string; 
  ingredients?: { rawMaterialId: string; quantity: number }[];
}


export default function AddProductPage() {
  const handleSaveProduct = async (data: ProductFormData) => {
    "use server"; 
    console.log("Product data to save:", {
      ...data,
      image: data.image ? `${data.image.substring(0, 30)}... (truncated)` : undefined
    });

    if (data.image && data.image.startsWith("data:")) {
      console.log("An image was uploaded (Data URI present). This needs server-side processing to save to storage and get a public URL.");
    } else if (data.image) {
      console.log("Image is an existing URL or was not changed:", data.image);
    } else {
      console.log("No image provided or image was removed.");
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
            rawMaterials={mockRawMaterials}
            categories={mockCategoryNames} // Use the list of names
            onSave={handleSaveProduct}
          />
        </CardContent>
      </Card>
    </div>
  );
}

