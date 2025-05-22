
"use client";

import * as React from "react";
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
import { getMockUsers, getMockCompanyById } from "@/data/users"; // Assuming getMockCompanyById is moved or available here
// For now, we'll use a helper directly in this file if getMockCompanyById is not in data/users.ts
// import { getMockCompanyById as getCompanyDetails } from "@/data/companies";


const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

// Temporary helper if getMockCompanyById is not in src/data/users.ts
const getCompanyDetails = (companyId: string): { id: string; name: string } | null => {
    // In a real app, this would fetch from a data source. For mock data:
    const companies = [ 
        { id: 'comp_es_teh_jaya', name: 'Perusahaan Es Teh Jaya' },
        { id: 'comp_kopi_maju', name: 'Kedai Kopi Maju Jaya' },
        { id: 'comp_roti_lezat', name: 'Toko Roti Lezat Selalu' },
    ];
    const company = companies.find(c => c.id === companyId);
    return company || null;
};


export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [activeCompanyName, setActiveCompanyName] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    if (storedCompanyId) {
      const companyDetails = getCompanyDetails(storedCompanyId);
      setActiveCompanyName(companyDetails?.name || null);
      // TODO: In a full SaaS, getMockUsers would accept companyId and filter users.
      // For now, it returns all users.
      setUsers(getMockUsers());
    } else {
      setUsers([]); // No company selected, show no users or a message
    }
    setIsLoading(false);
  }, []);

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
    : "Pilih perusahaan terlebih dahulu untuk mengelola pengguna.";


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
        <Button disabled={!activeCompanyId}> 
          {/* TODO: Link to a company-specific add user page or disable if no company */}
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengguna
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
            {/* TODO: userCount should be per company in full SaaS */}
            <CardDescription>Total {users.length} pengguna ditemukan (global). Fitur filter per perusahaan akan datang.</CardDescription>
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
                          <DropdownMenuItem disabled> {/* TODO: Link to company-specific user detail */}
                            <UserCircle2 className="mr-2 h-4 w-4" /> Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem disabled> {/* TODO: Link to company-specific user edit */}
                            <Edit className="mr-2 h-4 w-4" /> Edit Pengguna
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled> {/* TODO: Implement company-specific delete */}
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
    </div>
  );
}
