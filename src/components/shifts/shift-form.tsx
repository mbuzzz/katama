
"use client";

import type { ShiftFormData } from "@/types/shift";
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
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Save, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const shiftFormSchema = z.object({
  userId: z.string().min(1, "Pengguna harus dipilih"),
  outletId: z.string().min(1, "Outlet harus dipilih"),
  initialCash: z.coerce.number().min(0, "Modal awal tidak boleh negatif"),
  notes: z.string().optional(),
});

interface UserSelectItem {
  value: string;
  label: string;
}

interface OutletSelectItem {
  value: string;
  label: string;
}

interface ShiftFormProps {
  users: UserSelectItem[];
  outlets: OutletSelectItem[];
  onSave: (data: ShiftFormData) => Promise<any>; // Allow any for now
}

export default function ShiftForm({
  users,
  outlets,
  onSave,
}: ShiftFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<ShiftFormData>({
    resolver: zodResolver(shiftFormSchema),
    defaultValues: {
      userId: "",
      outletId: "",
      initialCash: 0,
      notes: "",
    },
  });

  const onSubmit = async (data: ShiftFormData) => {
    try {
      await onSave(data);
      toast({
        title: "Shift Dimulai",
        description: `Shift untuk ${users.find(u=>u.value === data.userId)?.label || 'pengguna'} di ${outlets.find(o=>o.value === data.outletId)?.label || 'outlet'} telah dimulai.`,
      });
      router.push("/dashboard/shifts"); 
      router.refresh(); 
    } catch (error) {
      toast({
        title: "Gagal Memulai Shift",
        description: "Terjadi kesalahan saat memulai shift.",
        variant: "destructive",
      });
      console.error("Kesalahan memulai shift:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Mulai Shift Baru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="userId">Pengguna (Kasir)</Label>
            <Controller
              name="userId"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="userId">
                    <SelectValue placeholder="Pilih pengguna" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.value} value={user.value}>
                        {user.label}
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
            <Label htmlFor="outletId">Outlet</Label>
            <Controller
              name="outletId"
              control={form.control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="outletId">
                    <SelectValue placeholder="Pilih outlet" />
                  </SelectTrigger>
                  <SelectContent>
                    {outlets.map((outlet) => (
                      <SelectItem key={outlet.value} value={outlet.value}>
                        {outlet.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.outletId && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.outletId.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="initialCash">Modal Awal Kasir (Rp)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="initialCash" type="number" {...form.register("initialCash")} placeholder="Contoh: 500000" className="pl-8" />
            </div>
            {form.formState.errors.initialCash && (
              <p className="text-sm text-destructive mt-1">{form.formState.errors.initialCash.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Textarea 
              id="notes" 
              {...form.register("notes")} 
              placeholder="Catatan awal shift, jika ada."
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 border-t pt-6">
            <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {form.formState.isSubmitting ? "Menyimpan..." : "Mulai Shift"}
            </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
