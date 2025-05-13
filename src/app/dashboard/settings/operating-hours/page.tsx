
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger, // Not used directly if button opens dialog programmatically
} from "@/components/ui/dialog";
import type { Outlet } from "@/app/dashboard/settings/outlets/page"; // Assuming Outlet type is exported
import { mockOutlets } from "@/app/dashboard/settings/outlets/page";
import type { OperatingHours, OperatingHoursFormData, DayOperatingHours } from "@/types/operating-hours";
import { ALL_DAYS, DAY_NAMES_ID } from "@/types/operating-hours";
import { getMockOperatingHoursByOutletId, upsertMockOperatingHours } from "@/data/operating-hours";
import OperatingHoursForm from "@/components/settings/operating-hours-form";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function OperatingHoursSettingsPage() {
  const [outlets, setOutlets] = React.useState<Outlet[]>([]);
  const [operatingHoursMap, setOperatingHoursMap] = React.useState<Record<string, OperatingHours | undefined>>({});
  const [showFormDialog, setShowFormDialog] = React.useState(false);
  const [selectedOperatingHours, setSelectedOperatingHours] = React.useState<OperatingHours | undefined>(undefined);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchedOutlets = mockOutlets; // In a real app, fetch from API
    setOutlets(fetchedOutlets);
    const hoursMap: Record<string, OperatingHours | undefined> = {};
    fetchedOutlets.forEach(outlet => {
      hoursMap[outlet.id] = getMockOperatingHoursByOutletId(outlet.id);
    });
    setOperatingHoursMap(hoursMap);
  }, []);

  const handleOpenFormDialog = (outletId: string) => {
    const hours = getMockOperatingHoursByOutletId(outletId);
    setSelectedOperatingHours(hours);
    setShowFormDialog(true);
  };

  const handleSaveOperatingHours = async (outletId: string, data: OperatingHoursFormData) => {
    try {
      const updatedHours = upsertMockOperatingHours(outletId, data);
      if (updatedHours) {
        setOperatingHoursMap(prev => ({ ...prev, [outletId]: updatedHours }));
        // toast({ title: "Sukses", description: "Jam operasional berhasil diperbarui." }); // Toast handled in form
      } else {
        throw new Error("Gagal menyimpan data jam operasional.");
      }
    } catch (error) {
      console.error("Error saving operating hours:", error);
      // toast({ title: "Error", description: "Gagal menyimpan jam operasional.", variant: "destructive" }); // Toast handled in form
      throw error; // Re-throw for form to handle
    }
  };
  
  const formatTime = (timeStr: string | undefined) => {
    if (!timeStr) return '-';
    const [hours, minutes] = timeStr.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  return (
    <div>
      <PageHeader 
        title="Pengaturan Jam Operasional" 
        description="Kelola jam buka dan tutup untuk setiap outlet Anda." 
      />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Outlet & Jam Operasional</CardTitle>
          <CardDescription>Pilih outlet untuk mengatur jam operasionalnya.</CardDescription>
        </CardHeader>
        <CardContent>
          {outlets.length === 0 && (
            <p className="text-center text-muted-foreground py-10">Belum ada outlet yang terdaftar.</p>
          )}
          <div className="space-y-6">
            {outlets.map((outlet) => {
              const currentHours = operatingHoursMap[outlet.id];
              return (
                <Card key={outlet.id} className="shadow-md overflow-hidden">
                  <CardHeader className="bg-muted/30">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <CardTitle className="text-xl">{outlet.name}</CardTitle>
                      <Button size="sm" variant="outline" onClick={() => handleOpenFormDialog(outlet.id)}>
                        <Edit className="mr-2 h-4 w-4" /> Atur Jam Operasional
                      </Button>
                    </div>
                    <CardDescription>{outlet.address}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {currentHours ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
                        {ALL_DAYS.map(dayKey => {
                          const daySchedule = currentHours.schedule[dayKey];
                          return (
                            <div key={dayKey} className="p-2 border rounded-md bg-background">
                              <p className="font-semibold text-center border-b pb-1 mb-1">{DAY_NAMES_ID[dayKey]}</p>
                              {daySchedule.isOpen ? (
                                <div className="text-center">
                                   <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-primary-foreground mb-1 w-full justify-center">Buka</Badge>
                                  <p className="text-xs tabular-nums">
                                    {formatTime(daySchedule.openTime)} - {formatTime(daySchedule.closeTime)}
                                  </p>
                                </div>
                              ) : (
                                <div className="text-center">
                                  <Badge variant="destructive" className="w-full justify-center">Tutup</Badge>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Jam operasional belum diatur.</p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl">
          {/* OperatingHoursForm will be rendered here */}
          {selectedOperatingHours && (
            <OperatingHoursForm 
              initialData={selectedOperatingHours}
              onSave={handleSaveOperatingHours}
              onClose={() => setShowFormDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
