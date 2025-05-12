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

// Mock data
const mockOutlets = [
  { id: "1", name: "TokoLite Pusat", address: "Jl. Merdeka No. 1, Kota Bahagia", status: "Aktif", manager: "Budi Santoso" },
  { id: "2", name: "TokoLite Cabang Sudirman", address: "Jl. Jend. Sudirman Kav. 20, Kota Bahagia", status: "Aktif", manager: "Candra Wijaya" },
  { id: "3", name: "TokoLite Express Stasiun", address: "Stasiun Kota Lama Lt. 1, Kota Bahagia", status: "Tidak Aktif", manager: "-" },
];

export default function OutletsPage() {
  return (
    <div>
      <PageHeader title="Manajemen Outlet" description="Kelola daftar outlet atau cabang bisnis Anda.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Outlet
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Outlet</CardTitle>
          <CardDescription>Total {mockOutlets.length} outlet ditemukan.</CardDescription>
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
              {mockOutlets.map((outlet) => (
                <TableRow key={outlet.id}>
                  <TableCell className="font-medium flex items-center">
                    <Store className="h-4 w-4 mr-2 text-primary" />
                    {outlet.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1 inline-block text-muted-foreground" />
                    {outlet.address}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{outlet.manager}</TableCell>
                  <TableCell>
                    <Badge variant={outlet.status === "Aktif" ? "default" : "secondary"}>
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
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Outlet</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" /> Hapus Outlet</DropdownMenuItem>
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
