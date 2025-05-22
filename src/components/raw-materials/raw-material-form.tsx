
"use client";

import type { RawMaterial } from "@/types/raw-material";
import type { Unit } from "@/types/unit";
import React, { useEffect, useState } from "react"; // Import useState and useEffect
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getMockUnits } from "@/data/units"; // To fetch units based on company

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

const rawMaterialFormSchema = z.object({
  name: z.string().min(1, "Nama bahan baku harus diisi"),
  unitId: z.string().min(1, "Satuan bahan baku harus dipilih"),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif"),
  costPerUnit: z.coerce.number().min(0, "Biaya per unit tidak boleh negatif").optional(),
});

export type RawMaterialFormData = z.infer<typeof rawMaterialFormSchema>;

interface RawMaterialFormProps {
  initialData?: RawMaterial;
  onSave: (data: RawMaterialFormData) => Promise<RawMaterial | void>;
  isEditing?: boolean;
}

export default function RawMaterialForm({
  initialData,
  onSave,
  isEditing = false,
}: RawMaterialFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [companyUnits, setCompanyUnits] = useState<Unit[]>([]);
  const [isLoadingUnits, setIsLoadingUnits] = useState(true);
  
  useEffect(() => {
    const activeCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    if (activeCompanyId) {
      setCompanyUnits(getMockUnits(activeCompanyId));
    } else {
      setCompanyUnits([]); // No active company, no units
    }
    setIsLoadingUnits(false);
  }, []);
  
  const form = useForm<RawMaterialFormData>({
    resolver: zodResolver(rawMaterialFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      unitId: initialData?.unitId || "",
      stock: initialData?.stock || 0,
      costPerUnit: initialData?.costPerUnit || undefined,
    },
  });
  
  // Update default unitId if initialData and companyUnits are loaded
  useEffect(() => {
    if (initialData?.unitId && companyUnits.length > 0) {
        // Check if the initial unitId is valid for the current company
        if (companyUnits.some(u => u.id === initialData.unitId)) {
            form.setValue("unitId", initialData.unitId);
        } else {
            // If not valid (e.g. company changed), clear it or set to first available
            form.setValue("unitId", ""); 
        }
    }
  }, [initialData, companyUnits, form]);


  const onSubmit = async (data: RawMaterialFormData) => {
    try {
      await onSave(data);
      toast({
        title: isEditing ? "Bahan Baku Diperbarui" : "Bahan Baku Ditambahkan",
        description: `Bahan baku "${data.name}" telah berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`,
      });
      router.push("/dashboard/raw-materials"); 
      router.refresh(); 
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan bahan baku.",
        variant: "destructive",
      });
      console.error("Kesalahan penyimpanan:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Bahan Baku" : "Tambah Bahan Baku Baru"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Bahan Baku</Label>
            <Input id="name" {...form.register("name")} placeholder="Contoh: Tepung Terigu" />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="unitId">Satuan</Label>
            <Controller
              name="unitId"
              control={form.control}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value} // Ensure value is controlled
                  disabled={isLoadingUnits || companyUnits.length === 0}
                >
                  <SelectTrigger id="unitId">
                    <SelectValue placeholder={isLoadingUnits ? "Memuat satuan..." : (companyUnits.length === 0 ? "Tidak ada satuan untuk perusahaan ini" : "Pilih satuan")} />
                  </SelectTrigger>
                  <SelectContent>
                    {!isLoadingUnits && companyUnits.length > 0 && companyUnits.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.name} ({unit.abbreviation})
                      </SelectItem>
                    ))}
                     {!isLoadingUnits && companyUnits.length === 0 && (
                        <div className="p-2 text-sm text-muted-foreground">Tidak ada satuan terdaftar untuk perusahaan ini. Tambahkan di menu Satuan Barang.</div>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.unitId && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.unitId.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="stock">Stok Saat Ini</Label>
            <Input id="stock" type="number" {...form.register("stock")} placeholder="Contoh: 100" />
            {form.formState.errors.stock && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.stock.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="costPerUnit">Biaya per Satuan (Opsional)</Label>
            <Input id="costPerUnit" type="number" {...form.register("costPerUnit")} placeholder="Contoh: 5000" />
            <p className="text-xs text-muted-foreground mt-1">Digunakan untuk perhitungan HPP produk.</p>
            {form.formState.errors.costPerUnit && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.costPerUnit.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting || isLoadingUnits}>
            <Save className="mr-2 h-4 w-4" />
            {form.formState.isSubmitting ? "Menyimpan..." : (isEditing ? "Simpan Perubahan" : "Simpan Bahan Baku")}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
