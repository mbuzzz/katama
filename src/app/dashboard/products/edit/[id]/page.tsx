
import { PageHeader } from "@/components/page-header";
import ProductForm from "@/components/products/product-form";
import type { ProductFormData } from "@/components/products/product-form";
import { getMockProductById, updateMockProduct } from "@/data/products";
import { getMockRawMaterials } from "@/data/raw-materials";
import { getMockCategories } from "@/data/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditProductPageProps {
  params: { id: string };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const productId = params.id;
  const product = getMockProductById(productId);
  const rawMaterials = getMockRawMaterials(); // For the form's dropdown
  const categories = getMockCategories().map(cat => cat.name); // For the form's dropdown

  const handleUpdateProduct = async (data: ProductFormData) => {
    "use server";
    try {
      // Fetch all raw materials again within server action for HPP recalculation
      const currentRawMaterials = getMockRawMaterials();
      const updatedProduct = updateMockProduct(productId, data, currentRawMaterials);
      if (!updatedProduct) {
        throw new Error("Produk tidak ditemukan untuk diperbarui.");
      }
      console.log("Produk diperbarui:", updatedProduct);
      return updatedProduct; // Return updated product
    } catch (error) {
      console.error("Gagal memperbarui produk:", error);
      throw error;
    }
  };

  if (!product) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Produk" description="Produk tidak ditemukan." />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-destructive" /> Produk Tidak Ditemukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Produk yang Anda coba edit tidak ada atau mungkin telah dihapus.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/products">Kembali ke Daftar Produk</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Edit Produk" 
        description={`Perbarui detail untuk produk "${product.name}".`}
      />
       <Card className="shadow-lg">
        <CardContent className="pt-6">
          <ProductForm
            initialData={product}
            rawMaterials={rawMaterials}
            categories={categories}
            onSave={handleUpdateProduct}
            isEditing={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}
