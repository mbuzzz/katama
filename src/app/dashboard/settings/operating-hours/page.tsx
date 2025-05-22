
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import type { Outlet } from "@/types/outlet"; // Import tipe Outlet terpusat
import { getMockOutlets } from "@/data/outlets"; // Import fungsi data outlet terpusat
import type { OperatingHours, OperatingHoursFormData, DayOperatingHours, ShiftTemplate } from "@/types/operating-hours";
import { ALL_DAYS, DAY_NAMES_ID } from "@/types/operating-hours";
import { getMockOperatingHoursByOutletId, upsertMockOperatingHours } from "@/data/operating-hours";
import OperatingHoursForm from "@/components/settings/operating-hours-form";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function OperatingHoursSettingsPage() {
  const [outletsForCompany, setOutletsForCompany] = React.useState<Outlet[]>([]);
  const [operatingHoursMap, setOperatingHoursMap] = React.useState<Record<string, OperatingHours | undefined>>({});
  const [showFormDialog, setShowFormDialog] = React.useState(false);
  const [selectedOperatingHours, setSelectedOperatingHours] = React.useState<OperatingHours | undefined>(undefined);
  const [activeAccordionItem, setActiveAccordionItem] = React.useState<string | undefined>(undefined);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const { toast } = useToast();

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
  }, []);

  React.useEffect(() => {
    setIsLoading(true);
    if (activeCompanyId) {
      const fetchedOutlets = getMockOutlets(activeCompanyId);
      setOutletsForCompany(fetchedOutlets);
      const hoursMap: Record<string, OperatingHours | undefined> = {};
      fetchedOutlets.forEach(outlet => {
        hoursMap[outlet.id] = getMockOperatingHoursByOutletId(outlet.id);
      });
      setOperatingHoursMap(hoursMap);
      if (fetchedOutlets.length > 0 && !activeAccordionItem) { // Only set default if no accordion item is active
        setActiveAccordionItem(`outlet-${fetchedOutlets[0].id}`);
      } else if (fetchedOutlets.length === 0) {
        setActiveAccordionItem(undefined); // Close accordion if no outlets
      }
    } else {
      setOutletsForCompany([]);
      setOperatingHoursMap({});
      setActiveAccordionItem(undefined);
    }
    setIsLoading(false);
  }, [activeCompanyId, activeAccordionItem]); // Rerun if activeAccordionItem changes (e.g. user closes all)


  const handleOpenFormDialog = (outletId: string) => {
    const outlet = outletsForCompany.find(o => o.id === outletId);
    const hours = getMockOperatingHoursByOutletId(outletId); // This function should also be company-aware if it isn't already
    
    if (!outlet) {
        toast({ title: "Error", description: "Outlet tidak ditemukan.", variant: "destructive"});
        return;
    }

    setSelectedOperatingHours({
        id: hours?.id || `ophr-${outletId}`,
        outletId: outletId,
        outletName: outlet.name,
        schedule: hours?.schedule || ALL_DAYS.reduce((acc, day) => {
                acc[day] = { isOpen: true, openTime: "09:00", closeTime: "17:00", shiftTemplates: [] };
                return acc;
            }, {} as Record<string, DayOperatingHours>)
    });
    setShowFormDialog(true);
  };

  const handleSaveOperatingHours = async (outletId: string, data: OperatingHoursFormData) => {
    try {
      const updatedHours = upsertMockOperatingHours(outletId, data); // This function should also be company-aware
      if (updatedHours) {
        setOperatingHoursMap(prev => ({ ...prev, [outletId]: updatedHours }));
         // Find the companyId for the outlet to refresh its specific operating hours
        const outlet = outletsForCompany.find(o => o.id === outletId);
        if (outlet?.companyId) {
            // Potentially re-fetch or update specific parts, for now, a general map update is fine
        }
      } else {
        throw new Error("Gagal menyimpan data jam operasional.");
      }
    } catch (error) {
      console.error("Error saving operating hours:", error);
      throw error; 
    }
  };
  
  const formatTime = (timeStr: string | undefined) => {
    if (!timeStr) return '-';
    const [hours, minutes] = timeStr.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }

  if (isLoading) {
    return (
      <div>
        <PageHeader 
          title="Pengaturan Jam Operasional & Shift" 
          description="Memuat data..." 
        />
        <Card className="shadow-xl">
          <CardContent className="pt-6 flex justify-center items-center h-64">
            <p>Memuat...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Pengaturan Jam Operasional & Shift" 
        description="Kelola jam buka-tutup dan template shift standar untuk setiap outlet perusahaan yang aktif." 
      />
      
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle>Daftar Outlet & Jadwalnya</CardTitle>
          {!activeCompanyId ? (
            <CardDescription>Pilih perusahaan aktif terlebih dahulu untuk mengatur jam operasional.</CardDescription>
          ) : outletsForCompany.length === 0 ? (
            <CardDescription>Belum ada outlet yang terdaftar untuk perusahaan ini. Tambahkan outlet terlebih dahulu.</CardDescription>
          ) : (
            <CardDescription>Klik pada outlet untuk melihat detail dan mengatur jam operasional serta template shift.</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {!activeCompanyId && (
            <p className="text-center text-muted-foreground py-10">Silakan pilih perusahaan aktif dari menu dropdown di header.</p>
          )}
          {activeCompanyId && outletsForCompany.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground py-10">Perusahaan ini belum memiliki outlet. Tambahkan outlet di menu Pengaturan &gt; Outlet.</p>
          )}
          {activeCompanyId && outletsForCompany.length > 0 && (
            <Accordion 
              type="single" 
              collapsible 
              className="w-full space-y-2"
              value={activeAccordionItem}
              onValueChange={setActiveAccordionItem}
            >
              {outletsForCompany.map((outlet) => {
                const currentHours = operatingHoursMap[outlet.id];
                return (
                  <AccordionItem value={`outlet-${outlet.id}`} key={outlet.id} className="border bg-card rounded-lg shadow-md overflow-hidden">
                    <AccordionTrigger className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2 pr-2">
                          <div className="text-left">
                              <h3 className="text-lg font-semibold text-primary">{outlet.name}</h3>
                              <p className="text-xs text-muted-foreground">{outlet.address}</p>
                          </div>
                          <Button asChild size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handleOpenFormDialog(outlet.id);}} className="mt-2 sm:mt-0 shrink-0">
                            <span className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" /> Atur Jadwal
                            </span>
                          </Button>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 bg-muted/20">
                      {currentHours ? (
                        <div className="space-y-3">
                          {ALL_DAYS.map(dayKey => {
                            const daySchedule = currentHours.schedule[dayKey];
                            return (
                              <div key={dayKey} className="p-3 border rounded-md bg-background shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                  <p className="font-medium">{DAY_NAMES_ID[dayKey]}</p>
                                  {daySchedule.isOpen ? (
                                    <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-primary-foreground">Buka</Badge>
                                  ) : (
                                    <Badge variant="destructive">Tutup</Badge>
                                  )}
                                </div>
                                {daySchedule.isOpen && (
                                  <>
                                    <p className="text-sm text-muted-foreground tabular-nums">
                                      <Clock className="inline h-3 w-3 mr-1" />
                                      Outlet: {formatTime(daySchedule.openTime)} - {formatTime(daySchedule.closeTime)}
                                    </p>
                                    {daySchedule.shiftTemplates && daySchedule.shiftTemplates.length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-dashed">
                                        <p className="text-xs font-medium text-muted-foreground mb-1">Template Shift:</p>
                                        <ul className="space-y-1">
                                          {daySchedule.shiftTemplates.map(st => (
                                            <li key={st.id} className="text-xs pl-2 tabular-nums">
                                              - {st.name}: {formatTime(st.startTime)} - {formatTime(st.closeTime)}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                    {(!daySchedule.shiftTemplates || daySchedule.shiftTemplates.length === 0) && (
                                        <p className="text-xs text-muted-foreground mt-1 pl-2">- Belum ada template shift.</p>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-4">Jam operasional & shift belum diatur untuk outlet ini.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <Dialog open={showFormDialog} onOpenChange={setShowFormDialog}>
        <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
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
