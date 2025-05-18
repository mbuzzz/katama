
import { PageHeader } from "@/components/page-header";
import CategoryForm from "@/components/categories/category-form";
import type { CategoryFormData } from "@/components/categories/category-form";
import { getMockCategoryById, updateMockCategory } from "@/data/categories";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditCategoryPageProps {
  params: { id: string };
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const categoryId = params.id;
  // DI SINI KITA PERLU MENDAPATKAN companyId AKTIF
  const MOCK_ACTIVE_COMPANY_ID = "comp_es_teh_jaya"; // Ganti dengan logika sebenarnya
  
  // getMockCategoryById sekarang idealnya menerima companyId
  const category = getMockCategoryById(categoryId, MOCK_ACTIVE_COMPANY_ID);

  const handleUpdateCategory = async (data: CategoryFormData) => {
    "use server";
    // Pastikan updateMockCategory dipanggil dengan companyId
    try {
      const updatedCategory = updateMockCategory(categoryId, data, MOCK_ACTIVE_COMPANY_ID);
      if (!updatedCategory) {
        throw new Error("Kategori tidak ditemukan untuk diperbarui.");
      }
      console.log("Kategori diperbarui:", updatedCategory);
      return updatedCategory;
    } catch (error) {
      console.error("Gagal memperbarui kategori:", error);
      throw error;
    }
  };

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
            <p>Kategori yang Anda coba edit tidak ada atau mungkin telah dihapus dari perusahaan ini.</p>
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
        description={`Perbarui detail untuk kategori "${category.name}".`}
      />
      <CategoryForm
        initialData={category} // initialData sekarang menyertakan companyId
        onSave={handleUpdateCategory}
        isEditing={true}
      />
    </div>
  );
}
