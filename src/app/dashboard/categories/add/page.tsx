
import { PageHeader } from "@/components/page-header";
import CategoryForm from "@/components/categories/category-form";
import type { CategoryFormData } from "@/components/categories/category-form";
import { addMockCategory } from "@/data/categories"; // We'll use server actions later

export default function AddCategoryPage() {

  const handleSaveCategory = async (data: CategoryFormData) => {
    "use server";
    // In a real app, this would be an API call or database operation.
    // For now, we use our mock function.
    try {
      const newCategory = addMockCategory(data);
      console.log("Category added:", newCategory);
      // Redirect or toast is handled in CategoryForm
      return newCategory;
    } catch (error) {
      console.error("Failed to add category:", error);
      throw error; // Re-throw to be caught by form's error handler
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tambah Kategori Baru" 
        description="Isi detail untuk kategori produk baru." 
      />
      <CategoryForm
        onSave={handleSaveCategory}
        isEditing={false}
      />
    </div>
  );
}
