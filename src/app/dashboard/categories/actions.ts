
'use server';

import type { CategoryFormData } from "@/components/categories/category-form";
import { addMockCategory, updateMockCategory as dataUpdateMockCategory } from "@/data/categories";
import type { Category } from "@/types/category";

export async function createCategoryAction(
  data: CategoryFormData,
  companyId: string
): Promise<Category> {
  if (!companyId) {
    console.error("Gagal menyimpan kategori: ID Perusahaan aktif tidak ditemukan.");
    throw new Error("ID Perusahaan aktif tidak ditemukan.");
  }
  try {
    const newCategory = addMockCategory(data, companyId);
    console.log("Kategori ditambahkan via action:", newCategory);
    return newCategory;
  } catch (error: any) {
    console.error("Gagal menambahkan kategori via action:", error.message);
    throw new Error(`Gagal menambahkan kategori: ${error.message}`);
  }
}

export async function updateCategoryAction(
  categoryId: string,
  data: CategoryFormData,
  companyId: string
): Promise<Category | undefined> {
  if (!companyId) {
    console.error("Gagal memperbarui kategori: ID Perusahaan aktif tidak ditemukan.");
    throw new Error("ID Perusahaan aktif tidak ditemukan.");
  }
  try {
    const updatedCategory = dataUpdateMockCategory(categoryId, data, companyId);
    if (!updatedCategory) {
      throw new Error("Kategori tidak ditemukan untuk diperbarui.");
    }
    console.log("Kategori diperbarui via action:", updatedCategory);
    return updatedCategory;
  } catch (error: any) {
    console.error("Gagal memperbarui kategori via action:", error.message);
    throw new Error(`Gagal memperbarui kategori: ${error.message}`);
  }
}
