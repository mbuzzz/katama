
'use server';

import type { RawMaterialFormData } from "@/components/raw-materials/raw-material-form";
import { addMockRawMaterial } from "@/data/raw-materials";
import type { RawMaterial } from "@/types/raw-material";

export async function createRawMaterialAction(
  data: RawMaterialFormData,
  companyId: string
): Promise<RawMaterial> {
  if (!companyId) {
    console.error("Gagal menyimpan bahan baku: ID Perusahaan aktif tidak ditemukan.");
    throw new Error("ID Perusahaan aktif tidak ditemukan.");
  }
  try {
    // Untuk SaaS, addMockRawMaterial perlu companyId
    const newRawMaterial = addMockRawMaterial(data, companyId);
    return newRawMaterial;
  } catch (error: any) {
    console.error("Gagal menambahkan bahan baku:", error.message);
    throw new Error(`Gagal menambahkan bahan baku: ${error.message}`);
  }
}

// Placeholder for update action if needed
// export async function updateRawMaterialAction(
//   materialId: string,
//   data: RawMaterialFormData,
//   companyId: string
// ): Promise<RawMaterial | undefined> {
//   // ... implementation
// }
