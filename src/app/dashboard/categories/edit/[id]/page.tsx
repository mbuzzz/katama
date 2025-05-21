
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import CategoryForm from "@/components/categories/category-form";
import type { CategoryFormData } from "@/components/categories/category-form";
import { getMockCategoryById } from "@/data/categories";
import { updateCategoryAction } from "../actions"; // Use the new server action
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types/category";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

interface EditCategoryPageProps {
  params: { id: string };
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const categoryId = params.id;
  const [category, setCategory] = React.useState<Category | null | undefined>(undefined); // undefined for loading
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  
  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    if (storedCompanyId) {
      setActiveCompanyId(storedCompanyId);
      const fetchedCategory = getMockCategoryById(categoryId, storedCompanyId);
      setCategory(fetchedCategory);
    } else {
      setCategory(null); // No active company, so category cannot be determined
    }
    setIsLoading(false);
  }, [categoryId]);

  const handleUpdateCategory = async (data: CategoryFormData) => {
    // This function is now a client-side function that calls the server action
    if (!activeCompanyId) {
      console.error("Gagal memperbarui kategori: ID Perusahaan aktif tidak ditemukan.");
      throw new Error("ID Perusahaan aktif tidak ditemukan.");
    }
    return updateCategoryAction(categoryId, data, activeCompanyId);
  };

  if (isLoading || category === undefined) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Kategori" description="Memuat data kategori..." />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex justify-center items-center h-64">
            <p>Memuat...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Kategori" description="Kategori tidak ditemukan." />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-destructive" /> Kategori Tidak Ditemukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Kategori yang Anda coba edit tidak ada untuk perusahaan yang aktif, atau Anda belum memilih perusahaan.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/categories">Kembali ke Daftar Kategori</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Edit Kategori" 
        description={`Perbarui detail untuk kategori "${category.name}" pada perusahaan yang aktif.`}
      />
      <CategoryForm
        initialData={category}
        onSave={handleUpdateCategory}
        isEditing={true}
      />
    </div>
  );
}
