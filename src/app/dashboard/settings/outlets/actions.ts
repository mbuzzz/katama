
'use server';

import type { OutletFormData, Outlet } from "@/types/outlet";
import { addMockOutlet as dataAddMockOutlet, updateMockOutlet as dataUpdateMockOutlet, deleteMockOutlet as dataDeleteMockOutlet } from "@/data/outlets";
import { deleteMockOperatingHoursForOutlet } from "@/data/operating-hours"; // Import here

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

export async function updateOutletAction(
  outletId: string,
  data: OutletFormData,
  companyId: string
): Promise<Outlet | undefined> {
  if (!companyId) {
    console.error("Gagal memperbarui outlet: ID Perusahaan aktif tidak ditemukan.");
    throw new Error("ID Perusahaan aktif tidak ditemukan.");
  }
  if (!outletId) {
    console.error("Gagal memperbarui outlet: ID Outlet tidak ditemukan.");
    throw new Error("ID Outlet tidak ditemukan.");
  }
  try {
    const updatedOutlet = dataUpdateMockOutlet(outletId, data, companyId);
    if (!updatedOutlet) {
      throw new Error("Outlet tidak ditemukan untuk diperbarui.");
    }
    console.log("Outlet diperbarui via action:", updatedOutlet);
    return updatedOutlet;
  } catch (error: any) {
    console.error("Gagal memperbarui outlet via action:", error.message);
    throw new Error(`Gagal memperbarui outlet: ${error.message}`);
  }
}

export async function deleteOutletAction(
  outletId: string,
  companyId: string
): Promise<boolean> {
  if (!companyId) {
    console.error("Gagal menghapus outlet: ID Perusahaan aktif tidak ditemukan.");
    throw new Error("ID Perusahaan aktif tidak ditemukan.");
  }
  if (!outletId) {
    console.error("Gagal menghapus outlet: ID Outlet tidak ditemukan.");
    throw new Error("ID Outlet tidak ditemukan.");
  }
  try {
    // First, delete associated operating hours
    const opHoursDeleted = deleteMockOperatingHoursForOutlet(outletId, companyId);
    if (opHoursDeleted) {
      console.log(`Jam operasional untuk outlet ${outletId} (perusahaan ${companyId}) dihapus.`);
    } else {
      console.warn(`Tidak ada jam operasional ditemukan atau gagal dihapus untuk outlet ${outletId} (perusahaan ${companyId}).`);
    }

    // Then, delete the outlet itself
    const success = dataDeleteMockOutlet(outletId, companyId);
    if (success) {
      console.log(`Outlet dengan ID ${outletId} untuk perusahaan ${companyId} dihapus via action.`);
    } else {
      console.warn(`Gagal menghapus outlet dengan ID ${outletId} untuk perusahaan ${companyId} via action atau outlet tidak ditemukan.`);
    }
    return success; // Return success of outlet deletion primarily
  } catch (error: any) {
    console.error("Gagal menghapus outlet via action:", error.message);
    throw new Error(`Gagal menghapus outlet: ${error.message}`);
  }
}
