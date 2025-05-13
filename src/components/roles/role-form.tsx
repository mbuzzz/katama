
"use client";

import type { Role, RolePermission } from "@/types/role";
import { availableFeatures, permissionActions, permissionLabels, type PermissionAction } from "@/types/role";
import React from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, ShieldQuestion } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const permissionSchema = z.object({
  feature: z.string(),
  create: z.boolean().default(false),
  read: z.boolean().default(false),
  update: z.boolean().default(false),
  delete: z.boolean().default(false),
});

const roleFormSchema = z.object({
  name: z.string().min(1, "Nama peran harus diisi"),
  description: z.string().optional(),
  permissions: z.array(permissionSchema).optional(),
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
  
  const defaultPermissions = React.useMemo(() => {
    return availableFeatures.map(feature => {
      const existingPerm = initialData?.permissions?.find(p => p.feature === feature.key);
      return {
        feature: feature.key,
        create: existingPerm?.create || false,
        read: existingPerm?.read || false,
        update: existingPerm?.update || false,
        delete: existingPerm?.delete || false,
      };
    });
  }, [initialData?.permissions]);

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      permissions: defaultPermissions,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "permissions",
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
            {isEditing ? `Perbarui detail dan hak akses untuk peran "${initialData?.name}".` : "Isi detail dan hak akses untuk peran baru."}
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
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldQuestion className="mr-2 h-5 w-5 text-primary" />
            Hak Akses Peran
          </CardTitle>
          <CardDescription>Atur hak akses untuk setiap fitur dalam sistem.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-500px)] md:h-[400px] pr-3"> {/* Adjust height as needed */}
            <div className="space-y-4">
              {fields.map((field, index) => {
                const featureInfo = availableFeatures.find(f => f.key === field.feature);
                if (!featureInfo) return null;

                return (
                  <div key={field.id} className="p-4 border rounded-md shadow-sm bg-muted/20">
                    <h4 className="font-semibold text-md mb-1">{featureInfo.name}</h4>
                    {featureInfo.description && <p className="text-xs text-muted-foreground mb-3">{featureInfo.description}</p>}
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
                      {permissionActions.map(action => (
                        <div key={action} className="flex items-center space-x-2">
                          <Controller
                            name={`permissions.${index}.${action}`}
                            control={form.control}
                            render={({ field: controllerField }) => (
                              <Checkbox
                                id={`${field.feature}-${action}`}
                                checked={controllerField.value}
                                onCheckedChange={controllerField.onChange}
                              />
                            )}
                          />
                          <Label htmlFor={`${field.feature}-${action}`} className="text-sm font-normal cursor-pointer">
                            {permissionLabels[action]}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {form.formState.errors.permissions?.[index] && (
                      <p className="text-sm text-destructive mt-2">
                        Error pada pengaturan hak akses {featureInfo.name}.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <CardFooter className="flex justify-end space-x-2 border-t pt-6 mt-6 bg-background sticky bottom-0 py-4 z-10">
          <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {form.formState.isSubmitting ? "Menyimpan..." : (isEditing ? "Simpan Perubahan" : "Simpan Peran")}
          </Button>
      </CardFooter>
    </form>
  );
}
