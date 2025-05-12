
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
  // "use server" is not needed here as data fetching can be done directly

  const categoryId = params.id;
  // In a real app, fetch this from a database.
  const category = getMockCategoryById(categoryId);

  const handleUpdateCategory = async (data: CategoryFormData) => {
    "use server";
    try {
      const updatedCategory = updateMockCategory(categoryId, data);
      if (!updatedCategory) {
        throw new Error("Category not found for update.");
      }
      console.log("Category updated:", updatedCategory);
      // Redirect or toast is handled in CategoryForm
      return updatedCategory;
    } catch (error) {
      console.error("Failed to update category:", error);
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
            <p>Kategori yang Anda coba edit tidak ada atau mungkin telah dihapus.</p>
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
        initialData={category}
        onSave={handleUpdateCategory}
        isEditing={true}
      />
    </div>
  );
}
