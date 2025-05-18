
import { PageHeader } from "@/components/page-header";
import CategoryForm from "@/components/categories/category-form";
import type { CategoryFormData } from "@/components/categories/category-form";
import { addMockCategory } from "@/data/categories"; // We'll use server actions later

export default function AddCategoryPage() {

  const handleSaveCategory = async (data: CategoryFormData) => {
    "use server";
    // DI SINI KITA PERLU MENDAPATKAN companyId AKTIF
    // Untuk sekarang, kita akan hardcode atau asumsikan sudah ada di 'data' jika CategoryFormData diubah
    // Dalam implementasi nyata, ini akan datang dari sesi pengguna atau state global
    const MOCK_ACTIVE_COMPANY_ID = "comp_es_teh_jaya"; // Ganti dengan logika sebenarnya

    try {
      // Pastikan addMockCategory dipanggil dengan companyId
      const newCategory = addMockCategory(data, MOCK_ACTIVE_COMPANY_ID);
      console.log("Kategori ditambahkan:", newCategory);
      // Redirect or toast is handled in CategoryForm
      return newCategory;
    } catch (error) {
      console.error("Gagal menambahkan kategori:", error);
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
        // Anda mungkin perlu meneruskan companyId ke CategoryForm jika ia perlu melakukan sesuatu dengannya
        // atau memodifikasi onSave untuk mendapatkan companyId dari server action context.
      />
    </div>
  );
}
