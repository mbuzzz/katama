
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import UnitForm from "@/components/units/unit-form";
import type { UnitFormData } from "@/components/units/unit-form";
import { createUnitAction } from "./actions"; // Import the server action
import { Card, CardContent } from "@/components/ui/card";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function AddUnitPage() {
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    setIsLoading(false);
  }, []);

  const handleSaveUnit = async (data: UnitFormData) => {
    // This function is now a client-side function that calls the server action
    if (!activeCompanyId) {
      console.error("Gagal menyimpan satuan: ID Perusahaan aktif tidak ditemukan.");
      throw new Error("ID Perusahaan aktif tidak ditemukan.");
    }
    return createUnitAction(data, activeCompanyId);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Tambah Satuan Baru" 
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
          title="Tambah Satuan Baru" 
          description="Tidak dapat menambahkan satuan." 
        />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex flex-col justify-center items-center h-64 text-center">
            <p className="text-destructive font-semibold">Pilih perusahaan terlebih dahulu.</p>
            <p className="text-muted-foreground text-sm">Anda perlu memilih perusahaan aktif dari menu dropdown di header sebelum dapat menambahkan satuan.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tambah Satuan Baru" 
        description="Isi detail untuk satuan barang baru perusahaan yang aktif." 
      />
      <UnitForm
        onSave={handleSaveUnit}
        isEditing={false}
      />
    </div>
  );
}
