
'use server';

import type { UserFormData } from "@/types/user";
import { addMockUser as dataAddMockUser } from "@/data/users";
import type { User } from "@/types/user";

export async function createUserAction(
  data: UserFormData,
  companyId: string
): Promise<User> {
  if (!companyId) {
    console.error("Gagal membuat pengguna: ID Perusahaan aktif tidak ditemukan.");
    throw new Error("ID Perusahaan aktif tidak ditemukan.");
  }
  // Validasi tambahan, misal apakah email sudah ada, bisa ditambahkan di sini di aplikasi nyata
  try {
    // Di sistem nyata, password harus di-hash di sini sebelum disimpan
    const newUser = dataAddMockUser(data, companyId); 
    console.log("Pengguna ditambahkan via action:", newUser);
    return newUser;
  } catch (error: any) {
    console.error("Gagal menambahkan pengguna via action:", error.message);
    throw new Error(`Gagal menambahkan pengguna: ${error.message}`);
  }
}

// export async function updateUserAction(
//   userId: string,
//   data: UserFormData,
//   companyId: string // atau jika user global, companyId mungkin tidak diperlukan untuk update User dasar
// ): Promise<User | undefined> {
//   // ... implementasi update
// }
