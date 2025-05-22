
'use server';

import type { Shift, ShiftFormData, EndShiftData } from '@/types/shift';
import { 
  addMockShift as dataAddMockShift, 
  endMockShift as dataEndMockShift, 
  cancelMockShift as dataCancelMockShift 
} from '@/data/shifts';

export async function createShiftAction(
  data: ShiftFormData,
  companyId: string
): Promise<Shift> {
  if (!companyId) {
    console.error("Gagal memulai shift: ID Perusahaan aktif tidak ditemukan.");
    throw new Error("ID Perusahaan aktif tidak ditemukan.");
  }
  try {
    const newShift = dataAddMockShift(data, companyId);
    return newShift;
  } catch (error: any) {
    console.error("Gagal memulai shift via action:", error.message);
    throw new Error(`Gagal memulai shift: ${error.message}`);
  }
}

export async function endShiftAction(
  shiftId: string,
  endShiftData: EndShiftData,
  companyId: string
): Promise<Shift | undefined> {
  if (!companyId) {
    console.error("Gagal mengakhiri shift: ID Perusahaan aktif tidak ditemukan.");
    throw new Error("ID Perusahaan aktif tidak ditemukan.");
  }
  if (!shiftId) {
    console.error("Gagal mengakhiri shift: ID Shift tidak ditemukan.");
    throw new Error("ID Shift tidak ditemukan.");
  }
  try {
    const updatedShift = dataEndMockShift(shiftId, endShiftData, companyId);
    if (!updatedShift) {
      throw new Error("Shift tidak ditemukan atau gagal diakhiri.");
    }
    return updatedShift;
  } catch (error: any) {
    console.error("Gagal mengakhiri shift via action:", error.message);
    throw new Error(`Gagal mengakhiri shift: ${error.message}`);
  }
}

export async function cancelShiftAction(
  shiftId: string,
  companyId: string,
  notes?: string
): Promise<Shift | undefined> {
  if (!companyId) {
    console.error("Gagal membatalkan shift: ID Perusahaan aktif tidak ditemukan.");
    throw new Error("ID Perusahaan aktif tidak ditemukan.");
  }
  if (!shiftId) {
    console.error("Gagal membatalkan shift: ID Shift tidak ditemukan.");
    throw new Error("ID Shift tidak ditemukan.");
  }
  try {
    const updatedShift = dataCancelMockShift(shiftId, companyId, notes);
    if (!updatedShift) {
      throw new Error("Shift tidak ditemukan atau gagal dibatalkan.");
    }
    return updatedShift;
  } catch (error: any) {
    console.error("Gagal membatalkan shift via action:", error.message);
    throw new Error(`Gagal membatalkan shift: ${error.message}`);
  }
}
