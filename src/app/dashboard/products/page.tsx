
"use client"; 

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
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
import type { Product } from "@/types/product";
import { getMockProducts, deleteMockProduct } from "@/data/products"; 
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
  }, []);

  React.useEffect(() => {
    if (activeCompanyId) {
      setProducts(getMockProducts(activeCompanyId));
    } else {
      setProducts([]);
    }
  }, [activeCompanyId]);

  const handleDeleteProduct = () => {
    if (!productToDelete || !activeCompanyId) return;

    const success = deleteMockProduct(productToDelete.id, activeCompanyId);
    if (success) {
      setProducts(prevProducts => prevProducts.filter(prod => prod.id !== productToDelete.id));
      toast({
        title: "Produk Dihapus",
        description: `Produk "${productToDelete.name}" telah berhasil dihapus.`,
      });
    } else {
      toast({
        title: "Gagal Menghapus",
        description: "Terjadi kesalahan saat menghapus produk.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setProductToDelete(null);
    router.refresh(); 
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  return (
    <div>
      <PageHeader title="Produk" description="Kelola daftar produk Anda.">
        <Button asChild className="w-full sm:w-auto" disabled={!activeCompanyId}>
          <Link href="/dashboard/products/add">
             <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk
          </Link>
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>
            Total {products.length} produk ditemukan {activeCompanyId ? `untuk perusahaan ini` : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[64px] sm:table-cell">Gambar</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead className="hidden md:table-cell">Kategori</TableHead>
                <TableHead className="text-right hidden lg:table-cell">HPP</TableHead>
                <TableHead className="text-right">Harga Jual</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Margin</TableHead>
                <TableHead className="text-right">Stok</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!activeCompanyId && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    Pilih perusahaan terlebih dahulu untuk melihat produk.
                  </TableCell>
                </TableRow>
              )}
              {activeCompanyId && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    Belum ada produk yang ditambahkan untuk perusahaan ini.
                  </TableCell>
                </TableRow>
              )}
              {activeCompanyId && products.map((product) => {
                const margin = product.price - (product.hpp || 0);
                return (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="40"
                        src={product.image || "https://placehold.co/40x40.png"}
                        width="40"
                        data-ai-hint={product.dataAiHint || `${product.category} product`}
                      />
                    </TableCell>
                    <TableCell className="font-medium max-w-[150px] truncate">{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" className="truncate max-w-[100px]">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right hidden lg:table-cell">Rp {(product.hpp || 0).toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">Rp {product.price.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right hidden lg:table-cell">Rp {margin.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right">{product.stock.toLocaleString('id-ID')}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Alihkan menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/products/edit/${product.id}`}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onClick={() => openDeleteDialog(product)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin ingin menghapus produk ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Produk "{productToDelete?.name}" akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive hover:bg-destructive/90">
              Ya, Hapus Produk
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    