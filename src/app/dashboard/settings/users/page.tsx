
"use client";

import * as React from "react";
import Link from "next/link"; 
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, MoreHorizontal, UserCircle2, Award, Star } from "lucide-react"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator, 
} from "@/components/ui/dropdown-menu";
import type { User } from "@/types/user"; 
import { getMockUsers, deleteMockUser } from "@/data/users"; 
import { getMockCompanyById } from "@/data/companies";
import { useToast } from "@/hooks/use-toast";
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

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [activeCompanyName, setActiveCompanyName] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const [userToDelete, setUserToDelete] = React.useState<User | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);


  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    if (storedCompanyId) {
      const companyDetails = getMockCompanyById(storedCompanyId);
      setActiveCompanyName(companyDetails?.name || null);
      // TODO: Implement company-specific user fetching
      // For now, getMockUsers returns all users. We need a way to associate users with companies.
      // This might involve changing the User type to include companyId or a list of companyIds/roles.
      setUsers(getMockUsers());
    } else {
      setUsers([]); 
    }
    setIsLoading(false);
  }, []);

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    // TODO: If users become company-specific, deleteMockUser might need companyId.
    // For now, it deletes globally.
    const success = deleteMockUser(userToDelete.id);
    if (success) {
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        toast({
            title: "Pengguna Dihapus",
            description: `Pengguna "${userToDelete.name}" telah berhasil dihapus.`,
        });
    } else {
        toast({
            title: "Gagal Menghapus",
            description: "Terjadi kesalahan saat menghapus pengguna.",
            variant: "destructive",
        });
    }
    setShowDeleteDialog(false);
    setUserToDelete(null);
  };

  const openDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };


  const getBadgeVariant = (badgeName?: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (badgeName?.toLowerCase()) {
      case "pro":
        return "secondary"; 
      case "veteran":
        return "default"; 
      case "pemula":
        return "outline"; 
      default:
        return "outline";
    }
  };

  const pageTitle = activeCompanyName 
    ? `Manajemen Pengguna untuk ${activeCompanyName}` 
    : "Manajemen Pengguna";
  
  const pageDescription = activeCompanyName
    ? `Kelola akun pengguna, peran, poin, dan lencana untuk perusahaan ${activeCompanyName}.`
    : "Pilih perusahaan aktif dari menu dropdown di header untuk mengelola pengguna.";


  if (isLoading) {
    return (
      <div>
        <PageHeader title="Manajemen Pengguna" description="Memuat data pengguna..." />
        <Card className="shadow-lg">
          <CardContent className="flex items-center justify-center h-64">
            <p>Memuat...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={pageTitle} description={pageDescription}>
        <Button asChild disabled={!activeCompanyId}> 
          <Link href={activeCompanyId ? "/dashboard/settings/users/add" : "#"}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengguna
          </Link>
        </Button>
      </PageHeader>
      
      {!activeCompanyId && !isLoading && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Pilih Perusahaan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Anda harus memilih perusahaan aktif terlebih dahulu dari menu dropdown di header (jika Anda Superadmin) untuk dapat mengelola pengguna.
            </p>
          </CardContent>
        </Card>
      )}

      {activeCompanyId && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Daftar Pengguna {activeCompanyName ? `(${activeCompanyName})` : ''}</CardTitle>
            <CardDescription>
              Total {users.length} pengguna ditemukan (saat ini daftar pengguna masih global, belum difilter per perusahaan).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[80px] sm:table-cell">Avatar</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Peran (Role)</TableHead>
                  <TableHead className="hidden md:table-cell">Outlet (Default)</TableHead>
                  <TableHead className="text-right hidden lg:table-cell">Poin</TableHead>
                  <TableHead className="hidden lg:table-cell">Lencana</TableHead>
                  <TableHead>
                    <span className="sr-only">Aksi</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 && (
                   <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                      Belum ada pengguna yang terdaftar (atau filter per perusahaan belum aktif).
                    </TableCell>
                  </TableRow>
                )}
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="user avatar" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "Admin" ? "destructive" : user.role === "Manajer" ? "secondary" : "outline"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{user.outlet}</TableCell>
                    <TableCell className="text-right hidden lg:table-cell">
                      <div className="flex items-center justify-end">
                         <Star className="h-3.5 w-3.5 text-yellow-500 mr-1" />
                         {user.points?.toLocaleString('id-ID') || 0}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {user.badge && (
                        <Badge variant={getBadgeVariant(user.badge)}
                         className={
                          user.badge === 'Pro' ? "bg-blue-500 hover:bg-blue-600 text-primary-foreground" :
                          user.badge === 'Veteran' ? "bg-yellow-500 hover:bg-yellow-600 text-primary-foreground" :
                          user.badge === 'Pemula' ? "border-border" : ""
                        }
                        >
                          <Award className="mr-1 h-3.5 w-3.5" />
                          {user.badge}
                        </Badge>
                      )}
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
                            <UserCircle2 className="mr-2 h-4 w-4" /> Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled> 
                            <Edit className="mr-2 h-4 w-4" /> Edit Pengguna
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10" 
                            onClick={() => openDeleteDialog(user)}
                            disabled={user.email === "budi@katama.com"} // Contoh: nonaktifkan hapus untuk admin utama
                           > 
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus Pengguna
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
      )}

       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin ingin menghapus pengguna ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Pengguna "{userToDelete?.name}" akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Ya, Hapus Pengguna
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
