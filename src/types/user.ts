
export interface User {
  id: string;
  companyId: string; // Added for SaaS multi-tenancy
  name: string;
  email: string;
  password?: string; // Ditambahkan untuk form, sebaiknya tidak disimpan langsung
  role: string; // Could be an enum or linked to Role type
  outlet: string; // Could be linked to Outlet type
  avatar?: string;
  points?: number;
  badge?: string; // e.g., "Pemula", "Pro", "Veteran"
}

// Tipe data untuk formulir tambah/edit pengguna
export interface UserFormData {
  name: string;
  email: string;
  password?: string; // Password opsional saat edit, wajib saat tambah
  confirmPassword?: string; // Untuk validasi
  role: string;
  outletId: string; // Menggunakan outletId untuk referensi ke outlet
}

