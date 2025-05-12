import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, MoreHorizontal, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const mockRoles = [
  { id: "1", name: "Admin", description: "Akses penuh ke semua fitur dan pengaturan.", userCount: 1 },
  { id: "2", name: "Manajer", description: "Mengelola operasional outlet, laporan, dan staf.", userCount: 2 },
  { id: "3", name: "Kasir", description: "Akses ke fitur Point of Sale dan laporan penjualan pribadi.", userCount: 5 },
  { id: "4", name: "Staf Dapur", description: "Melihat pesanan dan mengelola stok bahan.", userCount: 3 },
];

export default function RolesPage() {
  return (
    <div>
      <PageHeader title="Manajemen Peran (Role)" description="Kelola peran pengguna dan hak aksesnya.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Peran
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Peran</CardTitle>
          <CardDescription>Total {mockRoles.length} peran ditemukan.</CardDescription>
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
              {mockRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium flex items-center">
                    <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                    {role.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{role.description}</TableCell>
                  <TableCell className="text-center hidden md:table-cell">{role.userCount}</TableCell>
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
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Peran & Hak Akses</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" /> Hapus Peran</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
