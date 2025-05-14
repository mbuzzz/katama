
import { PageHeader } from "@/components/page-header";
import ShiftForm from "@/components/shifts/shift-form";
import type { ShiftFormData } from "@/types/shift";
import { addMockShift, getMockUsersForSelect, getMockOutletsForSelect } from "@/data/shifts";
import { getMockOperatingHours } from "@/data/operating-hours"; // Import data jam operasional
import type { OperatingHours } from "@/types/operating-hours";

export default async function AddShiftPage() {
  const users = getMockUsersForSelect();
  const outlets = getMockOutletsForSelect();
  const allOperatingHours: OperatingHours[] = getMockOperatingHours(); // Ambil semua data jam operasional

  const handleSaveShift = async (data: ShiftFormData) => {
    "use server";
    try {
      const newShift = addMockShift(data);
      // console.log("Shift dimulai:", newShift);
      return newShift; 
    } catch (error) {
      console.error("Gagal memulai shift:", error);
      throw error; 
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mulai Shift Baru" 
        description="Isi detail untuk memulai sesi kerja baru." 
      />
      <ShiftForm
        users={users}
        outlets={outlets}
        allOperatingHours={allOperatingHours} // Kirim data jam operasional ke form
        onSave={handleSaveShift}
      />
    </div>
  );
}
