import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { DollarSign, Receipt, PercentCircle, ArrowRight } from "lucide-react";

const reportLinks = [
  { title: "Laporan Penjualan", description: "Analisis detail penjualan Anda.", href: "/dashboard/reports/sales", icon: DollarSign },
  { title: "Laporan Pembelanjaan", description: "Lacak semua pembelanjaan barang.", href: "/dashboard/reports/purchases", icon: Receipt },
  { title: "Laporan Stok", description: "Monitor ketersediaan stok barang.", href: "/dashboard/reports/stock", icon: PercentCircle },
];

export default function ReportsPage() {
  return (
    <div>
      <PageHeader title="Laporan" description="Lihat dan analisis data bisnis Anda." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportLinks.map((link) => (
          <Link href={link.href} key={link.title} legacyBehavior>
            <a className="block hover:no-underline">
              <Card className="shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">{link.title}</CardTitle>
                  <link.icon className="h-6 w-6 text-muted-foreground" />
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </CardContent>
                <CardContent className="pt-0">
                   <div className="text-sm font-medium text-primary flex items-center">
                    Lihat Laporan <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}
