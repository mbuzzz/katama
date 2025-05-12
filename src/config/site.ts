
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
  ListTree, // Added for Kategori
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
  description: "Point of Sale application for small businesses, designed with a warm and inviting feel.",
  url: "https://tokolite.example.com", // Replace with actual URL
  ogImage: "https://tokolite.example.com/og.jpg", // Replace with actual OG image
  links: {
    twitter: "https://twitter.com/example",
    github: "https://github.com/example/tokolite",
  },
  mainNav: [
    // Main navigation can be added here if needed for a marketing site part
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: `${dashboardBaseUrl}`,
      icon: LayoutDashboard,
      description: "Overview of your business.",
    },
    {
      title: "Point of Sale",
      href: `${dashboardBaseUrl}/pos`,
      icon: ShoppingCart,
      description: "Process sales and transactions.",
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
        { title: "General", href: `${dashboardBaseUrl}/settings/general`, icon: Building2, description: "Pengaturan umum perusahaan." },
        { title: "Struk", href: `${dashboardBaseUrl}/settings/struk`, icon: FileCog, description: "Pengaturan struk belanja." },
        { title: "Users", href: `${dashboardBaseUrl}/settings/users`, icon: UserCog, description: "Kelola pengguna." },
        { title: "Roles", href: `${dashboardBaseUrl}/settings/roles`, icon: ShieldCheck, description: "Kelola peran pengguna." },
        { title: "Outlets", href: `${dashboardBaseUrl}/settings/outlets`, icon: Store, description: "Kelola outlet." },
      ]
    },
  ],
};
