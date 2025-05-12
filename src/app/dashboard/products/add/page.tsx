
import { PageHeader } from "@/components/page-header";
import ProductForm from "@/components/products/product-form";
import { mockRawMaterials } from "@/data/raw-materials";
import { mockCategories } from "@/data/categories";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/types/product"; // Assuming ProductForm's onSave expects this type structure
import type { z } from "zod";

// This should match the Zod schema in ProductForm if we want strong typing here.
// For simplicity, using `any` for now, but ideally, import ProductFormData type from ProductForm.
// Let's define a simple type for what the server action expects.
interface ProductFormData {
  name: string;
  category: string;
  hpp?: number;
  price: number;
  stock: number;
  image?: string; // Can be a URL or a Data URI
  ingredients?: { rawMaterialId: string; quantity: number }[];
}


export default function AddProductPage() {
  // In a real app, product save would be an API call,
  // and raw materials/categories might be fetched.
  const handleSaveProduct = async (data: ProductFormData) => {
    "use server"; 
    console.log("Product data to save:", {
      ...data,
      image: data.image ? `${data.image.substring(0, 30)}... (truncated)` : undefined
    });

    if (data.image && data.image.startsWith("data:")) {
      console.log("An image was uploaded (Data URI present). This needs server-side processing to save to storage and get a public URL.");
      // Server-side logic would go here:
      // 1. Parse Data URI
      // 2. Convert to buffer/blob
      // 3. Upload to Firebase Storage / S3 etc.
      // 4. Get the public URL
      // 5. Save the public URL with the rest of the product data.
      // For this example, we are just logging. The `data.image` contains the full Data URI.
    } else if (data.image) {
      console.log("Image is an existing URL or was not changed:", data.image);
    } else {
      console.log("No image provided or image was removed.");
    }
    // Simulate saving data
    // Redirect or show success toast in ProductForm after this
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
            categories={mockCategories}
            onSave={handleSaveProduct}
            // initialData can be passed for an edit form
          />
        </CardContent>
      </Card>
    </div>
  );
}

