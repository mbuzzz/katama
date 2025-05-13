
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, MoreHorizontal, ShieldCheck } from "lucide-react";
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
import type { Role } from "@/types/role";
import { getMockRoles, deleteMockRole } from "@/data/roles";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function RolesPage() {
  const [roles, setRoles] = React.useState<Role[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [roleToDelete, setRoleToDelete] = React.useState<Role | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    setRoles(getMockRoles());
  }, []);

  const handleDeleteRole = () => {
    if (!roleToDelete) return;

    const success = deleteMockRole(roleToDelete.id);
    if (success) {
      setRoles(roles.filter(role => role.id !== roleToDelete.id));
      toast({
        title: "Peran Dihapus",
        description: `Peran "${roleToDelete.name}" telah berhasil dihapus.`,
      });
    } else {
      toast({
        title: "Gagal Menghapus",
        description: `Terjadi kesalahan saat menghapus peran "${roleToDelete.name}". Peran "Admin" tidak dapat dihapus.`,
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setRoleToDelete(null);
    router.refresh(); 
  };

  const openDeleteDialog = (role: Role) => {
    if (role.name === "Admin") {
        toast({
            title: "Tindakan Tidak Diizinkan",
            description: "Peran 'Admin' tidak dapat dihapus.",
            variant: "destructive",
        });
        return;
    }
    setRoleToDelete(role);
    setShowDeleteDialog(true);
  };

  return (
    <div>
      <PageHeader title="Manajemen Peran (Role)" description="Kelola peran pengguna dan hak aksesnya.">
        <Button asChild>
          <Link href="/dashboard/settings/roles/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Peran
          </Link>
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Peran</CardTitle>
          <CardDescription>Total {roles.length} peran ditemukan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Peran</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-center hidden md:table-cell">Jumlah Pengguna</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                    Belum ada peran yang ditambahkan.
                  </TableCell>
                </TableRow>
              )}
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                    {role.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{role.description || "-"}</TableCell>
                  <TableCell className="text-center hidden md:table-cell">{role.userCount || 0}</TableCell>
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
                          <Link href={`/dashboard/settings/roles/edit/${role.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Peran
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => openDeleteDialog(role)}
                          disabled={role.name === "Admin"}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Hapus Peran
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
            <AlertDialogTitle>Anda yakin ingin menghapus peran ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Peran "{roleToDelete?.name}" akan dihapus secara permanen.
              Pengguna yang memiliki peran ini mungkin perlu diberi peran baru.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRoleToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRole} className="bg-destructive hover:bg-destructive/90">
              Ya, Hapus Peran
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
