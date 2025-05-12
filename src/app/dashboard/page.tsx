
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, ShoppingCart, Package } from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { title: "Total Pendapatan", value: "Rp 1.234.500", icon: DollarSign, change: "+2.5%" },
    { title: "Pelanggan Baru", value: "12", icon: Users, change: "+1.2%" },
    { title: "Total Pesanan", value: "85", icon: ShoppingCart, change: "+3.1%" },
    { title: "Produk Tersedia", value: "2.300", icon: Package, change: "-0.5%" },
  ];

  return (
    <div>
      <PageHeader title="Dasbor" description="Selamat datang di KATAMA POS Anda." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change} dari kemarin</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Penjualan Terkini</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Grafik penjualan akan ditampilkan di sini.</p>
            {/* Placeholder for a chart */}
            <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center" data-ai-hint="sales chart">
              Area Grafik
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Produk Terlaris</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Daftar produk terlaris akan ditampilkan di sini.</p>
            {/* Placeholder for product list */}
            <ul className="space-y-2">
              <li className="flex justify-between"><span>Produk A</span><span>Rp 50.000</span></li>
              <li className="flex justify-between"><span>Produk B</span><span>Rp 35.000</span></li>
              <li className="flex justify-between"><span>Produk C</span><span>Rp 20.000</span></li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

