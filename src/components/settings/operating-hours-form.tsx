
"use client";

import type { OperatingHours, OperatingHoursFormData, DayOperatingHours, DaysOfWeek, ShiftTemplate } from "@/types/operating-hours";
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
import { Save, Clock, PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const shiftTemplateSchema = z.object({
  id: z.string().optional(), // ID can be optional for new templates
  name: z.string().min(1, "Nama template shift harus diisi."),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format jam HH:MM tidak valid."),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format jam HH:MM tidak valid."),
}).refine(data => data.closeTime > data.startTime, {
  message: "Jam selesai shift harus setelah jam mulai shift.",
  path: ["closeTime"],
});

const dayOperatingHoursSchema = z.object({
  isOpen: z.boolean(),
  openTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format jam HH:MM tidak valid.").optional(),
  closeTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Format jam HH:MM tidak valid.").optional(),
  shiftTemplates: z.array(shiftTemplateSchema).optional(),
}).refine(data => {
    if (data.isOpen) {
        return !!data.openTime && !!data.closeTime;
    }
    return true;
}, { message: "Jam buka dan tutup outlet harus diisi jika outlet buka.", path: ["openTime"] })
.refine(data => {
    if (data.isOpen && data.openTime && data.closeTime) {
        return data.closeTime > data.openTime;
    }
    return true;
}, { message: "Jam tutup outlet harus setelah jam buka outlet.", path: ["closeTime"] })
.refine(data => {
  if (data.isOpen && data.openTime && data.closeTime && data.shiftTemplates) {
    return data.shiftTemplates.every(st => 
      st.startTime >= data.openTime! && st.closeTime <= data.closeTime!
    );
  }
  return true;
}, { message: "Semua jam template shift harus berada dalam jam operasional outlet.", path: ["shiftTemplates"] });


const operatingHoursFormSchema = z.object({
  schedule: z.object(
    ALL_DAYS.reduce((acc, day) => {
      acc[day] = dayOperatingHoursSchema;
      return acc;
    }, {} as Record<DaysOfWeek, typeof dayOperatingHoursSchema>)
  ),
});


