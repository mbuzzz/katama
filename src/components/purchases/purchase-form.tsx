
"use client";

import type { PurchaseFormData } from "@/types/purchase";
import type { RawMaterial } from "@/types/raw-material";
import type { Unit } from "@/types/unit";
import type { User } from "@/types/user";
import React from "react";
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
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Save, Truck, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getMockUnitById } from "@/data/units"; // To get unit details

const purchaseFormSchema = z.object({
  rawMaterialId: z.string().min(1, "Bahan baku harus dipilih."),
  quantity: z.coerce.number().min(0.001, "Jumlah harus lebih besar dari 0."),
  price: z.coerce.number().min(0, "Harga satuan tidak boleh negatif."),
  outlet: z.string().min(1, "Nama outlet harus diisi."),
  userId: z.string().min(1, "Pengguna harus dipilih."),
  supplier: z.string().optional(),
});

interface PurchaseFormProps {
  rawMaterialsForCompany: RawMaterial[];
  users: User[]; // Assuming User type has id and name
  onSave: (data: PurchaseFormData) => Promise<any>; // Server action
  // initialData and isEditing can be added for edit functionality later
}

export default function PurchaseForm({
  rawMaterialsForCompany,
  users,
  onSave,
}: PurchaseFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedUnitAbbreviation, setSelectedUnitAbbreviation] = React.useState<string>("");

  const form = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseFormSchema),
    defaultValues: {
      rawMaterialId: "",
      quantity: 0,
      price: 0,
      outlet: "", // TODO: Could be prefilled if company has a default/single outlet
      userId: "",
      supplier: "",
    },
  });

  const watchedRawMaterialId = form.watch("rawMaterialId");

  React.useEffect(() => {
    if (watchedRawMaterialId) {
      const selectedMaterial = rawMaterialsForCompany.find(rm => rm.id === watchedRawMaterialId);
      if (selectedMaterial) {
        const unit = getMockUnitById(selectedMaterial.unitId);
        setSelectedUnitAbbreviation(unit?.abbreviation || "");
      } else {
        setSelectedUnitAbbreviation("");
      }
    } else {
      setSelectedUnitAbbreviation("");
    }
  }, [watchedRawMaterialId, rawMaterialsForCompany]);

  const onSubmit = async (data: PurchaseFormData) => {
    try {
      await onSave(data);
      toast({
        title: "Pembelanjaan Ditambahkan",
        description: `Pembelanjaan untuk bahan baku telah berhasil dicatat.`,
      });
      router.push("/dashboard/purchases");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Gagal Mencatat Pembelanjaan",
        description: error.message || "Terjadi kesalahan saat menyimpan data.",
        variant: "destructive",
      });
      console.error("Kesalahan penyimpanan pembelanjaan:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="mr-2 h-6 w-6 text-primary" />
            Catat Pembelanjaan Baru
          </CardTitle>
          <CardDescription>
            Isi detail pembelanjaan bahan baku untuk perusahaan yang aktif. Stok bahan baku akan otomatis bertambah.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="rawMaterialId">Bahan Baku</Label>
            <Controller
              name="rawMaterialId"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="rawMaterialId">
                    <SelectValue placeholder="Pilih bahan baku" />
                  </SelectTrigger>
                  <SelectContent>
                    {rawMaterialsForCompany.map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} (Stok Saat Ini: {material.stock.toLocaleString('id-ID')} {getMockUnitById(material.unitId)?.abbreviation || ''})
                      </SelectItem>
                    ))}
                    {rawMaterialsForCompany.length === 0 && (
                        <p className="p-2 text-sm text-muted-foreground">Belum ada bahan baku untuk perusahaan ini.</p>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.rawMaterialId && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.rawMaterialId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="quantity">Jumlah Pembelian</Label>
                <div className="flex items-center">
                    <Input
                        id="quantity"
                        type="number"
                        step="any"
                        {...form.register("quantity")}
                        placeholder="Contoh: 10"
                        className="rounded-r-none"
                    />
                    {selectedUnitAbbreviation && (
                        <span className="px-3 py-2 h-10 border border-l-0 rounded-r-md bg-muted text-sm text-muted-foreground flex items-center">
                        {selectedUnitAbbreviation}
                        </span>
                    )}
                </div>
                {form.formState.errors.quantity && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.quantity.message}</p>
                )}
            </div>
            <div>
                <Label htmlFor="price">Harga Satuan Pembelian (Rp)</Label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="price" type="number" step="any" {...form.register("price")} placeholder="Contoh: 50000" className="pl-8"/>
                </div>
                {form.formState.errors.price && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.price.message}</p>
                )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="outlet">Nama Outlet Pembelian</Label>
            <Input id="outlet" {...form.register("outlet")} placeholder="Contoh: Outlet Pusat, Gudang Utama"/>
            {form.formState.errors.outlet && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.outlet.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="userId">Dicatat Oleh Pengguna</Label>
             <Controller
              name="userId"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="userId">
                    <SelectValue placeholder="Pilih pengguna yang mencatat" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.userId && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.userId.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="supplier">Pemasok (Opsional)</Label>
            <Input id="supplier" {...form.register("supplier")} placeholder="Nama toko atau supplier"/>
            {form.formState.errors.supplier && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.supplier.message}</p>
            )}
          </div>

        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t pt-6">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard/purchases")}>
            Batal
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Pembelanjaan"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
