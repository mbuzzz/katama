
"use client"; // AddShiftPage needs to be a client component to use hooks

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import ShiftForm from "@/components/shifts/shift-form";
import type { ShiftFormData } from "@/types/shift";
import { getMockUsersForSelect } from "@/data/shifts"; // Keep for users
import { getMockOperatingHours } from "@/data/operating-hours";
import type { OperatingHours } from "@/types/operating-hours";
import { createShiftAction } from "../actions"; // Import server action
import { Card, CardContent } from "@/components/ui/card";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

export default function AddShiftPage() {
  const [users, setUsers] = React.useState<{value: string; label: string}[]>([]);
  const [allOperatingHours, setAllOperatingHours] = React.useState<OperatingHours[]>([]);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);
    setUsers(getMockUsersForSelect());
    if (storedCompanyId) {
      setAllOperatingHours(getMockOperatingHours(storedCompanyId));
    } else {
      setAllOperatingHours([]);
    }
    setIsLoading(false);
  }, []);

  const handleSaveShift = async (data: ShiftFormData) => {
    // This function is now a client-side function that calls the server action
    if (!activeCompanyId) {
      console.error("Gagal memulai shift: ID Perusahaan aktif tidak ditemukan.");
      throw new Error("ID Perusahaan aktif tidak ditemukan.");
    }
    return createShiftAction(data, activeCompanyId);
  };
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Mulai Shift Baru" 
          description="Memuat data..." 
        />
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex justify-center items-center h-64">
            <p>Memuat...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Mulai Shift Baru" 
        description="Isi detail untuk memulai sesi kerja baru." 
      />
      <ShiftForm
        users={users}
        allOperatingHours={allOperatingHours} 
        onSave={handleSaveShift} // Pass the client-side handler
        // activeCompanyId is handled within ShiftForm now
      />
    </div>
  );
}
