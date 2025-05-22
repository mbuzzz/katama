
'use server';

import type { OutletFormData, Outlet } from "@/types/outlet";
import { addMockOutlet as dataAddMockOutlet } from "@/data/outlets";

export async function createOutletAction(
  data: OutletFormData,
  companyId: string
): Promise<Outlet> {
  if (!companyId) {
    console.error("Gagal membuat outlet: ID Perusahaan aktif tidak ditemukan.");
    throw new Error("ID Perusahaan aktif tidak ditemukan.");
  }
  try {
    const newOutlet = dataAddMockOutlet(data, companyId);
    console.log("Outlet ditambahkan via action:", newOutlet);
    return newOutlet;
  } catch (error: any) {
    console.error("Gagal menambahkan outlet via action:", error.message);
    throw new Error(`Gagal menambahkan outlet: ${error.message}`);
  }
}

// Placeholder for update action if needed in the future
// export async function updateOutletAction(
//   outletId: string,
//   data: OutletFormData,
//   companyId: string
// ): Promise<Outlet | undefined> {
//   // ... implementation
// }
