
import { PageHeader } from "@/components/page-header";
import ProductForm from "@/components/products/product-form";
import { mockRawMaterials } from "@/data/raw-materials";
import { mockCategories } from "@/data/categories";
import { Card, CardContent } from "@/components/ui/card";

export default function AddProductPage() {
  // In a real app, product save would be an API call,
  // and raw materials/categories might be fetched.
  const handleSaveProduct = async (data: any) => {
    "use server"; // Or this function would be an API endpoint call
    console.log("Product data to save:", data);
    // Simulate saving data
    // Redirect or show success toast in ProductForm after this
    // For now, we'll just log it.
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
