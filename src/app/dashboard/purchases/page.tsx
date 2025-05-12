
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
  { id: "1", rawMaterialId: "rm1", itemName: "Biji Kopi Arabika", quantity: 10, unit: "kg", unitPrice: 150000, totalPrice: 1500000, date: "2024-07-20", supplier: "Supplier Kopi Jaya" },
  { id: "2", rawMaterialId: "rm2", itemName: "Susu UHT Full Cream", quantity: 5, unit: "karton", unitPrice: 80000, totalPrice: 400000, date: "2024-07-19", supplier: "Distributor Susu Segar" },
  { id: "3", rawMaterialId: "rm3", itemName: "Gula Aren Cair", quantity: 20, unit: "liter", unitPrice: 25000, totalPrice: 500000, date: "2024-07-18", supplier: "Produsen Gula Aren" },
];

// Placeholder for future server action to add purchase and update stock
// async function handleAddPurchase(data: any) {
//   "use server";
//   // 1. Add purchase record to a new mockPurchasesStore
//   // 2. Identify the rawMaterialId from the purchased item
//   // 3. Call updateRawMaterialStock(rawMaterialId, purchasedQuantity) from "@/data/raw-materials"
//   // 4. Toast and redirect/refresh
//   console.log("Menambahkan pembelian:", data);
// }

export default function PurchasesPage() {
  // In a real app, would fetch purchases and integrate with a form to add new ones
  // which would then call updateRawMaterialStock.

  return (
    <div>
      <PageHeader title="Pembelanjaan" description="Catat dan kelola pembelanjaan barang.">
        <Button disabled> {/* Replace with Link to /dashboard/purchases/add when form is created */}
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pembelanjaan (Segera Hadir)
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
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead className="text-right hidden md:table-cell">Harga Satuan</TableHead>
                <TableHead className="text-right">Total Harga</TableHead>
                <TableHead className="hidden md:table-cell">Pemasok</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{new Date(purchase.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                  <TableCell className="font-medium">{purchase.itemName}</TableCell>
                  <TableCell className="text-right">{purchase.quantity.toLocaleString('id-ID')}</TableCell>
                  <TableCell>{purchase.unit}</TableCell>
                  <TableCell className="text-right hidden md:table-cell">Rp {purchase.unitPrice.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right">Rp {purchase.totalPrice.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="hidden md:table-cell">{purchase.supplier}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Alihkan menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                        <DropdownMenuItem disabled><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem disabled className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" /> Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
               {mockPurchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    Belum ada data pembelanjaan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
