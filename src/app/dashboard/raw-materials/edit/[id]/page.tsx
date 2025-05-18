
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import RawMaterialForm from "@/components/raw-materials/raw-material-form";
import type { RawMaterialFormData } from "@/components/raw-materials/raw-material-form";
import { getMockRawMaterialById, updateMockRawMaterial } from "@/data/raw-materials";
import { getMockUnits } from "@/data/units";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { RawMaterial } from "@/types/raw-material";
import type { Unit } from "@/types/unit";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

interface EditRawMaterialPageProps {
  params: { id: string };
}

export default function EditRawMaterialPage({ params }: EditRawMaterialPageProps) {
  const materialId = params.id;
  const [material, setMaterial] = React.useState<RawMaterial | null | undefined>(undefined);
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setUnits(getMockUnits());
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    if (storedCompanyId) {
      setActiveCompanyId(storedCompanyId);
      // Untuk SaaS, getMockRawMaterialById perlu companyId
      setMaterial(getMockRawMaterialById(materialId, storedCompanyId));
    } else {
      setMaterial(null);
    }
    setIsLoading(false);
  }, [materialId]);

  const handleUpdateRawMaterial = async (data: RawMaterialFormData) => {
    "use server";
    if (!activeCompanyId) {
      console.error("Gagal memperbarui bahan baku: ID Perusahaan aktif tidak ditemukan.");
      throw new Error("ID Perusahaan aktif tidak ditemukan.");
    }
    try {
      // Untuk SaaS, updateMockRawMaterial perlu companyId
      const updatedMaterial = updateMockRawMaterial(materialId, data, activeCompanyId);
      if (!updatedMaterial) {
        throw new Error("Bahan baku tidak ditemukan untuk diperbarui.");
      }
      return updatedMaterial;
    } catch (error) {
      console.error("Gagal memperbarui bahan baku:", error);
      throw error;
    }
  };

  if (isLoading || material === undefined) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Bahan Baku" description="Memuat data..." />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex justify-center items-center h-64">
            <p>Memuat...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Bahan Baku" description="Bahan baku tidak ditemukan." />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-destructive" /> Bahan Baku Tidak Ditemukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Bahan baku yang Anda coba edit tidak ada, bukan milik perusahaan yang aktif, atau Anda belum memilih perusahaan.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/raw-materials">Kembali ke Daftar Bahan Baku</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Edit Bahan Baku" 
        description={`Perbarui detail untuk bahan baku "${material.name}" pada perusahaan yang aktif.`}
      />
      <RawMaterialForm
        initialData={material}
        units={units}
        onSave={handleUpdateRawMaterial}
        isEditing={true}
      />
    </div>
  );
}
