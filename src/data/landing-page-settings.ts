
import type { LandingPageSettings } from '@/types/landing-page';

let mockLandingPageSettingsStore: LandingPageSettings = {
  hero: {
    title: "Selamat Datang di KATAMA POS",
    description: "Solusi Point of Sale modern, intuitif, dan serbaguna untuk mengelola dan mengembangkan bisnis Anda dengan mudah dan efisien.",
    ctaButton1Text: "Mulai Sekarang",
    ctaButton1Link: "/login",
    ctaButton2Text: "Pelajari Lebih Lanjut",
    ctaButton2Link: "#fitur",
  },
  featuresSectionTitle: "Fitur Unggulan KATAMA POS",
  features: [
    { iconName: "ShoppingCart", title: "Point of Sale Intuitif", description: "Proses transaksi cepat dan mudah dengan antarmuka ramah pengguna." },
    { iconName: "Package", title: "Manajemen Produk & Stok", description: "Kelola produk, kategori, bahan baku, dan pantau stok secara real-time." },
    { iconName: "BarChart3", title: "Laporan Lengkap", description: "Analisis penjualan, pembelanjaan, dan stok dengan laporan rinci." },
    { iconName: "Users", title: "Manajemen Pengguna & Peran", description: "Atur hak akses untuk setiap pengguna dengan sistem peran yang fleksibel." },
    { iconName: "Settings", title: "Pengaturan Fleksibel", description: "Kustomisasi pengaturan umum, struk, outlet, dan jam operasional." },
    { iconName: "Briefcase", title: "Multi-Outlet Ready", description: "Kelola beberapa cabang bisnis dari satu dasbor terpusat (Dukungan SaaS)." },
  ],
  pricingSectionTitle: "Paket Harga Fleksibel",
  pricingPlans: [
    {
      name: "Dasar",
      price: "Rp 99rb",
      priceSuffix: "/bulan",
      features: ["✓ 1 Outlet", "✓ Transaksi Tanpa Batas", "✓ Manajemen Produk Dasar", "✓ Laporan Penjualan"],
      ctaButtonText: "Pilih Paket Dasar",
    },
    {
      name: "Profesional",
      price: "Rp 199rb",
      priceSuffix: "/bulan",
      features: ["✓ Hingga 3 Outlet", "✓ Semua Fitur Paket Dasar", "✓ Manajemen Stok Bahan Baku", "✓ Laporan Lanjutan", "✓ Manajemen Shift"],
      ctaButtonText: "Pilih Paket Profesional",
      isPopular: true,
    },
    {
      name: "Enterprise",
      price: "Hubungi Kami",
      priceSuffix: "",
      features: ["✓ Outlet Tanpa Batas", "✓ Semua Fitur Paket Profesional", "✓ Fitur Kustom", "✓ Dukungan Prioritas"],
      ctaButtonText: "Hubungi Sales",
    },
  ],
  footerTextLine1: `© ${new Date().getFullYear()} KATAMA POS. Hak Cipta Dilindungi.`,
  footerTextLine2: "Dirancang dengan ❤️ untuk bisnis Anda.",
  creatorCredit: "Created by Tumbu Studio", // Added creator credit
};

export const getMockLandingPageSettings = (): LandingPageSettings => {
  return { ...mockLandingPageSettingsStore };
};

// Placeholder untuk fungsi update, akan memerlukan UI di sisi admin nanti
export const updateMockLandingPageSettings = (newSettings: Partial<LandingPageSettings>): LandingPageSettings => {
  mockLandingPageSettingsStore = {
    ...mockLandingPageSettingsStore,
    ...newSettings,
    hero: { ...mockLandingPageSettingsStore.hero, ...newSettings.hero },
    // deep merge untuk arrays jika diperlukan, atau replace
    features: newSettings.features || mockLandingPageSettingsStore.features,
    pricingPlans: newSettings.pricingPlans || mockLandingPageSettingsStore.pricingPlans,
  };
  return { ...mockLandingPageSettingsStore };
};
