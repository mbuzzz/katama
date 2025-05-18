
export interface RolePermission {
  feature: string; // e.g., "products", "pos", "reports.sales"
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions?: RolePermission[]; 
  userCount?: number; 
}

export const availableFeatures: { key: string; name: string; description?: string }[] = [
  { key: "dashboard", name: "Dasbor", description: "Akses ke halaman dasbor utama." },
  { key: "admin_overview", name: "Overview Administrasi", description: "Akses ke halaman ringkasan administrasi sistem." },
  { key: "admin_companies", name: "Manajemen Perusahaan", description: "Mengelola daftar perusahaan dalam sistem." },
  { key: "pos", name: "Point of Sale", description: "Akses untuk melakukan transaksi penjualan." },
  { key: "shifts", name: "Manajemen Shift", description: "Mengelola sesi kerja kasir/pengguna." },
  { key: "products", name: "Produk", description: "Mengelola data produk jadi." },
  { key: "categories", name: "Kategori Produk", description: "Mengelola kategori untuk produk." },
  { key: "raw_materials", name: "Bahan Baku", description: "Mengelola data dan stok bahan baku." },
  { key: "units", name: "Satuan Barang", description: "Mengelola satuan untuk item." },
  { key: "purchases", name: "Pembelanjaan", description: "Mencatat dan mengelola pembelian bahan baku." },
  { key: "reports_sales", name: "Laporan Penjualan", description: "Melihat laporan terkait penjualan." },
  { key: "reports_purchases", name: "Laporan Pembelanjaan", description: "Melihat laporan terkait pembelanjaan." },
  { key: "reports_stock", name: "Laporan Stok", description: "Melihat laporan ketersediaan stok." },
  { key: "reports_shifts", name: "Laporan Shift", description: "Melihat laporan aktivitas shift." },
  { key: "settings_general", name: "Pengaturan Umum", description: "Mengelola info perusahaan, logo, dll." },
  { key: "settings_struk", name: "Pengaturan Struk", description: "Mengelola tampilan dan koneksi printer struk." },
  { key: "settings_users", name: "Manajemen Pengguna", description: "Mengelola akun pengguna sistem." },
  { key: "settings_roles", name: "Manajemen Peran", description: "Mengelola peran dan hak akses pengguna." },
  { key: "settings_outlets", name: "Manajemen Outlet", description: "Mengelola data outlet/cabang." },
  { key: "settings_operating_hours", name: "Jam Operasional", description: "Mengatur jam buka-tutup outlet." },
];

export type PermissionAction = "create" | "read" | "update" | "delete";
export const permissionActions: PermissionAction[] = ["create", "read", "update", "delete"];

export const permissionLabels: Record<PermissionAction, string> = {
  create: "Buat",
  read: "Lihat",
  update: "Ubah",
  delete: "Hapus",
};

