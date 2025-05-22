
"use client";

import type { Outlet, OutletFormData } from "@/types/outlet";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Save, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const outletFormSchema = z.object({
  name: z.string().min(3, "Nama outlet minimal 3 karakter."),
  address: z.string().min(5, "Alamat outlet minimal 5 karakter."),
  status: z.enum(["Aktif", "Tidak Aktif"], {
    required_error: "Status outlet harus dipilih.",
  }),
  manager: z.string().optional(),
});

interface OutletFormProps {
  initialData?: Outlet;
  onSave: (data: OutletFormData) => Promise<Outlet | void>;
  isEditing?: boolean;
  activeCompanyName?: string | null;
}

export default function OutletForm({
  initialData,
  onSave,
  isEditing = false,
  activeCompanyName,
}: OutletFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<OutletFormData>({
    resolver: zodResolver(outletFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      status: initialData?.status || "Aktif",
      manager: initialData?.manager || "",
    },
  });

  const onSubmit = async (data: OutletFormData) => {
    try {
      await onSave(data);
      toast({
        title: isEditing ? "Outlet Diperbarui" : "Outlet Ditambahkan",
        description: `Outlet "${data.name}" telah berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`,
      });
      router.push("/dashboard/settings/outlets"); 
      router.refresh(); 
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan data outlet.",
        variant: "destructive",
      });
      console.error("Kesalahan penyimpanan outlet:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Store className="mr-2 h-6 w-6 text-primary" />
            {isEditing ? `Edit Outlet "${initialData?.name}"` : `Tambah Outlet Baru untuk ${activeCompanyName || 'Perusahaan Aktif'}`}
          </CardTitle>
          <CardDescription>
            {isEditing ? "Perbarui detail untuk outlet ini." : "Isi detail untuk outlet baru."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Outlet</Label>
            <Input id="name" {...form.register("name")} placeholder="Contoh: Outlet Pusat, Cabang Sudirman"/>
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="address">Alamat Outlet</Label>
            <Textarea 
              id="address" 
              {...form.register("address")} 
              placeholder="Masukkan alamat lengkap outlet"
              rows={3}
            />
            {form.formState.errors.address && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.address.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status Outlet</Label>
              <Controller
                name="status"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Pilih status outlet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Tidak Aktif">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.status && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.status.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="manager">Nama Manajer (Opsional)</Label>
              <Input id="manager" {...form.register("manager")} placeholder="Nama manajer outlet"/>
              {form.formState.errors.manager && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.manager.message}</p>
              )}
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/settings/outlets")}>
              Batal
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting ? "Menyimpan..." : (isEditing ? "Simpan Perubahan" : "Simpan Outlet")}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
