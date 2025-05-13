

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
import { getMockUsers } from "@/data/users"; // Import from data/users.ts

// mockUsers is now fetched from data/users.ts, which has the adjusted points.
// const mockUsers: User[] = [
//   { id: "1", name: "Ana Maria", email: "ana@katama.com", role: "Kasir", outlet: "Outlet Pusat", avatar: "https://picsum.photos/40/40?random=user1", points: 970, badge: "Pemula" },
//   { id: "2", name: "Budi Santoso", email: "budi@katama.com", role: "Admin", outlet: "Outlet Pusat", avatar: "https://picsum.photos/40/40?random=user2", points: 400, badge: "Pemula" },
//   { id: "3", name: "Candra Wijaya", email: "candra@katama.com", role: "Manajer", outlet: "Outlet Cabang A", avatar: "https://picsum.photos/40/40?random=user3", points: 2500, badge: "Veteran" },
//   { id: "4", name: "Dewi Lestari", email: "dewi@katama.com", role: "Kasir", outlet: "Outlet Cabang A", avatar: "https://picsum.photos/40/40?random=user4", points: 0, badge: "Pemula" },
// ];


export default function UsersPage() {
  const users = getMockUsers(); // Fetch users from the central data source

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


  return (
    <div>
      <PageHeader title="Manajemen Pengguna" description="Kelola akun pengguna, peran, poin, dan lencana.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengguna
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>Total {users.length} pengguna ditemukan.</CardDescription>
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
                <TableHead className="text-right hidden lg:table-cell">Poin</TableHead>
                <TableHead className="hidden lg:table-cell">Lencana</TableHead>
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
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
