
import { PageHeader } from "@/components/page-header";
import RoleForm from "@/components/roles/role-form";
import type { RoleFormData } from "@/components/roles/role-form";
import { getMockRoleById } from "@/data/roles"; // getMockRoleById is fine here for initial data
import { updateRoleAction } from "../actions"; // Import server action (note the path)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditRolePageProps {
  params: { id: string };
}

export default async function EditRolePage({ params }: EditRolePageProps) {
  const roleId = params.id;
  // Fetching initial data on the server is fine
  const role = getMockRoleById(roleId); 

  const handleUpdateRole = async (data: RoleFormData) => {
    "use server"; // This remains a server function passed to a client component
    try {
      // Call the server action
      const updatedRole = await updateRoleAction(roleId, data); 
      // if (!updatedRole) { // This check is now within the action
      //   throw new Error("Template peran tidak ditemukan untuk diperbarui.");
      // }
      // console.log("Template peran diperbarui:", updatedRole); // Logging is now in the action
      return updatedRole;
    } catch (error) {
      console.error("Gagal memperbarui template peran:", error);
      throw error;
    }
  };

  if (!role) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Template Peran" description="Template peran tidak ditemukan." />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-destructive" /> Template Peran Tidak Ditemukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Template peran yang Anda coba edit tidak ada atau mungkin telah dihapus.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/settings/roles">Kembali ke Daftar Template Peran</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Edit Template Peran Global" 
        description={`Perbarui detail untuk template peran "${role.name}".`}
      />
      <RoleForm
        initialData={role}
        onSave={handleUpdateRole}
        isEditing={true}
      />
    </div>
  );
}
