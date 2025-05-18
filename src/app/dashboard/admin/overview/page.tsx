
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getMockCompanies } from "@/data/companies";
import { getMockUsers } from "@/data/users"; // Assuming global user list for now

export default function AdminOverviewPage() {
  const [totalCompanies, setTotalCompanies] = React.useState(0);
  const [totalUsers, setTotalUsers] = React.useState(0);

  React.useEffect(() => {
    setTotalCompanies(getMockCompanies().length);
    setTotalUsers(getMockUsers().length); // Note: This is a global user count
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Overview Administrasi Sistem" 
        description="Ringkasan dan statistik utama sistem KATAMA POS."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Perusahaan Terdaftar</CardTitle>
            <Building2 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCompanies}</div>
            <p className="text-xs text-muted-foreground">perusahaan aktif dalam sistem.</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna (Global)</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">pengguna terdaftar di semua perusahaan.</p>
            <p className="text-xs text-muted-foreground italic mt-1">(Perlu penyesuaian untuk SAAS per-perusahaan)</p>
          </CardContent>
        </Card>
        
        {/* Placeholder for more stats like Subscriptions, Active Users Today, etc. */}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Tindakan Cepat</CardTitle>
          <CardDescription>Akses cepat ke fitur administrasi utama.</CardDescription>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Button asChild variant="outline" className="justify-start text-left h-auto py-3">
            <Link href="/dashboard/admin/companies">
              <Building2 className="mr-3 h-5 w-5" />
              <div>
                <p className="font-semibold">Manajemen Perusahaan</p>
                <p className="text-xs text-muted-foreground">Tambah, edit, atau hapus perusahaan.</p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </Link>
          </Button>
           {/* Placeholder for future quick actions */}
           <Button asChild variant="outline" className="justify-start text-left h-auto py-3" disabled>
            <Link href="#">
              <Users className="mr-3 h-5 w-5" />
              <div>
                <p className="font-semibold">Manajemen Pengguna (Global)</p>
                <p className="text-xs text-muted-foreground">Segera hadir.</p>
              </div>
               <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
