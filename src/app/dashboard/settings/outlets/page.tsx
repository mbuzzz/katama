
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
import type { Outlet } from "@/types/outlet"; // Import tipe Outlet terpusat
import { getMockOutlets } from "@/data/outlets"; // Import fungsi data terpusat
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function OutletsPage() {
  const [outlets, setOutlets] = React.useState<Outlet[]>([]);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const router = useRouter();
  // State untuk dialog hapus (jika diimplementasikan)
  // const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  // const [outletToDelete, setOutletToDelete] = React.useState<Outlet | null>(null);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (activeCompanyId) {
      setOutlets(getMockOutlets(activeCompanyId));
    } else {
      setOutlets([]);
    }
  }, [activeCompanyId]);

  // Fungsi handleDeleteOutlet (jika diimplementasikan)
  // const handleDeleteOutlet = () => { ... }

  // Fungsi openDeleteDialog (jika diimplementasikan)
  // const openDeleteDialog = (outlet: Outlet) => { ... }

  return (
    <div>
      <PageHeader title="Manajemen Outlet" description="Kelola daftar outlet atau cabang bisnis untuk perusahaan yang aktif.">
        <Button disabled={!activeCompanyId}> {/* Implementasi tambah outlet perlu halaman dan form sendiri */}
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Outlet (Segera Hadir)
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
                        <DropdownMenuItem disabled>
                          <Edit className="mr-2 h-4 w-4" /> Edit Outlet (Segera Hadir)
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          disabled /* onClick={() => openDeleteDialog(outlet)} */
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus Outlet (Segera Hadir)
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

      {/* Dialog Hapus Outlet (jika diimplementasikan)
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        ...
      </AlertDialog>
      */}
    </div>
  );
}
