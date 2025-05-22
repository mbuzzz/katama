
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import OutletForm from "@/components/settings/outlet-form"; 
import type { OutletFormData, Outlet } from "@/types/outlet";
import { updateOutletAction } from "../actions"; // Path relatif ke file actions.ts
import { getMockOutletById, getMockCompanyById } from "@/data/outlets"; // Menggunakan getMockOutletById terpusat
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

interface EditOutletPageProps {
  params: { id: string };
}

export default function EditOutletPage({ params }: EditOutletPageProps) {
  const outletId = params.id;
  const [outlet, setOutlet] = React.useState<Outlet | null | undefined>(undefined); // undefined for loading
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [activeCompanyName, setActiveCompanyName] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);

    if (storedCompanyId) {
      // Note: getMockCompanyById is from /data/companies.ts, not /data/outlets.ts
      // For outlet data, we use getMockOutletById
      const companyDetails = getMockCompanyById(storedCompanyId); // Assuming getMockCompanyById is available from companies data
      setActiveCompanyName(companyDetails?.name || null);
      
      const fetchedOutlet = getMockOutletById(outletId, storedCompanyId);
      setOutlet(fetchedOutlet);
    } else {
      setOutlet(null); // No active company, so outlet cannot be determined/edited
    }
    setIsLoading(false);
  }, [outletId]);

  const handleUpdateOutlet = async (data: OutletFormData) => {
    if (!activeCompanyId) {
      console.error("Gagal memperbarui outlet: ID Perusahaan aktif tidak ditemukan.");
      throw new Error("ID Perusahaan aktif tidak ditemukan.");
    }
    return updateOutletAction(outletId, data, activeCompanyId);
  };

  if (isLoading || outlet === undefined) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Outlet" description="Memuat data outlet..." />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex justify-center items-center h-64">
            <p>Memuat...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!outlet) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Outlet" description="Outlet tidak ditemukan." />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-destructive" /> Outlet Tidak Ditemukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Outlet yang Anda coba edit tidak ada untuk perusahaan yang aktif, atau Anda belum memilih perusahaan.</p>
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
        title={`Edit Outlet "${outlet.name}"`}
        description={`Perbarui detail untuk outlet "${outlet.name}" pada perusahaan ${activeCompanyName || "yang aktif"}.`}
      />
      <OutletForm
        initialData={outlet}
        onSave={handleUpdateOutlet}
        isEditing={true}
        activeCompanyName={activeCompanyName}
      />
    </div>
  );
}
