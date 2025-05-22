
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, MoreHorizontal, Store, MapPin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Outlet } from "@/types/outlet"; 
import { getMockOutlets, deleteMockOutlet } from "@/data/outlets"; 
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
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


const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function OutletsPage() {
  const [outlets, setOutlets] = React.useState<Outlet[]>([]);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [outletToDelete, setOutletToDelete] = React.useState<Outlet | null>(null);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    const fetchAndSetOutlets = () => {
      if (activeCompanyId) {
        setOutlets(getMockOutlets(activeCompanyId));
      } else {
        setOutlets([]);
      }
    };
    fetchAndSetOutlets();

    // Listen for custom event
    window.addEventListener('outletListChanged', fetchAndSetOutlets as EventListener);
    return () => {
      window.removeEventListener('outletListChanged', fetchAndSetOutlets as EventListener);
    };
  }, [activeCompanyId]);


  const handleDeleteOutlet = () => {
    if (!outletToDelete || !activeCompanyId) return;

    const success = deleteMockOutlet(outletToDelete.id, activeCompanyId);
    if (success) {
      setOutlets(prev => prev.filter(o => o.id !== outletToDelete.id));
      toast({
        title: "Outlet Dihapus",
        description: `Outlet "${outletToDelete.name}" telah berhasil dihapus.`,
      });
    } else {
      toast({
        title: "Gagal Menghapus",
        description: "Terjadi kesalahan saat menghapus outlet.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setOutletToDelete(null);
    // router.refresh(); // Event listener should handle this
  };

  const openDeleteDialog = (outlet: Outlet) => {
    setOutletToDelete(outlet);
    setShowDeleteDialog(true);
  };

  return (
    <div>
      <PageHeader title="Manajemen Outlet" description="Kelola daftar outlet atau cabang bisnis untuk perusahaan yang aktif.">
        <Button asChild disabled={!activeCompanyId}>
          <Link href={activeCompanyId ? "/dashboard/settings/outlets/add" : "#"}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Outlet
          </Link>
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Outlet</CardTitle>
          {activeCompanyId ? (
            <CardDescription>Total {outlets.length} outlet ditemukan untuk perusahaan ini.</CardDescription>
          ) : (
            <CardDescription>Pilih perusahaan terlebih dahulu untuk melihat daftar outlet.</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Outlet</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="hidden md:table-cell">Manajer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">Memuat data outlet...</TableCell>
                </TableRow>
              )}
              {!isLoading && !activeCompanyId && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    Pilih perusahaan aktif terlebih dahulu untuk melihat daftar outlet.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && activeCompanyId && outlets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    Belum ada outlet yang terdaftar untuk perusahaan ini.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && activeCompanyId && outlets.map((outlet) => (
                <TableRow key={outlet.id}>
                  <TableCell className="font-medium flex items-center">
                    <Store className="h-4 w-4 mr-2 text-primary" />
                    {outlet.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1 inline-block text-muted-foreground" />
                    {outlet.address}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{outlet.manager || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={outlet.status === "Aktif" ? "default" : "secondary"}
                     className={
                        outlet.status === 'Aktif' ? "bg-green-500 hover:bg-green-600 text-primary-foreground" :
                        outlet.status === 'Tidak Aktif' ? "bg-red-500 hover:bg-red-600 text-primary-foreground" : ""
                      }
                    >
                      {outlet.status}
                    </Badge>
                  </TableCell>
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
                        <DropdownMenuItem disabled> {/* Implement edit page later */}
                          <Edit className="mr-2 h-4 w-4" /> Edit Outlet (Segera Hadir)
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(outlet)} 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus Outlet
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
            <AlertDialogTitle>Anda yakin ingin menghapus outlet ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Outlet "{outletToDelete?.name}" akan dihapus secara permanen. Semua data terkait outlet ini (misal jam operasional, shift) juga mungkin akan terpengaruh atau perlu disesuaikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOutletToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteOutlet} className="bg-destructive hover:bg-destructive/90">
              Ya, Hapus Outlet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
