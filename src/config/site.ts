
import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  BarChart3,
  Users,
  Settings as SettingsIcon,
  Store,
  FileText,
  PercentCircle,
  Tags,
  DollarSign,
  Receipt,
  Contact,
  FileCog,
  UserCog,
  ShieldCheck,
  Building2, 
  ListTree, 
  Archive,
  PlusCircle, 
  Clock,
  UserCheck,
  CalendarClock,
  Briefcase,
  Activity, // Added for Admin Overview
} from 'lucide-react';

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
  external?: boolean;
  label?: string;
  description?: string;
};

export type SidebarNavItem = NavItem & {
  items?: NavItem[];
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
  mainNav: NavItem[];
  sidebarNav: SidebarNavItem[];
};

const dashboardBaseUrl = "/dashboard";

export const siteConfig: SiteConfig = {
  name: "KATAMA",
  description: "Aplikasi Point of Sale KATAMA untuk usaha kecil dan menengah, dirancang dengan nuansa hangat dan mengundang.",
  url: "https://katama.example.com", 
  ogImage: "https://katama.example.com/og.jpg", 
  links: {
    twitter: "https://twitter.com/example",
    github: "https://github.com/example/katama",
  },
  mainNav: [
  ],
  sidebarNav: [
    {
      title: "Dasbor",
      href: `${dashboardBaseUrl}`,
      icon: LayoutDashboard,
      description: "Gambaran umum kinerja perusahaan yang aktif.", 
    },
    // Menu Superadmin - Administrasi Sistem
    {
      title: "Administrasi Sistem",
      href: `${dashboardBaseUrl}/admin/overview`, 
      icon: Briefcase,
      description: "Pengelolaan sistem tingkat lanjut (Superadmin).",
      items: [
        { title: "Overview Administrasi", href: `${dashboardBaseUrl}/admin/overview`, icon: Activity, description: "Ringkasan dan statistik sistem." },
        { title: "Manajemen Perusahaan", href: `${dashboardBaseUrl}/admin/companies`, icon: Building2, description: "Kelola daftar perusahaan dalam sistem." },
      ]
    },
    // Menu Operasional untuk Tenant Admin (dan Superadmin jika melihat sebagai tenant)
    {
      title: "Point of Sale",
      href: `${dashboardBaseUrl}/pos`,
      icon: ShoppingCart,
      description: "Proses penjualan dan transaksi untuk perusahaan aktif.",
    },
    {
      title: "Manajemen Shift",
      href: `${dashboardBaseUrl}/shifts`,
      icon: Clock,
      description: "Kelola sesi kerja untuk perusahaan aktif.",
      items: [
        { title: "Daftar Shift", href: `${dashboardBaseUrl}/shifts`, icon: ListTree, description: "Lihat semua shift perusahaan aktif." },
        { title: "Mulai Shift Baru", href: `${dashboardBaseUrl}/shifts/add`, icon: PlusCircle, description: "Mulai sesi shift baru untuk perusahaan aktif." },
      ]
    },
    {
      title: "Manajemen Produk", 
      href: `${dashboardBaseUrl}/products`, 
      icon: Package,
      description: "Kelola produk, kategori, bahan baku, dan satuan untuk perusahaan aktif.",
      items: [ 
        { title: "Daftar Produk", href: `${dashboardBaseUrl}/products`, icon: Package, description: "Lihat semua produk perusahaan aktif." },
        { title: "Tambah Produk", href: `${dashboardBaseUrl}/products/add`, icon: PlusCircle, description: "Buat produk baru untuk perusahaan aktif." },
        { title: "Kategori Produk", href: `${dashboardBaseUrl}/categories`, icon: ListTree, description: "Kelola kategori produk perusahaan aktif." },
        { title: "Bahan Baku", href: `${dashboardBaseUrl}/raw-materials`, icon: Archive, description: "Kelola stok bahan baku perusahaan aktif." },
        { 
          title: "Satuan Barang", 
          href: `${dashboardBaseUrl}/units`, 
          icon: Tags, 
          description: "Kelola satuan barang perusahaan aktif.",
        },
      ]
    },
     {
      title: "Pembelanjaan",
      href: `${dashboardBaseUrl}/purchases`,
      icon: Truck, 
      description: "Catat dan kelola pembelanjaan untuk perusahaan aktif.",
      items: [
        { title: "Daftar Pembelanjaan", href: `${dashboardBaseUrl}/purchases`, icon: ListTree, description: "Lihat semua pembelanjaan perusahaan aktif." },
        { title: "Tambah Pembelanjaan", href: `${dashboardBaseUrl}/purchases/add`, icon: PlusCircle, description: "Catat pembelanjaan baru untuk perusahaan aktif." },
      ]
    },
    {
      title: "Laporan",
      href: `${dashboardBaseUrl}/reports`,
      icon: BarChart3,
      description: "Lihat laporan penjualan, stok, dll. untuk perusahaan aktif.",
      items: [
        { title: "Penjualan", href: `${dashboardBaseUrl}/reports/sales`, icon: DollarSign, description: "Laporan penjualan perusahaan aktif." },
        { title: "Pembelanjaan", href: `${dashboardBaseUrl}/reports/purchases`, icon: Receipt, description: "Laporan pembelanjaan perusahaan aktif." },
        { title: "Stok", href: `${dashboardBaseUrl}/reports/stock`, icon: PercentCircle, description: "Laporan stok barang perusahaan aktif." },
        { title: "Shift", href: `${dashboardBaseUrl}/reports/shifts`, icon: UserCheck, description: "Laporan aktivitas shift perusahaan aktif." },
      ],
    },
    {
      title: "Pengaturan",
      href: `${dashboardBaseUrl}/settings`,
      icon: SettingsIcon,
      description: "Konfigurasi sistem dan data bisnis.", 
      items: [
        { title: "Umum (Perusahaan Aktif)", href: `${dashboardBaseUrl}/settings/general`, icon: Building2, description: "Pengaturan umum perusahaan yang dipilih." },
        { title: "Struk (Perusahaan Aktif)", href: `${dashboardBaseUrl}/settings/struk`, icon: FileCog, description: "Pengaturan struk belanja perusahaan yang dipilih." },
        { title: "Pengguna (Perusahaan Aktif)", href: `${dashboardBaseUrl}/settings/users`, icon: UserCog, description: "Kelola pengguna untuk perusahaan yang aktif." },
        { title: "Template Peran (Global)", href: `${dashboardBaseUrl}/settings/roles`, icon: ShieldCheck, description: "Kelola template peran global untuk sistem (Superadmin)." },
        { title: "Outlet (Perusahaan Aktif)", href: `${dashboardBaseUrl}/settings/outlets`, icon: Store, description: "Kelola outlet perusahaan yang dipilih." },
        { title: "Jam Operasional (Perusahaan Aktif)", href: `${dashboardBaseUrl}/settings/operating-hours`, icon: CalendarClock, description: "Atur jam buka outlet perusahaan yang dipilih." },
      ]
    },
  ],
};

export type AddItemSidebarNavItem = SidebarNavItem & { icon: typeof PlusCircle };