interface OperatingHoursFormProps {
  initialData?: OperatingHours; 
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
        acc[day] = { 
          isOpen: true, 
          openTime: "09:00", 
          closeTime: "21:00",
          shiftTemplates: [
            { id: `st-${day}-1`, name: "Shift Pagi", startTime: "09:00", closeTime: "15:00" },
            { id: `st-${day}-2`, name: "Shift Sore", startTime: "15:00", closeTime: "21:00" },
          ]
        };
        return acc;
      }, {} as Record<DaysOfWeek, DayOperatingHours>)
    },
  });

  const { fields: dayFields, append: appendDay, remove: removeDay } = useFieldArray({
    control: form.control,
    name: "schedule" as any, // Type assertion for nested field array names
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
      onClose(); 
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
        <CardTitle className="text-xl">Atur Jam Operasional & Shift untuk {initialData?.outletName}</CardTitle>
        <CardDescription>Tentukan jam buka-tutup outlet dan template shift standar per hari.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto p-0 pr-3">
        {ALL_DAYS.map((dayKey, dayIndex) => {
          const watchedIsOpen = form.watch(`schedule.${dayKey}.isOpen`);
          const { fields: shiftTemplateFields, append: appendShiftTemplate, remove: removeShiftTemplate } = useFieldArray({
            control: form.control,
            name: `schedule.${dayKey}.shiftTemplates`
          });

          return (
            <div key={dayKey} className="space-y-3 p-3 border rounded-md shadow-sm bg-background mb-3">
              <div className="flex items-center justify-between">
                <Label htmlFor={`schedule.${dayKey}.isOpen`} className="text-md font-semibold">{DAY_NAMES_ID[dayKey]}</Label>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">{watchedIsOpen ? "Buka" : "Tutup"}</span>
                    <Controller
                        name={`schedule.${dayKey}.isOpen`}
                        control={form.control}
                        render={({ field }) => (
                            <Switch
                            id={`schedule.${dayKey}.isOpen`}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        )}
                    />
                </div>
              </div>

              {watchedIsOpen && (
                <>
                  <div className="grid grid-cols-2 gap-3 pl-2 pt-2 border-t">
                    <div>
                      <Label htmlFor={`schedule.${dayKey}.openTime`}>Jam Buka Outlet</Label>
                      <Input
                        id={`schedule.${dayKey}.openTime`}
                        type="time"
                        {...form.register(`schedule.${dayKey}.openTime`)}
                        className="mt-1"
                      />
                      {form.formState.errors.schedule?.[dayKey]?.openTime && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.schedule?.[dayKey]?.openTime?.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor={`schedule.${dayKey}.closeTime`}>Jam Tutup Outlet</Label>
                      <Input
                        id={`schedule.${dayKey}.closeTime`}
                        type="time"
                        {...form.register(`schedule.${dayKey}.closeTime`)}
                        className="mt-1"
                      />
                      {form.formState.errors.schedule?.[dayKey]?.closeTime && (
                        <p className="text-sm text-destructive mt-1">{form.formState.errors.schedule?.[dayKey]?.closeTime?.message}</p>
                      )}
                    </div>
                  </div>
                  {form.formState.errors.schedule?.[dayKey] && !form.formState.errors.schedule?.[dayKey]?.openTime && !form.formState.errors.schedule?.[dayKey]?.closeTime && !form.formState.errors.schedule?.[dayKey]?.shiftTemplates && 'message' in form.formState.errors.schedule[dayKey]! && (
                    <p className="text-sm text-destructive mt-1">{(form.formState.errors.schedule[dayKey] as any).message}</p>
                  )}

                  <Separator className="my-3"/>
                  <div className="pl-2">
                    <h4 className="text-sm font-medium mb-2">Template Shift</h4>
                    {shiftTemplateFields.map((template, templateIndex) => (
                      <div key={template.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-end mb-2 p-2 border rounded-md bg-muted/30">
                        <div>
                          <Label htmlFor={`schedule.${dayKey}.shiftTemplates.${templateIndex}.name`} className="text-xs">Nama Shift</Label>
                          <Input {...form.register(`schedule.${dayKey}.shiftTemplates.${templateIndex}.name`)} placeholder="Cth: Pagi" className="h-8 text-xs"/>
                           {form.formState.errors.schedule?.[dayKey]?.shiftTemplates?.[templateIndex]?.name && (
                            <p className="text-xs text-destructive mt-0.5">{form.formState.errors.schedule?.[dayKey]?.shiftTemplates?.[templateIndex]?.name?.message}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor={`schedule.${dayKey}.shiftTemplates.${templateIndex}.startTime`} className="text-xs">Mulai</Label>
                          <Input type="time" {...form.register(`schedule.${dayKey}.shiftTemplates.${templateIndex}.startTime`)} className="h-8 text-xs"/>
                           {form.formState.errors.schedule?.[dayKey]?.shiftTemplates?.[templateIndex]?.startTime && (
                            <p className="text-xs text-destructive mt-0.5">{form.formState.errors.schedule?.[dayKey]?.shiftTemplates?.[templateIndex]?.startTime?.message}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor={`schedule.${dayKey}.shiftTemplates.${templateIndex}.closeTime`} className="text-xs">Selesai</Label>
                          <Input type="time" {...form.register(`schedule.${dayKey}.shiftTemplates.${templateIndex}.closeTime`)} className="h-8 text-xs"/>
                          {form.formState.errors.schedule?.[dayKey]?.shiftTemplates?.[templateIndex]?.closeTime && (
                            <p className="text-xs text-destructive mt-0.5">{form.formState.errors.schedule?.[dayKey]?.shiftTemplates?.[templateIndex]?.closeTime?.message}</p>
                          )}
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={() => removeShiftTemplate(templateIndex)} className="h-8 w-8 self-end text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => appendShiftTemplate({ id: `new-st-${Date.now()}`, name: "", startTime: form.watch(`schedule.${dayKey}.openTime`) || "09:00", closeTime: form.watch(`schedule.${dayKey}.closeTime`) || "17:00" })}>
                      <PlusCircle className="mr-2 h-4 w-4" /> Tambah Template Shift
                    </Button>
                    {form.formState.errors.schedule?.[dayKey]?.shiftTemplates && typeof form.formState.errors.schedule?.[dayKey]?.shiftTemplates === 'object' && 'message' in form.formState.errors.schedule[dayKey]!.shiftTemplates! && (
                        <p className="text-sm text-destructive mt-1">{(form.formState.errors.schedule[dayKey]!.shiftTemplates as any).message}</p>
                    )}
                  </div>
                </>
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
