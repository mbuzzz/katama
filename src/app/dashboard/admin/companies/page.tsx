
"use client"; 

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, MoreHorizontal, Building } from "lucide-react";
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
import type { Company } from "@/types/company";
import { getMockCompanies, deleteMockCompany } from "@/data/companies";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function CompaniesAdminPage() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [companyToDelete, setCompanyToDelete] = React.useState<Company | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchCompanies = () => {
    setCompanies(getMockCompanies());
  };

  React.useEffect(() => {
    fetchCompanies();
    
    const handleCompanyListChanged = () => {
      fetchCompanies();
      router.refresh(); // To potentially update CompanySwitcher as well
    };

    window.addEventListener('companyListChanged', handleCompanyListChanged);
    return () => {
      window.removeEventListener('companyListChanged', handleCompanyListChanged);
    };
  }, [router]);

  const handleDeleteCompany = () => {
    if (!companyToDelete) return;

    const success = deleteMockCompany(companyToDelete.id);
    if (success) {
      fetchCompanies(); // Re-fetch to update the list
      toast({
        title: "Perusahaan Dihapus",
        description: `Perusahaan "${companyToDelete.name}" telah berhasil dihapus.`,
      });
      window.dispatchEvent(new CustomEvent('companyListChanged')); // Notify switcher
    } else {
      toast({
        title: "Gagal Menghapus",
        description: "Terjadi kesalahan saat menghapus perusahaan.",
        variant: "destructive",
      });
    }
    setShowDeleteDialog(false);
    setCompanyToDelete(null);
    // router.refresh(); // Not strictly needed if fetchCompanies updates state and re-renders
  };

  const openDeleteDialog = (company: Company) => {
    setCompanyToDelete(company);
    setShowDeleteDialog(true);
  };

  return (
    <div>
      <PageHeader title="Manajemen Perusahaan" description="Kelola daftar perusahaan yang terdaftar dalam sistem.">
        <Button asChild>
          <Link href="/dashboard/admin/companies/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Perusahaan
          </Link>
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Perusahaan</CardTitle>
          <CardDescription>
            Total {companies.length} perusahaan ditemukan. Fitur ini ditujukan untuk Superadmin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Perusahaan</TableHead>
                <TableHead>Nama Perusahaan</TableHead>
                {/* Tambahkan kolom lain di sini jika perlu, mis. Status Langganan, Tanggal Daftar, dll. */}
                <TableHead className="text-right">
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-10">
                    Belum ada perusahaan yang ditambahkan.
                  </TableCell>
                </TableRow>
              )}
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-mono text-xs">{company.id}</TableCell>
                  <TableCell className="font-medium flex items-center">
                     <Building className="mr-2 h-4 w-4 text-muted-foreground"/>
                    {company.name}
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
                          <Link href={`/dashboard/admin/companies/edit/${company.id}`}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => openDeleteDialog(company)}
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
            <AlertDialogTitle>Anda yakin ingin menghapus perusahaan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat diurungkan. Perusahaan "{companyToDelete?.name}" dan semua data terkait (nantinya) akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCompanyToDelete(null)}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCompany} className="bg-destructive hover:bg-destructive/90">
              Ya, Hapus Perusahaan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
