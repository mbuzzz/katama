
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import PurchaseForm from "@/components/purchases/purchase-form";
import type { PurchaseFormData } from "@/types/purchase";
import { getMockRawMaterials } from "@/data/raw-materials";
import { getMockUsers } from "@/data/users";
import { addMockPurchase as serverAddMockPurchase } from "@/data/purchases"; // Renamed for clarity
import type { RawMaterial } from "@/types/raw-material";
import type { User } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function AddPurchasePage() {
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [rawMaterialsForCompany, setRawMaterialsForCompany] = React.useState<RawMaterial[]>([]);
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    if (storedCompanyId) {
      setActiveCompanyId(storedCompanyId);
      setRawMaterialsForCompany(getMockRawMaterials(storedCompanyId));
    } else {
      console.warn("Tidak ada ID perusahaan aktif yang dipilih untuk menambah pembelanjaan.");
    }
    setUsers(getMockUsers()); // Users are global for now, not filtered by company
    setIsLoading(false);
  }, []);

  const handleSavePurchase = async (data: PurchaseFormData) => {
    "use server";
    if (!activeCompanyId) {
      console.error("Gagal menyimpan pembelanjaan: ID Perusahaan aktif tidak ditemukan.");
      throw new Error("ID Perusahaan aktif tidak ditemukan.");
    }
    try {
      const newPurchase = serverAddMockPurchase(data, activeCompanyId);
      return newPurchase;
    } catch (error: any) {
      console.error("Gagal menambahkan pembelanjaan:", error.message);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Catat Pembelanjaan Baru" 
          description="Memuat data..." 
        />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex justify-center items-center h-64">
            <p>Memuat...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!activeCompanyId && !isLoading) {
     return (
      <div className="space-y-6">
        <PageHeader 
          title="Catat Pembelanjaan Baru" 
          description="Tidak dapat mencatat pembelanjaan." 
        />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex flex-col justify-center items-center h-64 text-center">
            <p className="text-destructive font-semibold">Pilih perusahaan terlebih dahulu.</p>
            <p className="text-muted-foreground text-sm">Anda perlu memilih perusahaan aktif dari menu dropdown di header sebelum dapat mencatat pembelanjaan.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (rawMaterialsForCompany.length === 0 && !isLoading && activeCompanyId) {
     return (
      <div className="space-y-6">
        <PageHeader 
          title="Catat Pembelanjaan Baru" 
          description="Tidak dapat mencatat pembelanjaan." 
        />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex flex-col justify-center items-center h-64 text-center">
            <p className="text-destructive font-semibold">Tidak Ada Bahan Baku.</p>
            <p className="text-muted-foreground text-sm">Perusahaan ini belum memiliki data bahan baku. Tambahkan bahan baku terlebih dahulu sebelum mencatat pembelanjaan.</p>
             <Button asChild className="mt-4">
              <Link href="/dashboard/raw-materials/add">Tambah Bahan Baku</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <PageHeader 
        title="Catat Pembelanjaan Baru" 
        description="Isi detail pembelanjaan bahan baku. Stok akan otomatis diperbarui." 
      />
      <PurchaseForm
        rawMaterialsForCompany={rawMaterialsForCompany}
        users={users}
        onSave={handleSavePurchase}
      />
    </div>
  );
}
