
import { PageHeader } from "@/components/page-header";
import RawMaterialForm from "@/components/raw-materials/raw-material-form";
import type { RawMaterialFormData } from "@/components/raw-materials/raw-material-form";
import { addMockRawMaterial } from "@/data/raw-materials";
import { getMockUnits } from "@/data/units";

export default async function AddRawMaterialPage() {
  // Fetch units on the server to pass to the client component
  const units = getMockUnits();

  const handleSaveRawMaterial = async (data: RawMaterialFormData) => {
    "use server";
    try {
      const newRawMaterial = addMockRawMaterial(data);
      // console.log("Bahan baku ditambahkan:", newRawMaterial);
      return newRawMaterial;
    } catch (error) {
      console.error("Gagal menambahkan bahan baku:", error);
      throw error; 
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tambah Bahan Baku Baru" 
        description="Isi detail untuk bahan baku baru." 
      />
      <RawMaterialForm
        units={units}
        onSave={handleSaveRawMaterial}
        isEditing={false}
      />
    </div>
  );
}
