
import { PageHeader } from "@/components/page-header";
import ShiftForm from "@/components/shifts/shift-form";
import type { ShiftFormData } from "@/types/shift";
import { addMockShift, getMockUsersForSelect, getMockOutletsForSelect } from "@/data/shifts";

export default async function AddShiftPage() {
  // Fetch users and outlets on the server to pass to the client component
  // These functions should be adapted if users/outlets are fetched from a real DB
  const users = getMockUsersForSelect();
  const outlets = getMockOutletsForSelect();

  const handleSaveShift = async (data: ShiftFormData) => {
    "use server";
    try {
      const newShift = addMockShift(data);
      // console.log("Shift dimulai:", newShift);
      return newShift; // Or redirect, handle in ShiftForm
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
        onSave={handleSaveShift}
      />
    </div>
  );
}
