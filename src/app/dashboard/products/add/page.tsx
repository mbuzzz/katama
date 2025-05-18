
"use client"; // Diperlukan karena menggunakan hooks seperti useState, useEffect

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import ProductForm from "@/components/products/product-form";
import { getMockRawMaterials } from "@/data/raw-materials";
import { getMockCategoryNamesForCompany } from "@/data/categories"; // Menggunakan fungsi baru
import { Card, CardContent } from "@/components/ui/card";
import type { ProductFormData } from "@/components/products/product-form";
import { addMockProduct } from "@/data/products"; 
import type { RawMaterial } from "@/types/raw-material";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function AddProductPage() {
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [rawMaterialsForCompany, setRawMaterialsForCompany] = React.useState<RawMaterial[]>([]);
  const [categoriesForCompany, setCategoriesForCompany] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    if (storedCompanyId) {
      setActiveCompanyId(storedCompanyId);
      // Asumsi getMockRawMaterials dan getMockCategoryNamesForCompany bisa menerima companyId atau difilter di sini
      // Untuk sekarang, kita akan memfilter di sini sebagai contoh
      setRawMaterialsForCompany(getMockRawMaterials(storedCompanyId)); // Asumsi getMockRawMaterials sudah dimodifikasi
      setCategoriesForCompany(getMockCategoryNamesForCompany(storedCompanyId));
    } else {
      // Handle kasus di mana tidak ada companyId yang dipilih
      console.warn("Tidak ada ID perusahaan aktif yang dipilih untuk menambahkan produk.");
      // Mungkin redirect atau tampilkan pesan error
    }
    setIsLoading(false);
  }, []);

  const handleSaveProduct = async (data: ProductFormData) => {
    "use server";
    if (!activeCompanyId) {
      console.error("Gagal menyimpan produk: ID Perusahaan aktif tidak ditemukan.");
      throw new Error("ID Perusahaan aktif tidak ditemukan.");
    }
    console.log("Data produk untuk disimpan:", data, "untuk companyId:", activeCompanyId);

    try {
      // Dapatkan bahan baku lagi di server action untuk memastikan data segar untuk kalkulasi HPP
      const currentRawMaterials = getMockRawMaterials(activeCompanyId); 
      const newProduct = addMockProduct(data, activeCompanyId, currentRawMaterials); 
      console.log("Produk ditambahkan:", newProduct);
      return newProduct;
    } catch (error) {
      console.error("Gagal menambahkan produk:", error);
      throw error; 
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Tambah Produk Baru" 
          description="Memuat data..." 
        />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex justify-center items-center h-64">
            <p>Memuat...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!activeCompanyId && !isLoading) {
     return (
      <div className="space-y-6">
        <PageHeader 
          title="Tambah Produk Baru" 
          description="Tidak dapat menambahkan produk." 
        />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex flex-col justify-center items-center h-64 text-center">
            <p className="text-destructive font-semibold">Pilih perusahaan terlebih dahulu.</p>
            <p className="text-muted-foreground text-sm">Anda perlu memilih perusahaan aktif dari menu dropdown di header sebelum dapat menambahkan produk.</p>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tambah Produk Baru" 
        description="Isi detail produk, harga, stok, dan bahan baku yang digunakan untuk perusahaan yang aktif." 
      />
      <Card className="shadow-lg">
        <CardContent className="pt-6">
          <ProductForm
            rawMaterials={rawMaterialsForCompany}
            categories={categoriesForCompany} 
            onSave={handleSaveProduct}
            isEditing={false}
            // activeCompanyId={activeCompanyId} // ProductForm tidak perlu ini jika onSave sudah handle
          />
        </CardContent>
      </Card>
    </div>
  );
}
