
"use client"; // Ditambahkan untuk menjadikan ini Client Component

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, ShoppingCart, Package } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const salesDataForChart = [
  { day: "Sen", total: 420500 },
  { day: "Sel", total: 350200 },
  { day: "Rab", total: 580750 },
  { day: "Kam", total: 290300 },
  { day: "Jum", total: 610100 },
  { day: "Sab", total: 780900 },
  { day: "Min", total: 450600 },
];

const chartConfig = {
  total: {
    label: "Penjualan (Rp)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const stats = [
    { title: "Total Pendapatan (Mingguan)", value: `Rp ${salesDataForChart.reduce((acc, curr) => acc + curr.total, 0).toLocaleString('id-ID')}`, icon: DollarSign, change: "Data 7 hari terakhir" },
    { title: "Pelanggan Baru (Hari Ini)", value: "12", icon: Users, change: "+5 vs kemarin" },
    { title: "Total Pesanan (Hari Ini)", value: "85", icon: ShoppingCart, change: "+10 vs kemarin" },
    { title: "Produk Tersedia", value: "2.300", icon: Package, change: "Stok terkini" },
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
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Penjualan Mingguan</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart
                accessibilityLayer
                data={salesDataForChart}
                margin={{
                  top: 5,
                  right: 5,
                  left: -20, // Adjusted for Y-axis labels
                  bottom: 5,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `Rp${Number(value) / 1000}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent 
                              indicator="dot" 
                              formatter={(value, name) => (
                                <>
                                  <div className="font-medium">{chartConfig[name as keyof typeof chartConfig]?.label || name}</div>
                                  <div>Rp {Number(value).toLocaleString('id-ID')}</div>
                                </>
                              )}
                            />}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Produk Terlaris (Mingguan)</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Placeholder for product list - can be enhanced similarly */}
            <ul className="space-y-3 pt-2">
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src="https://placehold.co/40x40.png" alt="Kopi Susu Aren" data-ai-hint="coffee product" className="w-10 h-10 rounded-md mr-3 object-cover"/>
                  <div>
                    <p className="font-medium">Kopi Susu Aren</p>
                    <p className="text-xs text-muted-foreground">Minuman Dingin</p>
                  </div>
                </div>
                <span className="font-semibold">120 Terjual</span>
              </li>
              <li className="flex justify-between items-center">
                 <div className="flex items-center">
                  <img src="https://placehold.co/40x40.png" alt="Croissant Coklat" data-ai-hint="pastry product" className="w-10 h-10 rounded-md mr-3 object-cover"/>
                  <div>
                    <p className="font-medium">Croissant Coklat</p>
                    <p className="text-xs text-muted-foreground">Roti & Pastri</p>
                  </div>
                </div>
                <span className="font-semibold">95 Terjual</span>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <img src="https://placehold.co/40x40.png" alt="Kentang Goreng" data-ai-hint="snack product" className="w-10 h-10 rounded-md mr-3 object-cover"/>
                  <div>
                    <p className="font-medium">Kentang Goreng</p>
                    <p className="text-xs text-muted-foreground">Makanan Ringan</p>
                  </div>
                </div>
                <span className="font-semibold">80 Terjual</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

