
"use client"; // For useState, useEffect, and event handlers for delete dialog

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
import { getMockProducts, deleteMockProduct } from "@/data/products"; // Use new data source
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<Product | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    setProducts(getMockProducts());
  }, []);

  const handleDeleteProduct = () => {
    if (!productToDelete) return;

    const success = deleteMockProduct(productToDelete.id);
    if (success) {
      setProducts(products.filter(prod => prod.id !== productToDelete.id));
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
    router.refresh(); // To reflect changes
  };

  const openDeleteDialog = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  return (
    <div>
      <PageHeader title="Produk" description="Kelola daftar produk Anda.">
        <Button asChild>
          <Link href="/dashboard/products/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk
          </Link>
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>Total {products.length} produk ditemukan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Gambar</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="hidden md:table-cell">HPP</TableHead>
                <TableHead>Harga Jual</TableHead>
                <TableHead className="hidden md:table-cell">Margin</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    Belum ada produk yang ditambahkan.
                  </TableCell>
                </TableRow>
              )}
              {products.map((product) => {
                const margin = product.price - (product.hpp || 0);
                return (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="40"
                        src={product.image || "https://picsum.photos/40/40?random=placeholder"}
                        width="40"
                        data-ai-hint={`${product.category} produk`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">Rp {(product.hpp || 0).toLocaleString('id-ID')}</TableCell>
                    <TableCell>Rp {product.price.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="hidden md:table-cell">Rp {margin.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{product.stock.toLocaleString('id-ID')}</TableCell>
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
