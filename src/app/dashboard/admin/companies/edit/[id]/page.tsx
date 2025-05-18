
import { PageHeader } from "@/components/page-header";
import CompanyForm from "@/components/admin/company-form";
import type { CompanyFormData } from "@/types/company";
import { getMockCompanyById, updateMockCompany } from "@/data/companies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditCompanyAdminPageProps {
  params: { id: string };
}

export default async function EditCompanyAdminPage({ params }: EditCompanyAdminPageProps) {
  const companyId = params.id;
  const company = getMockCompanyById(companyId);

  const handleUpdateCompany = async (data: CompanyFormData) => {
    "use server";
    try {
      const updatedCompany = updateMockCompany(companyId, data);
      if (!updatedCompany) {
        throw new Error("Perusahaan tidak ditemukan untuk diperbarui.");
      }
      console.log("Perusahaan diperbarui:", updatedCompany);
      return updatedCompany;
    } catch (error) {
      console.error("Gagal memperbarui perusahaan:", error);
      throw error;
    }
  };

  if (!company) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Perusahaan (Admin)" description="Perusahaan tidak ditemukan." />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-6 w-6 text-destructive" /> Perusahaan Tidak Ditemukan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Perusahaan yang Anda coba edit tidak ada atau mungkin telah dihapus.</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/admin/companies">Kembali ke Daftar Perusahaan</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Edit Perusahaan (Admin)" 
        description={`Perbarui detail untuk perusahaan "${company.name}".`}
      />
      <CompanyForm
        initialData={company}
        onSave={handleUpdateCompany}
        isEditing={true}
      />
    </div>
  );
}
