
"use client";

import type { Unit } from "@/types/unit";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const unitFormSchema = z.object({
  name: z.string().min(1, "Nama satuan harus diisi"),
  abbreviation: z.string().min(1, "Singkatan harus diisi"),
});

export type UnitFormData = z.infer<typeof unitFormSchema>;

interface UnitFormProps {
  initialData?: Unit;
  onSave: (data: UnitFormData) => Promise<Unit | void>;
  isEditing?: boolean;
}

export default function UnitForm({
  initialData,
  onSave,
  isEditing = false,
}: UnitFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      abbreviation: initialData?.abbreviation || "",
    },
  });

  const onSubmit = async (data: UnitFormData) => {
    try {
      await onSave(data);
      toast({
        title: isEditing ? "Satuan Diperbarui" : "Satuan Ditambahkan",
        description: `Satuan "${data.name}" telah berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`,
      });
      router.push("/dashboard/units"); 
      router.refresh(); 
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan satuan.",
        variant: "destructive",
      });
      console.error("Kesalahan penyimpanan satuan:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Satuan" : "Tambah Satuan Baru"}</CardTitle>
          <CardDescription>
            {isEditing ? `Perbarui detail untuk satuan "${initialData?.name}".` : "Isi detail untuk satuan barang baru."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Satuan</Label>
            <Input id="name" {...form.register("name")} placeholder="Contoh: Kilogram, Liter" />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="abbreviation">Singkatan</Label>
            <Input 
              id="abbreviation" 
              {...form.register("abbreviation")} 
              placeholder="Contoh: kg, L, pcs"
            />
            {form.formState.errors.abbreviation && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.abbreviation.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {form.formState.isSubmitting ? "Menyimpan..." : (isEditing ? "Simpan Perubahan" : "Simpan Satuan")}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
