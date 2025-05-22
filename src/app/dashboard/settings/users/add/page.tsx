
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getMockCompanyById } from "@/data/companies";
import { AlertTriangle } from "lucide-react";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function AddUserPage() {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Tambah Pengguna Baru" 
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
          title="Tambah Pengguna Baru" 
          description="Tidak dapat menambahkan pengguna." 
        />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-destructive" /> Perusahaan Belum Dipilih
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Anda perlu memilih perusahaan aktif terlebih dahulu sebelum dapat menambahkan pengguna.</p>
            <p className="text-sm text-muted-foreground mt-1">Jika Anda Superadmin, pilih perusahaan dari dropdown di header.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/settings/users">Kembali ke Daftar Pengguna</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title={`Tambah Pengguna Baru untuk ${activeCompanyName || "Perusahaan Terpilih"}`}
        description={`Isi detail untuk pengguna baru yang akan dikaitkan dengan perusahaan ${activeCompanyName || "ini"}.`}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Formulir Tambah Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fitur formulir tambah pengguna lengkap masih dalam pengembangan. 
            Pengguna baru akan dikaitkan dengan perusahaan "{activeCompanyName}".
          </p>
          {/* 
            Placeholder for the actual user form:
            <UserForm companyId={activeCompanyId} onSave={handleSaveUser} /> 
          */}
          <div className="mt-6 p-6 border border-dashed rounded-md text-center">
            <p className="text-lg font-semibold">Formulir Tambah Pengguna</p>
            <p className="text-sm text-muted-foreground">(Segera Hadir)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
