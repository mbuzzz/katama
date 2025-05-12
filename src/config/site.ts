
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
  Archive, // Added for Bahan Baku (Raw Materials)
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
  name: "TokoLite POS",
  description: "Aplikasi Point of Sale untuk usaha kecil dan menengah, dirancang dengan nuansa hangat dan mengundang.",
  url: "https://tokolite.example.com", // Ganti dengan URL sebenarnya
  ogImage: "https://tokolite.example.com/og.jpg", // Ganti dengan gambar OG sebenarnya
  links: {
    twitter: "https://twitter.com/example",
    github: "https://github.com/example/tokolite",
  },
  mainNav: [
    // Navigasi utama dapat ditambahkan di sini jika diperlukan untuk bagian situs pemasaran
  ],
  sidebarNav: [
    {
      title: "Dasbor",
      href: `${dashboardBaseUrl}`,
      icon: LayoutDashboard,
      description: "Gambaran umum bisnis Anda.",
    },
    {
      title: "Point of Sale",
      href: `${dashboardBaseUrl}/pos`,
      icon: ShoppingCart,
      description: "Proses penjualan dan transaksi.",
    },
    {
      title: "Produk",
      href: `${dashboardBaseUrl}/products`,
      icon: Package,
      description: "Kelola daftar produk Anda.",
    },
    {
      title: "Kategori",
      href: `${dashboardBaseUrl}/categories`,
      icon: ListTree,
      description: "Kelola kategori produk.",
    },
    {
      title: "Bahan Baku",
      href: `${dashboardBaseUrl}/raw-materials`,
      icon: Archive,
      description: "Kelola stok bahan baku.",
    },
    {
      title: "Pembelanjaan",
      href: `${dashboardBaseUrl}/purchases`,
      icon: Truck,
      description: "Catat dan kelola pembelanjaan.",
    },
    {
      title: "Satuan Barang",
      href: `${dashboardBaseUrl}/units`,
      icon: Tags,
      description: "Kelola satuan barang.",
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
      ],
    },
    {
      title: "Pengaturan",
      href: `${dashboardBaseUrl}/settings`,
      icon: SettingsIcon,
      description: "Konfigurasi aplikasi dan outlet.",
      items: [
        { title: "Umum", href: `${dashboardBaseUrl}/settings/general`, icon: Building2, description: "Pengaturan umum perusahaan." },
        { title: "Struk", href: `${dashboardBaseUrl}/settings/struk`, icon: FileCog, description: "Pengaturan struk belanja." },
        { title: "Pengguna", href: `${dashboardBaseUrl}/settings/users`, icon: UserCog, description: "Kelola pengguna." },
        { title: "Peran", href: `${dashboardBaseUrl}/settings/roles`, icon: ShieldCheck, description: "Kelola peran pengguna." },
        { title: "Outlet", href: `${dashboardBaseUrl}/settings/outlets`, icon: Store, description: "Kelola outlet." },
      ]
    },
  ],
};
