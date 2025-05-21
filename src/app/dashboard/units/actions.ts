
'use server';

import type { UnitFormData } from "@/components/units/unit-form";
import { addMockUnit as dataAddMockUnit } from "@/data/units";
import type { Unit } from "@/types/unit";

export async function createUnitAction(
  data: UnitFormData,
  companyId: string
): Promise<Unit> {
  if (!companyId) {
    console.error("Gagal menyimpan satuan: ID Perusahaan aktif tidak ditemukan.");
    throw new Error("ID Perusahaan aktif tidak ditemukan.");
  }
  try {
    const newUnit = dataAddMockUnit(data, companyId);
    return newUnit;
  } catch (error: any) {
    console.error("Gagal menambahkan satuan via action:", error.message);
    throw new Error(`Gagal menambahkan satuan: ${error.message}`);
  }
}

// Placeholder for update action if needed in the future
// export async function updateUnitAction(
//   unitId: string,
//   data: UnitFormData,
//   companyId: string
// ): Promise<Unit | undefined> {
//   // ... implementation
// }
