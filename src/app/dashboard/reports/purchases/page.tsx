import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";


// Mock Data
const mockPurchaseReportData = [
  { id: "P001", outlet: "Outlet Pusat", timestamp: "2024-07-20", user: "Admin Toko", itemName: "Biji Kopi Arabika", price: 150000, quantity: 10, unit: "kg", total: 1500000 },
  { id: "P002", outlet: "Outlet Pusat", timestamp: "2024-07-19", user: "Admin Toko", itemName: "Susu UHT Full Cream", price: 80000, quantity: 5, unit: "karton", total: 400000 },
  { id: "P003", outlet: "Outlet Cabang A", timestamp: "2024-07-18", user: "Manajer Cabang", itemName: "Gula Aren Cair", price: 25000, quantity: 20, unit: "liter", total: 500000 },
];

export default function PurchaseReportPage() {
  return (
    <div>
      <PageHeader title="Laporan Pembelanjaan" description="Lacak semua pembelanjaan barang.">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Unduh Laporan
        </Button>
      </PageHeader>
      
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date-range">Rentang Tanggal</Label>
            <DatePickerWithRange className="mt-1" />
          </div>
          <div>
            <Label htmlFor="item-search">Nama Barang</Label>
            <Input id="item-search" type="search" placeholder="Cari nama barang..." className="mt-1" />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detail Pembelanjaan</CardTitle>
          <CardDescription>Menampilkan {mockPurchaseReportData.length} transaksi pembelanjaan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Outlet</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Pengguna</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead className="text-right">Harga Satuan</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead className="text-right">Total Pembelanjaan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPurchaseReportData.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{purchase.outlet}</TableCell>
                  <TableCell>{new Date(purchase.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                  <TableCell>{purchase.user}</TableCell>
                  <TableCell className="font-medium">{purchase.itemName}</TableCell>
                  <TableCell className="text-right">Rp {purchase.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right">{purchase.quantity}</TableCell>
                  <TableCell>{purchase.unit}</TableCell>
                  <TableCell className="text-right">Rp {purchase.total.toLocaleString('id-ID')}</TableCell>
                </TableRow>
              ))}
               <TableRow className="font-bold">
                <TableCell colSpan={7} className="text-right">Total Keseluruhan Pembelanjaan</TableCell>
                <TableCell className="text-right">Rp {mockPurchaseReportData.reduce((sum, item) => sum + item.total, 0).toLocaleString('id-ID')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
