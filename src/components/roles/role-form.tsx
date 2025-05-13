
"use client";

import type { Role } from "@/types/role";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const roleFormSchema = z.object({
  name: z.string().min(1, "Nama peran harus diisi"),
  description: z.string().optional(),
  // Permissions can be added here later with a more complex UI
});

export type RoleFormData = z.infer<typeof roleFormSchema>;

interface RoleFormProps {
  initialData?: Role;
  onSave: (data: RoleFormData) => Promise<Role | void>;
  isEditing?: boolean;
}

export default function RoleForm({
  initialData,
  onSave,
  isEditing = false,
}: RoleFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (data: RoleFormData) => {
    try {
      await onSave(data);
      toast({
        title: isEditing ? "Peran Diperbarui" : "Peran Ditambahkan",
        description: `Peran "${data.name}" telah berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`,
      });
      router.push("/dashboard/settings/roles"); 
      router.refresh(); 
    } catch (error: any) {
      toast({
        title: "Gagal Menyimpan",
        description: error.message || "Terjadi kesalahan saat menyimpan peran.",
        variant: "destructive",
      });
      console.error("Kesalahan penyimpanan peran:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Peran Pengguna" : "Tambah Peran Pengguna Baru"}</CardTitle>
          <CardDescription>
            {isEditing ? `Perbarui detail untuk peran "${initialData?.name}".` : "Isi detail untuk peran baru."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Peran</Label>
            <Input id="name" {...form.register("name")} placeholder="Contoh: Kasir, Manajer Outlet" />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea 
              id="description" 
              {...form.register("description")} 
              placeholder="Jelaskan secara singkat tanggung jawab atau hak akses peran ini."
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>
          {/* Placeholder for permissions editing UI */}
          {/* <div className="pt-4">
            <h3 className="text-md font-medium mb-2">Hak Akses (Segera Hadir)</h3>
            <p className="text-sm text-muted-foreground">Pengaturan hak akses detail akan tersedia di sini.</p>
          </div> */}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {form.formState.isSubmitting ? "Menyimpan..." : (isEditing ? "Simpan Perubahan" : "Simpan Peran")}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
