
import { PageHeader } from "@/components/page-header";
import UnitForm from "@/components/units/unit-form";
import type { UnitFormData } from "@/components/units/unit-form";
import { addMockUnit } from "@/data/units";

export default function AddUnitPage() {

  const handleSaveUnit = async (data: UnitFormData) => {
    "use server";
    try {
      const newUnit = addMockUnit(data);
      // console.log("Satuan ditambahkan:", newUnit);
      return newUnit; // Return new unit so form can use it if needed
    } catch (error) {
      console.error("Gagal menambahkan satuan:", error);
      throw error; // Re-throw to be caught by form's error handler
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tambah Satuan Baru" 
        description="Isi detail untuk satuan barang baru." 
      />
      <UnitForm
        onSave={handleSaveUnit}
        isEditing={false}
      />
    </div>
  );
}
