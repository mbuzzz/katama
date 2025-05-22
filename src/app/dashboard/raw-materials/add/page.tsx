
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import RawMaterialForm from "@/components/raw-materials/raw-material-form";
import type { RawMaterialFormData } from "@/components/raw-materials/raw-material-form";
import { createRawMaterialAction } from "../actions"; // Import the server action
import { Card, CardContent } from "@/components/ui/card";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function AddRawMaterialPage() {
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    setIsLoading(false);
  }, []);

  const handleSaveRawMaterial = async (data: RawMaterialFormData) => {
    // This function is now a client-side function that calls the server action
    if (!activeCompanyId) {
      console.error("Gagal menyimpan bahan baku: ID Perusahaan aktif tidak ditemukan.");
      throw new Error("ID Perusahaan aktif tidak ditemukan.");
    }
    return createRawMaterialAction(data, activeCompanyId);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Tambah Bahan Baku Baru" 
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
          title="Tambah Bahan Baku Baru" 
          description="Tidak dapat menambahkan bahan baku." 
        />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex flex-col justify-center items-center h-64 text-center">
            <p className="text-destructive font-semibold">Pilih perusahaan terlebih dahulu.</p>
             <p className="text-muted-foreground text-sm">Anda perlu memilih perusahaan aktif dari menu dropdown di header sebelum dapat menambahkan bahan baku.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tambah Bahan Baku Baru" 
        description="Isi detail untuk bahan baku baru untuk perusahaan yang aktif." 
      />
      <RawMaterialForm
        onSave={handleSaveRawMaterial}
        isEditing={false}
      />
    </div>
  );
}
