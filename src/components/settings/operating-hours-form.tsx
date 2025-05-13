
"use client";

import type { OperatingHours, OperatingHoursFormData, DayOperatingHours, DaysOfWeek } from "@/types/operating-hours";
import { ALL_DAYS, DAY_NAMES_ID } from "@/types/operating-hours";
import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Save, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const dayOperatingHoursSchema = z.object({
  isOpen: z.boolean(),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format HH:MM").optional(),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format HH:MM").optional(),
}).refine(data => {
    if (data.isOpen) {
        return !!data.openTime && !!data.closeTime;
    }
    return true;
}, { message: "Jam buka dan tutup harus diisi jika outlet buka", path: ["openTime"] }) // Path can be improved if needed
.refine(data => {
    if (data.isOpen && data.openTime && data.closeTime) {
        return data.closeTime > data.openTime;
    }
    return true;
}, { message: "Jam tutup harus setelah jam buka", path: ["closeTime"] });


const operatingHoursFormSchema = z.object({
  schedule: z.object(
    ALL_DAYS.reduce((acc, day) => {
      acc[day] = dayOperatingHoursSchema;
      return acc;
    }, {} as Record<DaysOfWeek, typeof dayOperatingHoursSchema>)
  ),
});


interface OperatingHoursFormProps {
  initialData?: OperatingHours; // This includes outletId and outletName
  onSave: (outletId: string, data: OperatingHoursFormData) => Promise<OperatingHours | void>;
  onClose: () => void;
}

export default function OperatingHoursForm({
  initialData,
  onSave,
  onClose,
}: OperatingHoursFormProps) {
  const { toast } = useToast();
  
  const form = useForm<OperatingHoursFormData>({
    resolver: zodResolver(operatingHoursFormSchema),
    defaultValues: {
      schedule: initialData?.schedule || ALL_DAYS.reduce((acc, day) => {
        acc[day] = { isOpen: true, openTime: "09:00", closeTime: "17:00" };
        return acc;
      }, {} as Record<DaysOfWeek, DayOperatingHours>)
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({ schedule: initialData.schedule });
    }
  }, [initialData, form]);

  const onSubmit = async (data: OperatingHoursFormData) => {
    if (!initialData?.outletId) {
        toast({ title: "Error", description: "Outlet ID tidak ditemukan.", variant: "destructive" });
        return;
    }
    try {
      await onSave(initialData.outletId, data);
      toast({
        title: "Jam Operasional Diperbarui",
        description: `Jam operasional untuk ${initialData.outletName || 'outlet'} telah berhasil diperbarui.`,
      });
      onClose(); // Close the dialog/form
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan jam operasional.",
        variant: "destructive",
      });
      console.error("Kesalahan penyimpanan jam operasional:", error);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Atur Jam Operasional untuk {initialData?.outletName}</CardTitle>
        <CardDescription>Tentukan jam buka dan tutup untuk setiap hari.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto p-0 pr-2">
        {ALL_DAYS.map((day) => {
          const watchedIsOpen = form.watch(`schedule.${day}.isOpen`);
          return (
            <div key={day} className="space-y-3 p-3 border rounded-md shadow-sm bg-muted/20">
              <div className="flex items-center justify-between">
                <Label htmlFor={`schedule.${day}.isOpen`} className="text-md font-semibold">{DAY_NAMES_ID[day]}</Label>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{watchedIsOpen ? "Buka" : "Tutup"}</span>
                    <Controller
                        name={`schedule.${day}.isOpen`}
                        control={form.control}
                        render={({ field }) => (
                            <Switch
                            id={`schedule.${day}.isOpen`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        )}
                    />
                </div>
              </div>

              {watchedIsOpen && (
                <div className="grid grid-cols-2 gap-3 pl-2 pt-2 border-t">
                  <div>
                    <Label htmlFor={`schedule.${day}.openTime`}>Jam Buka</Label>
                    <Input
                      id={`schedule.${day}.openTime`}
                      type="time"
                      {...form.register(`schedule.${day}.openTime`)}
                      className="mt-1"
                    />
                    {form.formState.errors.schedule?.[day]?.openTime && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.schedule?.[day]?.openTime?.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`schedule.${day}.closeTime`}>Jam Tutup</Label>
                    <Input
                      id={`schedule.${day}.closeTime`}
                      type="time"
                      {...form.register(`schedule.${day}.closeTime`)}
                      className="mt-1"
                    />
                    {form.formState.errors.schedule?.[day]?.closeTime && (
                      <p className="text-sm text-destructive mt-1">{form.formState.errors.schedule?.[day]?.closeTime?.message}</p>
                    )}
                  </div>
                </div>
              )}
              {form.formState.errors.schedule?.[day] && !form.formState.errors.schedule?.[day]?.openTime && !form.formState.errors.schedule?.[day]?.closeTime && 'message' in form.formState.errors.schedule[day]! && (
                 <p className="text-sm text-destructive mt-1">{(form.formState.errors.schedule[day] as any).message}</p>
              )}
            </div>
          );
        })}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 pt-6 px-0 pb-0">
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Jam Operasional"}
        </Button>
      </CardFooter>
    </form>
  );
}
