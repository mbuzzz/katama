
"use client"; // For useState, useEffect, and event handlers

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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Category } from "@/types/category";
import { getMockCategories, deleteMockCategory } from "@/data/categories";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


export default function CategoriesPage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState<Category | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    // In a real app, fetch from API
    setCategories(getMockCategories());
  }, []);

  const handleDeleteCategory = () => {
    if (!categoryToDelete) return;

    const success = deleteMockCategory(categoryToDelete.id);
    if (success) {
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      toast({
        title: "Kategori Dihapus",
        description: `Kategori "${categoryToDelete.name}" telah berhasil dihapus.`,
      });
    } else {
      toast({
        title: "Gagal Menghapus",
        description: "Terjadi kesalahan saat menghapus kategori.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setCategoryToDelete(null);
    router.refresh(); // To reflect changes if data source is external or complex
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setShowDeleteDialog(true);
  };

  return (
    <div>
      <PageHeader title="Kategori Produk" description="Kelola daftar kategori untuk produk Anda.">
        <Button asChild>
          <Link href="/dashboard/categories/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Kategori
          </Link>
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Kategori</CardTitle>
          <CardDescription>Total {categories.length} kategori ditemukan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                    Belum ada kategori yang ditambahkan.
                  </TableCell>
                </TableRow>
              )}
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {category.description || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/categories/edit/${category.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => openDeleteDialog(category)}
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
            <AlertDialogTitle>Anda yakin ingin menghapus kategori ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Kategori "{categoryToDelete?.name}" akan dihapus secara permanen.
              Produk yang menggunakan kategori ini mungkin perlu diperbarui.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCategoryToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive hover:bg-destructive/90">
              Ya, Hapus Kategori
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
