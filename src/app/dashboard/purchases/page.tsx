import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const mockPurchases = [
  { id: "1", itemName: "Biji Kopi Arabika", quantity: 10, unit: "kg", unitPrice: 150000, totalPrice: 1500000, date: "2024-07-20", supplier: "Supplier Kopi Jaya" },
  { id: "2", itemName: "Susu UHT Full Cream", quantity: 5, unit: "karton", unitPrice: 80000, totalPrice: 400000, date: "2024-07-19", supplier: "Distributor Susu Segar" },
  { id: "3", itemName: "Gula Aren Cair", quantity: 20, unit: "liter", unitPrice: 25000, totalPrice: 500000, date: "2024-07-18", supplier: "Produsen Gula Aren" },
];

export default function PurchasesPage() {
  return (
    <div>
      <PageHeader title="Pembelanjaan" description="Catat dan kelola pembelanjaan barang.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pembelanjaan
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Pembelanjaan</CardTitle>
          <CardDescription>Total {mockPurchases.length} transaksi pembelanjaan ditemukan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead className="hidden md:table-cell">Harga Satuan</TableHead>
                <TableHead>Total Harga</TableHead>
                <TableHead className="hidden md:table-cell">Supplier</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell className="font-medium">{purchase.itemName}</TableCell>
                  <TableCell>{purchase.quantity}</TableCell>
                  <TableCell>{purchase.unit}</TableCell>
                  <TableCell className="hidden md:table-cell">Rp {purchase.unitPrice.toLocaleString()}</TableCell>
                  <TableCell>Rp {purchase.totalPrice.toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell">{purchase.supplier}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
