
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
  url: "https://tokolite.example.com", 
  ogImage: "https://tokolite.example.com/og.jpg", 
  links: {
    twitter: "https://twitter.com/example",
    github: "https://github.com/example/tokolite",
  },
  mainNav: [
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
      title: "Manajemen Produk", // Changed title for clarity
      href: `${dashboardBaseUrl}/products`, // Main link to product list
      icon: Package,
      description: "Kelola daftar produk, kategori, dan bahan baku.",
      items: [ // Sub-items for better organization
        { title: "Daftar Produk", href: `${dashboardBaseUrl}/products`, icon: Package, description: "Lihat semua produk." },
        { title: "Tambah Produk", href: `${dashboardBaseUrl}/products/add`, icon: PlusCircle, description: "Buat produk baru." },
        { title: "Kategori Produk", href: `${dashboardBaseUrl}/categories`, icon: ListTree, description: "Kelola kategori produk." },
        { title: "Bahan Baku", href: `${dashboardBaseUrl}/raw-materials`, icon: Archive, description: "Kelola stok bahan baku." },
        { title: "Satuan Barang", href: `${dashboardBaseUrl}/units`, icon: Tags, description: "Kelola satuan barang." },
      ]
    },
    // The individual items Kategori, Bahan Baku, Satuan Barang are now under "Manajemen Produk"
    // {
    //   title: "Kategori",
    //   href: `${dashboardBaseUrl}/categories`,
    //   icon: ListTree,
    //   description: "Kelola kategori produk.",
    // },
    // {
    //   title: "Bahan Baku",
    //   href: `${dashboardBaseUrl}/raw-materials`,
    //   icon: Archive,
    //   description: "Kelola stok bahan baku.",
    // },
     {
      title: "Pembelanjaan",
      href: `${dashboardBaseUrl}/purchases`,
      icon: Truck, // Icon for purchases
      description: "Catat dan kelola pembelanjaan bahan baku.",
    },
    // {
    //   title: "Satuan Barang",
    //   href: `${dashboardBaseUrl}/units`,
    //   icon: Tags,
    //   description: "Kelola satuan barang.",
    // },
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

// Helper type for SidebarNavItem with PlusCircle icon for "Tambah" items
import { PlusCircle } from 'lucide-react'; 
export type AddItemSidebarNavItem = SidebarNavItem & { icon: typeof PlusCircle };

