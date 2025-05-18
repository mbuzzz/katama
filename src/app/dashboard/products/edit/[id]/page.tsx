
"use client"; // Diperlukan karena menggunakan hooks

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import ProductForm from "@/components/products/product-form";
import type { ProductFormData } from "@/components/products/product-form";
import { getMockProductById, updateMockProduct } from "@/data/products";
import { getMockRawMaterials } from "@/data/raw-materials";
import { getMockCategoryNamesForCompany } from "@/data/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
import type { RawMaterial } from "@/types/raw-material";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

interface EditProductPageProps {
  params: { id: string };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const productId = params.id;
  const [product, setProduct] = React.useState<Product | null | undefined>(undefined); // undefined for loading
  const [rawMaterialsForCompany, setRawMaterialsForCompany] = React.useState<RawMaterial[]>([]);
  const [categoriesForCompany, setCategoriesForCompany] = React.useState<string[]>([]);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    if (storedCompanyId) {
      setActiveCompanyId(storedCompanyId);
      const fetchedProduct = getMockProductById(productId, storedCompanyId);
      setProduct(fetchedProduct);
      setRawMaterialsForCompany(getMockRawMaterials(storedCompanyId)); // Asumsi getMockRawMaterials sudah dimodifikasi
      setCategoriesForCompany(getMockCategoryNamesForCompany(storedCompanyId));
    } else {
      setProduct(null); // Tidak ada companyId, produk tidak bisa dimuat/diedit
    }
    setIsLoading(false);
  }, [productId]);


  const handleUpdateProduct = async (data: ProductFormData) => {
    "use server";
    if (!activeCompanyId) {
      console.error("Gagal memperbarui produk: ID Perusahaan aktif tidak ditemukan.");
      throw new Error("ID Perusahaan aktif tidak ditemukan.");
    }
    try {
      const currentRawMaterials = getMockRawMaterials(activeCompanyId);
      const updatedProduct = updateMockProduct(productId, data, activeCompanyId, currentRawMaterials);
      if (!updatedProduct) {
        throw new Error("Produk tidak ditemukan untuk diperbarui.");
      }
      console.log("Produk diperbarui:", updatedProduct);
      return updatedProduct; 
    } catch (error) {
      console.error("Gagal memperbarui produk:", error);
      throw error;
    }
  };

  if (isLoading || product === undefined) { // product === undefined berarti masih loading state awal
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Produk" description="Memuat data produk..." />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex justify-center items-center h-64">
            <p>Memuat...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) { // product === null berarti produk tidak ditemukan atau tidak ada companyId
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
            <p>Produk yang Anda coba edit tidak ada, bukan milik perusahaan yang aktif, atau Anda belum memilih perusahaan.</p>
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
        description={`Perbarui detail untuk produk "${product.name}" pada perusahaan yang aktif.`}
      />
       <Card className="shadow-lg">
        <CardContent className="pt-6">
          <ProductForm
            initialData={product}
            rawMaterials={rawMaterialsForCompany}
            categories={categoriesForCompany}
            onSave={handleUpdateProduct}
            isEditing={true}
            // activeCompanyId={activeCompanyId} // Tidak perlu jika onSave sudah menangani
          />
        </CardContent>
      </Card>
    </div>
  );
}
