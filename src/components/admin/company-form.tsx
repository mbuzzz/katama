
"use client";

import type { Company, CompanyFormData } from "@/types/company";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Save, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const companyFormSchema = z.object({
  name: z.string().min(3, "Nama perusahaan minimal 3 karakter."),
});

interface CompanyFormProps {
  initialData?: Company;
  onSave: (data: CompanyFormData) => Promise<Company | void>;
  isEditing?: boolean;
}

export default function CompanyForm({
  initialData,
  onSave,
  isEditing = false,
}: CompanyFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const onSubmit = async (data: CompanyFormData) => {
    try {
      await onSave(data);
      toast({
        title: isEditing ? "Perusahaan Diperbarui" : "Perusahaan Ditambahkan",
        description: `Perusahaan "${data.name}" telah berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`,
      });
      router.push("/dashboard/admin/companies"); 
      router.refresh(); 
      // Dispatch event to notify CompanySwitcher to refresh its list
      window.dispatchEvent(new CustomEvent('companyListChanged'));
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan data perusahaan.",
        variant: "destructive",
      });
      console.error("Kesalahan penyimpanan perusahaan:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="mr-2 h-6 w-6 text-primary" />
            {isEditing ? "Edit Perusahaan" : "Tambah Perusahaan Baru"}
          </CardTitle>
          <CardDescription>
            {isEditing ? `Perbarui detail untuk perusahaan "${initialData?.name}".` : "Isi detail untuk perusahaan baru yang akan didaftarkan dalam sistem."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Perusahaan</Label>
            <Input 
              id="name" 
              {...form.register("name")} 
              placeholder="Contoh: PT. Jaya Abadi" 
              className="text-base"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>
          {/* Tambahkan field lain di sini jika diperlukan, mis. detail kontak, alamat, status langganan, dll. */}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/admin/companies")}>
              Batal
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting ? "Menyimpan..." : (isEditing ? "Simpan Perubahan" : "Simpan Perusahaan")}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
