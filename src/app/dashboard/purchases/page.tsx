
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Purchase } from "@/types/purchase"; // Import the Purchase type
import { getMockPurchases } from "@/data/purchases"; // Import from data/purchases.ts
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function PurchasesPage() {
  const [purchases, setPurchases] = React.useState<Purchase[]>([]);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const router = useRouter();


  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (activeCompanyId) {
      setPurchases(getMockPurchases(activeCompanyId));
    } else {
      setPurchases([]); // Clear purchases if no company is selected
    }
  }, [activeCompanyId]);


  // Placeholder for delete functionality - needs full implementation with dialog
  const handleDeletePurchase = (purchaseId: string) => {
    if (!activeCompanyId) return;
    // const success = deleteMockPurchase(purchaseId, activeCompanyId);
    // if (success) {
    //   setPurchases(prev => prev.filter(p => p.id !== purchaseId));
    //   toast({ title: "Pembelian Dihapus" });
    // } else {
    //   toast({ title: "Gagal Menghapus", variant: "destructive" });
    // }
    toast({ title: "Fitur Hapus Belum Tersedia", description: "Penghapusan pembelian sedang dalam pengembangan.", variant: "default" });
  };


  return (
    <div>
      <PageHeader title="Pembelanjaan" description="Catat dan kelola pembelanjaan barang untuk perusahaan yang aktif.">
        <Button asChild disabled> {/* Tambah Pembelian akan diarahkan ke form, saat ini disabled */}
          <Link href="/dashboard/purchases/add">
            <span>
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pembelanjaan (Segera Hadir)
            </span>
          </Link>
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Pembelanjaan</CardTitle>
          <CardDescription>Total {purchases.length} transaksi pembelanjaan ditemukan {activeCompanyId ? 'untuk perusahaan ini' : ''}.</CardDescription>
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
                <TableHead className="hidden md:table-cell">Pengguna</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-10">Memuat data...</TableCell>
                </TableRow>
              )}
              {!isLoading && !activeCompanyId && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-10">
                    Pilih perusahaan terlebih dahulu untuk melihat data pembelanjaan.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && activeCompanyId && purchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-10">
                    Belum ada data pembelanjaan untuk perusahaan ini.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && activeCompanyId && purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{new Date(purchase.timestamp).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                  <TableCell className="font-medium">{purchase.itemName}</TableCell>
                  <TableCell className="text-right">{purchase.quantity.toLocaleString('id-ID')}</TableCell>
                  <TableCell>{purchase.unit}</TableCell>
                  <TableCell className="text-right hidden md:table-cell">Rp {purchase.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right">Rp {purchase.total.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="hidden md:table-cell">{purchase.supplier || "-"}</TableCell>
                  <TableCell className="hidden md:table-cell">{purchase.user}</TableCell>
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
                        <DropdownMenuItem 
                          disabled 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => handleDeletePurchase(purchase.id)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
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
