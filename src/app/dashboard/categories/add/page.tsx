
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import CategoryForm from "@/components/categories/category-form";
import type { CategoryFormData } from "@/components/categories/category-form";
import { createCategoryAction } from "./actions";
import { Card, CardContent } from "@/components/ui/card";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function AddCategoryPage() {
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    setIsLoading(false);
  }, []);

  const handleSaveCategory = async (data: CategoryFormData) => {
    // This function is now a client-side function that calls the server action
    if (!activeCompanyId) {
      console.error("Gagal menyimpan kategori: ID Perusahaan aktif tidak ditemukan.");
      throw new Error("ID Perusahaan aktif tidak ditemukan.");
    }
    return createCategoryAction(data, activeCompanyId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Tambah Kategori Baru" 
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
          title="Tambah Kategori Baru" 
          description="Tidak dapat menambahkan kategori." 
        />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex flex-col justify-center items-center h-64 text-center">
            <p className="text-destructive font-semibold">Pilih perusahaan terlebih dahulu.</p>
            <p className="text-muted-foreground text-sm">Anda perlu memilih perusahaan aktif dari menu dropdown di header sebelum dapat menambahkan kategori.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tambah Kategori Baru" 
        description="Isi detail untuk kategori produk baru perusahaan yang aktif." 
      />
      <CategoryForm
        onSave={handleSaveCategory}
        isEditing={false}
      />
    </div>
  );
}
