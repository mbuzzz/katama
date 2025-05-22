
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Purchase } from "@/types/purchase";
import { getMockPurchases, deleteMockPurchase } from "@/data/purchases";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function PurchasesPage() {
  const [purchases, setPurchases] = React.useState<Purchase[]>([]);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = React.useState<Purchase | null>(null);


  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (activeCompanyId) {
      setPurchases(getMockPurchases(activeCompanyId));
    } else {
      setPurchases([]); 
    }
  }, [activeCompanyId]);


  const handleDeletePurchase = () => {
    if (!purchaseToDelete || !activeCompanyId) return;
    
    const success = deleteMockPurchase(purchaseToDelete.id, activeCompanyId);
    if (success) {
      setPurchases(prev => prev.filter(p => p.id !== purchaseToDelete.id));
      toast({ title: "Pembelian Dihapus", description: `Pembelanjaan untuk ${purchaseToDelete.itemName} telah dihapus.` });
    } else {
      toast({ title: "Gagal Menghapus", description: "Terjadi kesalahan saat menghapus pembelanjaan.", variant: "destructive" });
    }
    setShowDeleteDialog(false);
    setPurchaseToDelete(null);
    router.refresh();
  };

  const openDeleteDialog = (purchase: Purchase) => {
    setPurchaseToDelete(purchase);
    setShowDeleteDialog(true);
  };


  return (
    <div>
      <PageHeader title="Pembelanjaan" description="Catat dan kelola pembelanjaan barang untuk perusahaan yang aktif.">
        <Button asChild className="w-full sm:w-auto" disabled={!activeCompanyId}>
          <Link href="/dashboard/purchases/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pembelanjaan
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
                <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead className="hidden sm:table-cell">Outlet</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="hidden md:table-cell">Satuan</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Harga Satuan</TableHead>
                <TableHead className="text-right">Total Harga</TableHead>
                <TableHead className="hidden lg:table-cell">Pemasok</TableHead>
                <TableHead className="hidden xl:table-cell">Dicatat Oleh</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-10">Memuat data...</TableCell>
                </TableRow>
              )}
              {!isLoading && !activeCompanyId && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
                    Pilih perusahaan terlebih dahulu untuk melihat data pembelanjaan.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && activeCompanyId && purchases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
                    Belum ada data pembelanjaan untuk perusahaan ini.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && activeCompanyId && purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="hidden md:table-cell">{format(new Date(purchase.timestamp), "dd MMM yyyy, HH:mm", { locale: idLocale })}</TableCell>
                  <TableCell className="font-medium max-w-[150px] sm:max-w-xs truncate">{purchase.itemName}</TableCell>
                  <TableCell className="hidden sm:table-cell max-w-[100px] truncate">{purchase.outlet}</TableCell>
                  <TableCell className="text-right">{purchase.quantity.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="hidden md:table-cell">{purchase.unit}</TableCell>
                  <TableCell className="text-right hidden lg:table-cell">Rp {purchase.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right">Rp {purchase.total.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="hidden lg:table-cell max-w-[100px] truncate">{purchase.supplier || "-"}</TableCell>
                  <TableCell className="hidden xl:table-cell">{purchase.userName}</TableCell>
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
                        <DropdownMenuItem disabled> {/* Edit Purchase needs its own form and page */}
                            <Edit className="mr-2 h-4 w-4" /> Edit (Segera Hadir)
                        </DropdownMenuItem> 
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => openDeleteDialog(purchase)}
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

       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin ingin menghapus pembelanjaan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Data pembelanjaan untuk "{purchaseToDelete?.itemName}" akan dihapus secara permanen dan stok bahan baku terkait akan dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPurchaseToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePurchase} className="bg-destructive hover:bg-destructive/90">
              Ya, Hapus Pembelanjaan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    