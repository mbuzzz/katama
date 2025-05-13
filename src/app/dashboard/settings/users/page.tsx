

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, MoreHorizontal, UserCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator, // Added missing import
} from "@/components/ui/dropdown-menu";

// Mock data - Exported for use in shifts module
export const mockUsers = [
  { id: "1", name: "Ana Maria", email: "ana@katama.com", role: "Kasir", outlet: "Outlet Pusat", avatar: "https://picsum.photos/40/40?random=user1" },
  { id: "2", name: "Budi Santoso", email: "budi@katama.com", role: "Admin", outlet: "Outlet Pusat", avatar: "https://picsum.photos/40/40?random=user2" },
  { id: "3", name: "Candra Wijaya", email: "candra@katama.com", role: "Manajer", outlet: "Outlet Cabang A", avatar: "https://picsum.photos/40/40?random=user3" },
];

export default function UsersPage() {
  return (
    <div>
      <PageHeader title="Manajemen Pengguna" description="Kelola akun pengguna, peran, dan akses.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengguna
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>Total {mockUsers.length} pengguna ditemukan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[80px] sm:table-cell">Avatar</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Peran (Role)</TableHead>
                <TableHead className="hidden md:table-cell">Outlet</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
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
                        <DropdownMenuItem><UserCircle2 className="mr-2 h-4 w-4" /> Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit Pengguna</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" /> Hapus Pengguna</DropdownMenuItem>
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
