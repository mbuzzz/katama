
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Logo } from "@/components/icons";
import { Package, BarChart3, Settings, Users, ShoppingCartIcon } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen items-center bg-gradient-to-br from-background to-blue-100 dark:to-blue-900/30">
      {/* Header */}
      <header className="w-full py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 bg-background/80 backdrop-blur-md shadow-sm">
        <Logo className="h-10 w-auto" companyName="KATAMA" />
        <nav className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="#fitur">Fitur</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="#harga">Harga</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Masuk</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <Logo className="h-24 w-auto mb-6 md:mb-8 animate-pulse" companyName="KATAMA" />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-primary mb-4 md:mb-6">
          Selamat Datang di KATAMA POS
        </h1>
        <p className="text-lg sm:text-xl text-foreground/80 mb-8 md:mb-10 max-w-3xl">
          Solusi Point of Sale modern, intuitif, dan serbaguna untuk mengelola dan mengembangkan bisnis Anda dengan mudah dan efisien.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link href="/login">Mulai Sekarang</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
            <Link href="#fitur">Pelajari Lebih Lanjut</Link>
          </Button>
        </div>
      </main>

      {/* Features Section */}
      <section id="fitur" className="w-full py-16 px-6 md:px-12 bg-card">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">Fitur Unggulan KATAMA POS</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { icon: <ShoppingCartIcon className="h-10 w-10 text-accent" />, title: "Point of Sale Intuitif", desc: "Proses transaksi cepat dan mudah dengan antarmuka ramah pengguna." },
            { icon: <Package className="h-10 w-10 text-accent" />, title: "Manajemen Produk & Stok", desc: "Kelola produk, kategori, bahan baku, dan pantau stok secara real-time." },
            { icon: <BarChart3 className="h-10 w-10 text-accent" />, title: "Laporan Lengkap", desc: "Analisis penjualan, pembelanjaan, dan stok dengan laporan rinci." },
            { icon: <Users className="h-10 w-10 text-accent" />, title: "Manajemen Pengguna & Peran", desc: "Atur hak akses untuk setiap pengguna dengan sistem peran yang fleksibel." },
            { icon: <Settings className="h-10 w-10 text-accent" />, title: "Pengaturan Fleksibel", desc: "Kustomisasi pengaturan umum, struk, outlet, dan jam operasional." },
            { icon: <Package className="h-10 w-10 text-accent" />, title: "Multi-Outlet Ready (Coming Soon)", desc: "Kelola beberapa cabang bisnis dari satu dasbor terpusat." },
          ].map(item => (
            <div key={item.title} className="p-6 border rounded-lg shadow-md hover:shadow-xl transition-shadow bg-background">
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-center text-foreground">{item.title}</h3>
              <p className="text-muted-foreground text-center text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Pricing Section (Placeholder) */}
      <section id="harga" className="w-full py-16 px-6 md:px-12 bg-secondary/30">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">Paket Harga Fleksibel</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <div className="border p-8 rounded-lg shadow-lg bg-card text-center">
            <h3 className="text-2xl font-semibold mb-4 text-accent">Dasar</h3>
            <p className="text-4xl font-bold mb-2">Rp 99rb<span className="text-lg font-normal text-muted-foreground">/bulan</span></p>
            <ul className="text-left space-y-2 my-6 text-muted-foreground text-sm">
              <li>✓ 1 Outlet</li>
              <li>✓ Transaksi Tanpa Batas</li>
              <li>✓ Manajemen Produk Dasar</li>
              <li>✓ Laporan Penjualan</li>
            </ul>
            <Button size="lg" className="w-full">Pilih Paket Dasar</Button>
          </div>
          {/* Pro Plan */}
          <div className="border-2 border-primary p-8 rounded-lg shadow-2xl bg-card text-center relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold rounded-full">Populer</div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">Profesional</h3>
            <p className="text-4xl font-bold mb-2">Rp 199rb<span className="text-lg font-normal text-muted-foreground">/bulan</span></p>
            <ul className="text-left space-y-2 my-6 text-muted-foreground text-sm">
              <li>✓ Hingga 3 Outlet</li>
              <li>✓ Semua Fitur Paket Dasar</li>
              <li>✓ Manajemen Stok Bahan Baku</li>
              <li>✓ Laporan Lanjutan</li>
              <li>✓ Manajemen Shift</li>
            </ul>
            <Button size="lg" className="w-full">Pilih Paket Profesional</Button>
          </div>
          {/* Enterprise Plan */}
          <div className="border p-8 rounded-lg shadow-lg bg-card text-center">
            <h3 className="text-2xl font-semibold mb-4 text-accent">Enterprise</h3>
            <p className="text-4xl font-bold mb-2">Hubungi Kami</p>
            <ul className="text-left space-y-2 my-6 text-muted-foreground text-sm">
              <li>✓ Outlet Tanpa Batas</li>
              <li>✓ Semua Fitur Paket Profesional</li>
              <li>✓ Fitur Kustom</li>
              <li>✓ Dukungan Prioritas</li>
            </ul>
            <Button variant="outline" size="lg" className="w-full">Hubungi Sales</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 px-6 md:px-12 text-center text-muted-foreground bg-card border-t">
        <p>&copy; {new Date().getFullYear()} KATAMA POS. Hak Cipta Dilindungi.</p>
        <p className="text-xs mt-1">Dirancang dengan ❤️ untuk bisnis Anda.</p>
      </footer>
    </div>
  );
}
