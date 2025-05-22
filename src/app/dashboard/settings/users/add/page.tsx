
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import UserForm from "@/components/users/user-form"; // Impor form baru
import type { UserFormData } from "@/types/user";
import { createUserAction } from "../actions"; // Impor server action
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getMockCompanyById } from "@/data/companies";
import { getMockRoles } from "@/data/roles"; // Untuk daftar peran
import { mockOutlets as getAllMockOutlets } from "@/app/dashboard/settings/outlets/page"; // Untuk daftar outlet
import type { Outlet } from "@/app/dashboard/settings/outlets/page";
import { AlertTriangle } from "lucide-react";
import type { Role } from "@/types/role";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function AddUserPage() {
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [activeCompanyName, setActiveCompanyName] = React.useState<string | null>(null);
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [outletsForCompany, setOutletsForCompany] = React.useState<Outlet[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    setRoles(getMockRoles()); 

    if (storedCompanyId) {
      const companyDetails = getMockCompanyById(storedCompanyId);
      setActiveCompanyName(companyDetails?.name || null);
      const allOutlets = getAllMockOutlets; 
      setOutletsForCompany(allOutlets.filter(outlet => outlet.companyId === storedCompanyId));
    } else {
        setOutletsForCompany([]);
    }
    setIsLoading(false);
  }, []);

  const handleSaveUser = async (data: UserFormData) => {
    if (!activeCompanyId) {
      console.error("Gagal menyimpan pengguna: ID Perusahaan aktif tidak ditemukan.");
      throw new Error("ID Perusahaan aktif tidak ditemukan.");
    }
    return createUserAction(data, activeCompanyId);
  };

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
      <UserForm 
        onSave={handleSaveUser}
        roles={roles}
        outlets={outletsForCompany}
        activeCompanyName={activeCompanyName}
        isEditing={false}
      />
    </div>
  );
}
