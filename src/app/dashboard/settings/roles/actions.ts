
'use server';

import type { RoleFormData } from "@/components/roles/role-form";
import type { Role } from "@/types/role";
import { addMockRole as dataAddMockRole, updateMockRole as dataUpdateMockRole } from "@/data/roles";

export async function createRoleAction(
  data: RoleFormData
): Promise<Role> {
  try {
    const newRole = dataAddMockRole(data);
    console.log("Template peran ditambahkan via action:", newRole);
    return newRole;
  } catch (error: any) {
    console.error("Gagal menambahkan template peran via action:", error.message);
    throw new Error(`Gagal menambahkan template peran: ${error.message}`);
  }
}

export async function updateRoleAction(
  roleId: string,
  data: RoleFormData
): Promise<Role | undefined> {
  try {
    const updatedRole = dataUpdateMockRole(roleId, data);
    if (!updatedRole) {
      throw new Error("Template peran tidak ditemukan untuk diperbarui.");
    }
    console.log("Template peran diperbarui via action:", updatedRole);
    return updatedRole;
  } catch (error: any) {
    console.error("Gagal memperbarui template peran via action:", error.message);
    throw new Error(`Gagal memperbarui template peran: ${error.message}`);
  }
}
