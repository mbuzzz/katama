
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, MoreHorizontal, Tags } from "lucide-react";
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
import type { Unit } from "@/types/unit";
import { getMockUnits, deleteMockUnit } from "@/data/units"; 
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function UnitsPage() {
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [unitToDelete, setUnitToDelete] = React.useState<Unit | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (activeCompanyId) {
      setUnits(getMockUnits(activeCompanyId));
    } else {
      setUnits([]);
    }
  }, [activeCompanyId]);

  const handleDeleteUnit = () => {
    if (!unitToDelete || !activeCompanyId) return;

    const success = deleteMockUnit(unitToDelete.id, activeCompanyId); 
    
    if (success) {
      setUnits(prevUnits => prevUnits.filter(u => u.id !== unitToDelete.id));
      toast({
        title: "Satuan Dihapus",
        description: `Satuan "${unitToDelete.name}" telah berhasil dihapus.`,
      });
    } else {
      toast({
        title: "Gagal Menghapus",
        description: "Menghapus satuan gagal atau satuan mungkin sedang digunakan.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setUnitToDelete(null);
    router.refresh(); 
  };

  const openDeleteDialog = (unit: Unit) => {
    setUnitToDelete(unit);
    setShowDeleteDialog(true);
  };


  return (
    <div>
      <PageHeader title="Satuan Barang" description="Kelola satuan untuk produk dan pembelanjaan perusahaan aktif.">
        <Button asChild>
          <Link href="/dashboard/units/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Satuan
          </Link>
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Satuan Barang</CardTitle>
          <CardDescription>
            Total {units.length} satuan ditemukan {activeCompanyId ? `untuk perusahaan ini` : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Satuan</TableHead>
                <TableHead>Singkatan</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                 <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-10">Memuat data satuan...</TableCell>
                </TableRow>
              )}
              {!isLoading && !activeCompanyId && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                    Pilih perusahaan terlebih dahulu untuk melihat satuan barang.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && activeCompanyId && units.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                    Belum ada satuan yang ditambahkan untuk perusahaan ini.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && activeCompanyId && units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium flex items-center">
                    <Tags className="h-4 w-4 mr-2 text-muted-foreground" />
                    {unit.name}
                  </TableCell>
                  <TableCell>{unit.abbreviation}</TableCell>
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
                        <DropdownMenuItem disabled> {/* Editing units needs a form and edit page */}
                            <Edit className="mr-2 h-4 w-4" /> Edit (Segera Hadir)
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => openDeleteDialog(unit)}
                           // Enable delete again, but it needs careful consideration if units are in use
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
            <AlertDialogTitle>Anda yakin ingin menghapus satuan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Satuan "{unitToDelete?.name}" akan dihapus.
              Pastikan satuan ini tidak sedang digunakan oleh bahan baku atau produk.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUnitToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUnit} className="bg-destructive hover:bg-destructive/90">
              Ya, Hapus Satuan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
