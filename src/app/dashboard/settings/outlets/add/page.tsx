
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import OutletForm from "@/components/settings/outlet-form"; 
import type { OutletFormData } from "@/types/outlet";
import { createOutletAction } from "../actions"; // Corrected import path
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getMockCompanyById } from "@/data/companies";
import { AlertTriangle } from "lucide-react";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function AddOutletPage() {
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [activeCompanyName, setActiveCompanyName] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);

    if (storedCompanyId) {
      const companyDetails = getMockCompanyById(storedCompanyId);
      setActiveCompanyName(companyDetails?.name || null);
    }
    setIsLoading(false);
  }, []);

  const handleSaveOutlet = async (data: OutletFormData) => {
    if (!activeCompanyId) {
      console.error("Gagal menyimpan outlet: ID Perusahaan aktif tidak ditemukan.");
      throw new Error("ID Perusahaan aktif tidak ditemukan.");
    }
    return createOutletAction(data, activeCompanyId);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Tambah Outlet Baru" 
          description="Memuat data perusahaan..." 
        />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex justify-center items-center h-64">
            <p>Memuat...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!activeCompanyId) {
     return (
      <div className="space-y-6">
        <PageHeader 
          title="Tambah Outlet Baru" 
          description="Tidak dapat menambahkan outlet." 
        />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-destructive" /> Perusahaan Belum Dipilih
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Anda perlu memilih perusahaan aktif terlebih dahulu dari menu dropdown di header sebelum dapat menambahkan outlet.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/settings/outlets">Kembali ke Daftar Outlet</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Tambah Outlet Baru untuk ${activeCompanyName || "Perusahaan Terpilih"}`}
        description={`Isi detail untuk outlet baru yang akan dikaitkan dengan perusahaan ${activeCompanyName || "ini"}.`}
      />
      <OutletForm 
        onSave={handleSaveOutlet}
        isEditing={false}
        activeCompanyName={activeCompanyName}
      />
    </div>
  );
}
