
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
      description: "Gambaran umum sistem.", // Updated description
    },
    // Menu Superadmin - Administrasi Sistem
    {
      title: "Administrasi Sistem",
      href: `${dashboardBaseUrl}/admin/companies`, 
      icon: Briefcase,
      description: "Pengelolaan sistem tingkat lanjut.",
      items: [
        { title: "Manajemen Perusahaan", href: `${dashboardBaseUrl}/admin/companies`, icon: Building2, description: "Kelola daftar perusahaan dalam sistem." },
        // Future Superadmin items: Global Settings, System Logs, Subscription Management etc.
      ]
    },
    /* Operational menus hidden for Superadmin view
    {
      title: "Point of Sale",
      href: `${dashboardBaseUrl}/pos`,
      icon: ShoppingCart,
      description: "Proses penjualan dan transaksi.",
    },
    {
      title: "Manajemen Shift",
      href: `${dashboardBaseUrl}/shifts`,
      icon: Clock,
      description: "Kelola sesi kerja kasir dan outlet.",
      items: [
        { title: "Daftar Shift", href: `${dashboardBaseUrl}/shifts`, icon: ListTree, description: "Lihat semua shift." },
        { title: "Mulai Shift Baru", href: `${dashboardBaseUrl}/shifts/add`, icon: PlusCircle, description: "Mulai sesi shift baru." },
      ]
    },
    {
      title: "Manajemen Produk", 
      href: `${dashboardBaseUrl}/products`, 
      icon: Package,
      description: "Kelola daftar produk, kategori, dan bahan baku.",
      items: [ 
        { title: "Daftar Produk", href: `${dashboardBaseUrl}/products`, icon: Package, description: "Lihat semua produk." },
        { title: "Tambah Produk", href: `${dashboardBaseUrl}/products/add`, icon: PlusCircle, description: "Buat produk baru." },
        { title: "Kategori Produk", href: `${dashboardBaseUrl}/categories`, icon: ListTree, description: "Kelola kategori produk." },
        { title: "Bahan Baku", href: `${dashboardBaseUrl}/raw-materials`, icon: Archive, description: "Kelola stok bahan baku." },
        { 
          title: "Satuan Barang", 
          href: `${dashboardBaseUrl}/units`, 
          icon: Tags, 
          description: "Kelola satuan barang.",
        },
      ]
    },
     {
      title: "Pembelanjaan",
      href: `${dashboardBaseUrl}/purchases`,
      icon: Truck, 
      description: "Catat dan kelola pembelanjaan bahan baku.",
    },
    {
      title: "Laporan",
      href: `${dashboardBaseUrl}/reports`,
      icon: BarChart3,
      description: "Lihat laporan penjualan, stok, dll.",
      items: [
        { title: "Penjualan", href: `${dashboardBaseUrl}/reports/sales`, icon: DollarSign, description: "Laporan penjualan." },
        { title: "Pembelanjaan", href: `${dashboardBaseUrl}/reports/purchases`, icon: Receipt, description: "Laporan pembelanjaan." },
        { title: "Stok", href: `${dashboardBaseUrl}/reports/stock`, icon: PercentCircle, description: "Laporan stok barang." },
        { title: "Shift", href: `${dashboardBaseUrl}/reports/shifts`, icon: UserCheck, description: "Laporan aktivitas shift pengguna." },
      ],
    },
    */
    {
      title: "Pengaturan",
      href: `${dashboardBaseUrl}/settings`,
      icon: SettingsIcon,
      description: "Konfigurasi sistem dan default.", // Updated description
      items: [
        // These settings might need to be adapted or made global for Superadmin
        { title: "Umum (Perusahaan Aktif)", href: `${dashboardBaseUrl}/settings/general`, icon: Building2, description: "Pengaturan umum perusahaan yang dipilih." },
        { title: "Struk (Perusahaan Aktif)", href: `${dashboardBaseUrl}/settings/struk`, icon: FileCog, description: "Pengaturan struk belanja perusahaan yang dipilih." },
        { title: "Pengguna (Perusahaan Aktif)", href: `${dashboardBaseUrl}/settings/users`, icon: UserCog, description: "Kelola pengguna perusahaan yang dipilih." },
        { title: "Peran (Global/Template)", href: `${dashboardBaseUrl}/settings/roles`, icon: ShieldCheck, description: "Kelola peran pengguna (global atau template)." },
        { title: "Outlet (Perusahaan Aktif)", href: `${dashboardBaseUrl}/settings/outlets`, icon: Store, description: "Kelola outlet perusahaan yang dipilih." },
        { title: "Jam Operasional (Perusahaan Aktif)", href: `${dashboardBaseUrl}/settings/operating-hours`, icon: CalendarClock, description: "Atur jam buka outlet perusahaan yang dipilih." },
      ]
    },
  ],
};

export type AddItemSidebarNavItem = SidebarNavItem & { icon: typeof PlusCircle };
