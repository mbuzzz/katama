
import { PageHeader } from "@/components/page-header";
import ProductForm from "@/components/products/product-form";
import { getMockRawMaterials } from "@/data/raw-materials"; // Corrected import path
import { getMockCategories } from "@/data/categories"; // Get full category objects
import { Card, CardContent } from "@/components/ui/card";
// import type { Product } from "@/types/product";  // Not used directly here
import type { ProductFormData } from "@/components/products/product-form"; // Use the form data type

// This type is defined in product-form.tsx, reusing here for the server action
// interface ProductFormData {
//   name: string;
//   category: string;
//   hpp?: number;
//   price: number;
//   stock: number;
//   image?: string; 
//   ingredients?: { rawMaterialId: string; quantity: number }[];
// }


export default async function AddProductPage() {
  // Fetch data on the server to pass to the client component
  const rawMaterials = getMockRawMaterials();
  const categories = getMockCategories().map(cat => cat.name); // Extract names for the form

  const handleSaveProduct = async (data: ProductFormData) => {
    "use server"; 
    console.log("Product data to save:", {
      ...data,
      image: data.image ? `${data.image.substring(0, 60)}... (truncated if Data URI)` : undefined,
      // HPP could be recalculated here based on ingredients if desired
    });

    // Here you would typically:
    // 1. If data.image is a Data URI, upload it to a storage service (e.g., Firebase Storage, Cloudinary)
    //    and get back a public URL. Replace data.image with this URL.
    // 2. Save the complete product data (with the image URL) to your database.
    // 3. Potentially update raw material stock if ingredients are specified (deduct quantities).
    // For this mock, we're just logging.
    
    // Example of logging image type
    if (data.image && data.image.startsWith("data:")) {
      console.log("An image Data URI was provided. Needs server-side processing.");
    } else if (data.image) {
      console.log("Image is likely an existing URL or was not changed:", data.image);
    } else {
      console.log("No image provided or image was removed.");
    }
    // Mock save, in a real app this would interact with a database
    // addMockProduct(data); // Assuming you have a mock function like this
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
            isEditing={false} // Explicitly set for clarity
          />
        </CardContent>
      </Card>
    </div>
  );
}
