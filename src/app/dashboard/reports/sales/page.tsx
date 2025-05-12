
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Input } from "@/components/ui/input"; // Not used directly if DatePickerWithRange is used
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Download } from "lucide-react";
import { Label } from "@/components/ui/label"; // Import Label component

// Mock Data
const mockSalesData = [
  { id: "S001", outlet: "Outlet Pusat", timestamp: "2024-07-21 10:30", user: "Kasir Ana", productName: "Kopi Susu Aren", price: 18000, quantity: 2, total: 36000 },
  { id: "S002", outlet: "Outlet Cabang A", timestamp: "2024-07-21 11:15", user: "Kasir Budi", productName: "Croissant Coklat", price: 22000, quantity: 1, total: 22000 },
  { id: "S003", outlet: "Outlet Pusat", timestamp: "2024-07-20 14:00", user: "Kasir Ana", productName: "Teh Melati", price: 15000, quantity: 3, total: 45000 },
];


export default function SalesReportPage() {
  return (
    <div>
      <PageHeader title="Laporan Penjualan" description="Analisis detail penjualan Anda.">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Unduh Laporan
        </Button>
      </PageHeader>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="date-range">Rentang Tanggal</Label>
            <DatePickerWithRange className="mt-1" />
          </div>
          <div>
            <Label htmlFor="user-filter">Pengguna (Kasir)</Label>
            <Select>
              <SelectTrigger id="user-filter" className="mt-1">
                <SelectValue placeholder="Semua Pengguna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pengguna</SelectItem>
                <SelectItem value="ana">Kasir Ana</SelectItem>
                <SelectItem value="budi">Kasir Budi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="outlet-filter">Outlet</Label>
            <Select>
              <SelectTrigger id="outlet-filter" className="mt-1">
                <SelectValue placeholder="Semua Outlet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Outlet</SelectItem>
                <SelectItem value="pusat">Outlet Pusat</SelectItem>
                <SelectItem value="cabang_a">Outlet Cabang A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detail Penjualan</CardTitle>
          <CardDescription>Menampilkan {mockSalesData.length} transaksi.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Outlet</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Pengguna (Kasir)</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockSalesData.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.outlet}</TableCell>
                  <TableCell>{new Date(sale.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</TableCell>
                  <TableCell>{sale.user}</TableCell>
                  <TableCell className="font-medium">{sale.productName}</TableCell>
                  <TableCell className="text-right">Rp {sale.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right">{sale.quantity}</TableCell>
                  <TableCell className="text-right">Rp {sale.total.toLocaleString('id-ID')}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-bold">
                <TableCell colSpan={6} className="text-right">Total Keseluruhan</TableCell>
                <TableCell className="text-right">Rp {mockSalesData.reduce((sum, item) => sum + item.total, 0).toLocaleString('id-ID')}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
