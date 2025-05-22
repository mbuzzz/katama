
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import RawMaterialForm from "@/components/raw-materials/raw-material-form";
import type { RawMaterialFormData } from "@/components/raw-materials/raw-material-form";
import { addMockRawMaterial } from "@/data/raw-materials";
// import { getMockUnits } from "@/data/units"; // No longer needed here
// import type { Unit } from "@/types/unit"; // No longer needed here
import { Card, CardContent } from "@/components/ui/card";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function AddRawMaterialPage() {
  // const [units, setUnits] = React.useState<Unit[]>([]); // No longer needed
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // setUnits(getMockUnits()); // No longer needed, form handles its own units
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    setIsLoading(false);
  }, []);

  const handleSaveRawMaterial = async (data: RawMaterialFormData) => {
    "use server";
    if (!activeCompanyId) {
      console.error("Gagal menyimpan bahan baku: ID Perusahaan aktif tidak ditemukan.");
      throw new Error("ID Perusahaan aktif tidak ditemukan.");
    }
    try {
      // Untuk SaaS, addMockRawMaterial perlu companyId
      const newRawMaterial = addMockRawMaterial(data, activeCompanyId);
      return newRawMaterial;
    } catch (error) {
      console.error("Gagal menambahkan bahan baku:", error);
      throw error; 
    }
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
        // units={units} // Prop removed
        onSave={handleSaveRawMaterial}
        isEditing={false}
      />
    </div>
  );
}
