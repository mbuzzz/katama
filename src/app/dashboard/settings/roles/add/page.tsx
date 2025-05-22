
import { PageHeader } from "@/components/page-header";
import RoleForm from "@/components/roles/role-form";
import type { RoleFormData } from "@/components/roles/role-form";
import { createRoleAction } from "./actions"; // Import server action

export default function AddRolePage() {

  const handleSaveRole = async (data: RoleFormData) => {
    "use server"; // This remains a server function passed to a client component
    try {
      // Call the server action
      const newRole = await createRoleAction(data); 
      // console.log("Template peran ditambahkan:", newRole); // Logging is now in the action
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
