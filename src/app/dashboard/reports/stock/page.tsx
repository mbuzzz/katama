import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock Data
const mockStockData = [
  { id: "1", itemName: "Biji Kopi Arabika", category: "Bahan Baku", quantity: 45, unit: "kg", status: "In Stock" },
  { id: "2", itemName: "Susu UHT Full Cream", category: "Bahan Baku", quantity: 12, unit: "karton", status: "Low Stock" },
  { id: "3", itemName: "Gula Aren Cair", category: "Bahan Baku", quantity: 80, unit: "liter", status: "In Stock" },
  { id: "4", itemName: "Croissant Coklat (Frozen)", category: "Produk Jadi", quantity: 5, unit: "pcs", status: "Out of Stock" },
  { id: "5", itemName: "Cup Plastik 16oz", category: "Perlengkapan", quantity: 500, unit: "pcs", status: "In Stock" },
];

export default function StockReportPage() {
  return (
    <div>
      <PageHeader title="Laporan Stok" description="Monitor ketersediaan stok barang.">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Unduh Laporan
        </Button>
      </PageHeader>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle>Filter Stok</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Cari nama barang..." className="pl-8" />
          </div>
          {/* Add more filters like category or status if needed */}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detail Stok Barang</CardTitle>
          <CardDescription>Menampilkan {mockStockData.length} item stok.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStockData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.itemName}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.status === "In Stock" ? "default" :
                        item.status === "Low Stock" ? "secondary" : // Using secondary for yellow-ish, or create custom variant
                        "destructive" // For Out of Stock
                      }
                      className={
                        item.status === "Low Stock" ? "bg-yellow-500/20 text-yellow-700 border-yellow-500/50" : ""
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
