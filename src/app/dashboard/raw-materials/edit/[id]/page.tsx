
import { PageHeader } from "@/components/page-header";
import RawMaterialForm from "@/components/raw-materials/raw-material-form";
import type { RawMaterialFormData } from "@/components/raw-materials/raw-material-form";
import { getMockRawMaterialById, updateMockRawMaterial } from "@/data/raw-materials";
import { getMockUnits } from "@/data/units";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditRawMaterialPageProps {
  params: { id: string };
}

export default async function EditRawMaterialPage({ params }: EditRawMaterialPageProps) {
  const materialId = params.id;
  const material = getMockRawMaterialById(materialId);
  const units = getMockUnits();

  const handleUpdateRawMaterial = async (data: RawMaterialFormData) => {
    "use server";
    try {
      const updatedMaterial = updateMockRawMaterial(materialId, data);
      if (!updatedMaterial) {
        throw new Error("Bahan baku tidak ditemukan untuk diperbarui.");
      }
      // console.log("Bahan baku diperbarui:", updatedMaterial);
      return updatedMaterial;
    } catch (error) {
      console.error("Gagal memperbarui bahan baku:", error);
      throw error;
    }
  };

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
            <p>Bahan baku yang Anda coba edit tidak ada atau mungkin telah dihapus.</p>
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
        description={`Perbarui detail untuk bahan baku "${material.name}".`}
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
