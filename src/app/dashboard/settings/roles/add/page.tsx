
import { PageHeader } from "@/components/page-header";
import RoleForm from "@/components/roles/role-form";
import type { RoleFormData } from "@/components/roles/role-form";
import { addMockRole } from "@/data/roles";

export default function AddRolePage() {

  const handleSaveRole = async (data: RoleFormData) => {
    "use server";
    try {
      const newRole = addMockRole(data);
      console.log("Template peran ditambahkan:", newRole);
      return newRole;
    } catch (error) {
      console.error("Gagal menambahkan template peran:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tambah Template Peran Global Baru" 
        description="Isi detail untuk template peran pengguna baru. Peran ini akan tersedia secara global." 
      />
      <RoleForm
        onSave={handleSaveRole}
        isEditing={false}
      />
    </div>
  );
}
