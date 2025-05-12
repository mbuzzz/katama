
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link"; // Added Link for future "Tambah Satuan"
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
import { getMockUnits, deleteMockUnit } from "@/data/units"; // Use new data source
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function UnitsPage() {
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [unitToDelete, setUnitToDelete] = React.useState<Unit | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    setUnits(getMockUnits());
  }, []);

  const handleDeleteUnit = () => {
    if (!unitToDelete) return;

    // For now, delete is disabled as it might break raw material references.
    // In a real app, this would need more complex logic or be disallowed if in use.
    // const success = deleteMockUnit(unitToDelete.id); 
    const success = false; // Temporarily disable actual deletion
    
    if (success) {
      // setUnits(units.filter(u => u.id !== unitToDelete.id));
      // toast({
      //   title: "Satuan Dihapus",
      //   description: `Satuan "${unitToDelete.name}" telah berhasil dihapus.`,
      // });
    } else {
      toast({
        title: "Gagal Menghapus",
        description: "Menghapus satuan yang sedang digunakan tidak diizinkan saat ini.", // Or other error
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setUnitToDelete(null);
    // router.refresh(); // If data source changes
  };

  const openDeleteDialog = (unit: Unit) => {
    setUnitToDelete(unit);
    setShowDeleteDialog(true);
  };


  return (
    <div>
      <PageHeader title="Satuan Barang" description="Kelola satuan untuk produk dan pembelanjaan.">
        {/* The "Tambah Satuan" functionality would require a new form and page, similar to categories/raw-materials */}
        <Button disabled> 
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Satuan (Segera Hadir)
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Satuan Barang</CardTitle>
          <CardDescription>Total {units.length} satuan ditemukan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Satuan</TableHead>
                <TableHead>Singkatan</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.name}</TableCell>
                  <TableCell>{unit.abbreviation}</TableCell>
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
                        <DropdownMenuItem disabled> {/* Editing also needs a form */}
                            <Edit className="mr-2 h-4 w-4" /> Edit (Segera Hadir)
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => openDeleteDialog(unit)}
                          disabled /* Deleting units needs careful consideration if they are in use */
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus (Dinonaktifkan)
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
