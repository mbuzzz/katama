
import { PageHeader } from "@/components/page-header";
import CompanyForm from "@/components/admin/company-form";
import type { CompanyFormData } from "@/types/company";
import { addMockCompany } from "@/data/companies";

export default function AddCompanyAdminPage() {

  const handleSaveCompany = async (data: CompanyFormData) => {
    "use server";
    try {
      const newCompany = addMockCompany(data);
      console.log("Perusahaan ditambahkan:", newCompany);
      // Redirect or toast is handled in CompanyForm
      return newCompany;
    } catch (error) {
      console.error("Gagal menambahkan perusahaan:", error);
      throw error; // Re-throw to be caught by form's error handler
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Tambah Perusahaan Baru (Admin)" 
        description="Daftarkan perusahaan baru ke dalam sistem." 
      />
      <CompanyForm
        onSave={handleSaveCompany}
        isEditing={false}
      />
    </div>
  );
}
