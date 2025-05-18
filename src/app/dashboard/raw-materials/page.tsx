
"use client"; 

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, MoreHorizontal, Archive } from "lucide-react";
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
import type { RawMaterial } from "@/types/raw-material";
import type { Unit } from "@/types/unit";
import { getMockRawMaterials, deleteMockRawMaterial } from "@/data/raw-materials";
import { getMockUnits } from "@/data/units"; // Mengganti getMockUnitById
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

interface DisplayRawMaterial extends RawMaterial {
  unitName?: string;
  unitAbbreviation?: string;
}

export default function RawMaterialsPage() {
  const [rawMaterials, setRawMaterials] = React.useState<DisplayRawMaterial[]>([]);
  const [units, setUnits] = React.useState<Unit[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [materialToDelete, setMaterialToDelete] = React.useState<DisplayRawMaterial | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchedUnits = getMockUnits();
    setUnits(fetchedUnits);
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
  }, []);

  React.useEffect(() => {
    if (activeCompanyId) {
      // Untuk SaaS, getMockRawMaterials perlu companyId
      const fetchedMaterials = getMockRawMaterials(activeCompanyId).map(material => {
        const unit = units.find(u => u.id === material.unitId);
        return {
          ...material,
          unitName: unit?.name || 'N/A',
          unitAbbreviation: unit?.abbreviation || '-',
        };
      });
      setRawMaterials(fetchedMaterials);
    } else {
      setRawMaterials([]);
    }
  }, [activeCompanyId, units]);


  const handleDeleteMaterial = () => {
    if (!materialToDelete || !activeCompanyId) return;

    // Untuk SaaS, deleteMockRawMaterial perlu companyId
    const success = deleteMockRawMaterial(materialToDelete.id, activeCompanyId);
    if (success) {
      setRawMaterials(prevMaterials => prevMaterials.filter(mat => mat.id !== materialToDelete.id));
      toast({
        title: "Bahan Baku Dihapus",
        description: `Bahan baku "${materialToDelete.name}" telah berhasil dihapus.`,
      });
    } else {
      toast({
        title: "Gagal Menghapus",
        description: "Terjadi kesalahan saat menghapus bahan baku.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setMaterialToDelete(null);
    router.refresh(); 
  };

  const openDeleteDialog = (material: DisplayRawMaterial) => {
    setMaterialToDelete(material);
    setShowDeleteDialog(true);
  };

  return (
    <div>
      <PageHeader title="Bahan Baku" description="Kelola daftar bahan baku dan stoknya untuk perusahaan yang aktif.">
        <Button asChild>
          <Link href="/dashboard/raw-materials/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Bahan Baku
          </Link>
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Bahan Baku</CardTitle>
          <CardDescription>
            Total {rawMaterials.length} bahan baku ditemukan {activeCompanyId ? `untuk perusahaan ini` : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Bahan Baku</TableHead>
                <TableHead className="text-right">Stok</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead className="text-right hidden md:table-cell">Biaya/Unit (Rp)</TableHead>
                <TableHead className="text-right">
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!activeCompanyId && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    Pilih perusahaan terlebih dahulu untuk melihat bahan baku.
                  </TableCell>
                </TableRow>
              )}
              {activeCompanyId && rawMaterials.length === 0 && (
                 <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    Belum ada bahan baku yang ditambahkan untuk perusahaan ini.
                  </TableCell>
                </TableRow>
              )}
              {activeCompanyId && rawMaterials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell className="text-right">{material.stock.toLocaleString('id-ID')}</TableCell>
                  <TableCell>{material.unitAbbreviation}</TableCell>
                  <TableCell className="text-right hidden md:table-cell">
                    {material.costPerUnit ? material.costPerUnit.toLocaleString('id-ID') : "-"}
                  </TableCell>
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
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/raw-materials/edit/${material.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => openDeleteDialog(material)}
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
            <AlertDialogTitle>Anda yakin ingin menghapus bahan baku ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Bahan baku "{materialToDelete?.name}" akan dihapus secara permanen.
              Ini mungkin mempengaruhi resep produk yang menggunakan bahan baku ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMaterialToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMaterial} className="bg-destructive hover:bg-destructive/90">
              Ya, Hapus Bahan Baku
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
