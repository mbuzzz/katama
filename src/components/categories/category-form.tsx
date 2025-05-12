
"use client";

import type { Category } from "@/types/category";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const categoryFormSchema = z.object({
  name: z.string().min(1, "Nama kategori harus diisi"),
  description: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  initialData?: Category;
  onSave: (data: CategoryFormData) => Promise<Category | void>; // Allow void for add, Category for update
  isEditing?: boolean;
}

export default function CategoryForm({
  initialData,
  onSave,
  isEditing = false,
}: CategoryFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await onSave(data);
      toast({
        title: isEditing ? "Kategori Diperbarui" : "Kategori Ditambahkan",
        description: `Kategori "${data.name}" telah berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`,
      });
      router.push("/dashboard/categories"); 
      router.refresh(); // To ensure the list updates
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan kategori.",
        variant: "destructive",
      });
      console.error("Kesalahan penyimpanan:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Kategori" : "Tambah Kategori Baru"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Kategori</Label>
            <Input id="name" {...form.register("name")} placeholder="Contoh: Minuman Dingin" />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea 
              id="description" 
              {...form.register("description")} 
              placeholder="Deskripsi singkat mengenai kategori ini"
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {form.formState.isSubmitting ? "Menyimpan..." : (isEditing ? "Simpan Perubahan" : "Simpan Kategori")}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
