
"use client";

import type { User, UserFormData } from "@/types/user";
import type { Role } from "@/types/role";
import type { Outlet } from "@/app/dashboard/settings/outlets/page"; // Impor tipe Outlet
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Save, UserPlus, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const userFormSchema = z.object({
  name: z.string().min(3, "Nama pengguna minimal 3 karakter."),
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Password minimal 6 karakter.").optional(),
  confirmPassword: z.string().optional(),
  role: z.string().min(1, "Peran harus dipilih."),
  outletId: z.string().min(1, "Outlet default harus dipilih."),
}).refine(data => {
    // Jika password diisi (untuk pengguna baru), confirmPassword juga harus diisi dan cocok
    if (data.password && data.password !== data.confirmPassword) {
        return false;
    }
    return true;
}, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirmPassword"], // Path error ditujukan ke field confirmPassword
});


interface UserFormProps {
  initialData?: User; // Untuk mode edit di masa depan
  roles: Role[];
  outlets: Outlet[]; // Menerima daftar outlet yang sudah difilter untuk perusahaan aktif
  activeCompanyName: string | null;
  onSave: (data: UserFormData) => Promise<User | void>;
  isEditing?: boolean;
}

export default function UserForm({
  initialData,
  roles,
  outlets,
  activeCompanyName,
  onSave,
  isEditing = false,
}: UserFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      password: "",
      confirmPassword: "",
      role: initialData?.role || "", // Role name, bukan ID untuk mock
      outletId: outlets.find(o => o.name === initialData?.outlet)?.id || "", // Cari outletId dari nama outlet
    },
  });

  // Validasi tambahan untuk memastikan password diisi jika pengguna baru
  if (!isEditing) {
    userFormSchema.extend({
        password: z.string().min(6, "Password minimal 6 karakter."),
    });
  }


  const onSubmit = async (data: UserFormData) => {
    try {
      await onSave(data);
      toast({
        title: isEditing ? "Pengguna Diperbarui" : "Pengguna Ditambahkan",
        description: `Pengguna "${data.name}" telah berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'} untuk perusahaan ${activeCompanyName}.`,
      });
      router.push("/dashboard/settings/users"); 
      router.refresh(); 
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan data pengguna.",
        variant: "destructive",
      });
      console.error("Kesalahan penyimpanan pengguna:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-6 w-6 text-primary" />
            {isEditing ? "Edit Pengguna" : `Tambah Pengguna Baru untuk ${activeCompanyName}`}
          </CardTitle>
          <CardDescription>
            {isEditing ? `Perbarui detail untuk pengguna "${initialData?.name}".` : "Isi detail untuk pengguna baru."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" {...form.register("name")} placeholder="Contoh: John Doe"/>
            {form.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Alamat Email</Label>
            <Input id="email" type="email" {...form.register("email")} placeholder="contoh@email.com"/>
            {form.formState.errors.email && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="password">{isEditing ? "Password Baru (Opsional)" : "Password"}</Label>
              <div className="relative">
                <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    {...form.register("password")} 
                    placeholder="Minimal 6 karakter"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">{isEditing ? "Konfirmasi Password Baru" : "Konfirmasi Password"}</Label>
               <div className="relative">
                <Input 
                    id="confirmPassword" 
                    type={showConfirmPassword ? "text" : "password"} 
                    {...form.register("confirmPassword")} 
                    placeholder="Ulangi password"
                />
                 <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.confirmPassword.message}</p>
              )}
            </div>
          </div>


          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Peran Pengguna</Label>
              <Controller
                name="role"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Pilih peran" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.filter(role => role.name !== "Super Admin").map((role) => ( // Super Admin tidak dipilih dari sini
                        <SelectItem key={role.id} value={role.name}> 
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.role && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.role.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="outletId">Outlet Default</Label>
              <Controller
                name="outletId"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={outlets.length === 0}>
                    <SelectTrigger id="outletId">
                      <SelectValue placeholder={outlets.length > 0 ? "Pilih outlet default" : "Tidak ada outlet untuk perusahaan ini"} />
                    </SelectTrigger>
                    <SelectContent>
                      {outlets.map((outlet) => (
                        <SelectItem key={outlet.id} value={outlet.id}>
                          {outlet.name}
                        </SelectItem>
                      ))}
                      {outlets.length === 0 && <p className="p-2 text-sm text-muted-foreground">Perusahaan ini belum memiliki outlet.</p>}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.outletId && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.outletId.message}</p>
              )}
               {outlets.length === 0 && <p className="text-xs text-muted-foreground mt-1">Anda perlu menambah outlet untuk perusahaan ini terlebih dahulu.</p>}
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/settings/users")}>
              Batal
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting || (outlets.length === 0 && !isEditing) }>
              <Save className="mr-2 h-4 w-4" />
              {form.formState.isSubmitting ? "Menyimpan..." : (isEditing ? "Simpan Perubahan" : "Simpan Pengguna")}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
