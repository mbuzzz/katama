
"use client";

import * as React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import type { jsPDFDocument } from "jspdf-autotable";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Download, UserCheck, Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, isValid } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import type { Shift } from "@/types/shift";
import { getMockShifts, getMockUsersForSelect, getMockOutletsForSelect } from "@/data/shifts";
import { Badge } from "@/components/ui/badge";

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export default function ShiftReportPage() {
  const { toast } = useToast();
  const [allShifts, setAllShifts] = React.useState<Shift[]>([]);
  const [filteredShifts, setFilteredShifts] = React.useState<Shift[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [selectedUserId, setSelectedUserId] = React.useState<string>("all");
  const [selectedOutletId, setSelectedOutletId] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [isLoading, setIsLoading] = React.useState(true);

  const [usersForSelect, setUsersForSelect] = React.useState<{value: string; label: string}[]>([]);
  const [outletsForSelect, setOutletsForSelect] = React.useState<{value: string; label: string}[]>([]);
  const shiftStatuses = ["Berjalan", "Selesai", "Dibatalkan"];

  React.useEffect(() => {
    // Simulate fetching or initializing data client-side
    const shiftsData = getMockShifts();
    setAllShifts(shiftsData);
    setUsersForSelect(getMockUsersForSelect());
    setOutletsForSelect(getMockOutletsForSelect());
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (isLoading) return; // Don't filter until data is loaded
    let data = [...allShifts];

    if (dateRange?.from) {
      const from = startOfDay(dateRange.from);
      const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
      data = data.filter(shift => {
        const shiftStartDate = parseISO(shift.startTime);
        return isValid(shiftStartDate) && isWithinInterval(shiftStartDate, { start: from, end: to });
      });
    }

    if (selectedUserId !== "all") {
      data = data.filter(shift => shift.userId === selectedUserId);
    }

    if (selectedOutletId !== "all") {
      data = data.filter(shift => shift.outletId === selectedOutletId);
    }
    
    if (selectedStatus !== "all") {
      data = data.filter(shift => shift.status === selectedStatus);
    }

    setFilteredShifts(data);
  }, [dateRange, selectedUserId, selectedOutletId, selectedStatus, allShifts, isLoading]);

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "-";
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    const dateObj = parseISO(dateString);
    return isValid(dateObj) ? format(dateObj, "dd MMM yyyy, HH:mm", { locale: idLocale }) : "-";
  };
  
  const getStatusBadgeVariant = (status: Shift['status']) => {
    switch (status) {
      case 'Berjalan': return 'default';
      case 'Selesai': return 'secondary';
      case 'Dibatalkan': return 'destructive';
      default: return 'outline';
    }
  };

  const handleDownloadReport = () => {
    if (filteredShifts.length === 0) {
      toast({
        title: "Tidak Ada Data",
        description: "Tidak ada data shift untuk filter yang dipilih.",
        variant: "destructive",
      });
      return;
    }
    try {
      const doc = new jsPDF() as jsPDFWithAutoTable;
      const currentDate = format(new Date(), "dd MMMM yyyy HH:mm", { locale: idLocale });
      const reportTitle = "Laporan Shift";
      const fileName = `Laporan_Shift_${format(new Date(), "yyyyMMddHHmmss")}.pdf`;

      doc.setFontSize(18);
      doc.text(reportTitle, 14, 22);
      doc.setFontSize(10);
      doc.text(`Tanggal Laporan: ${currentDate}`, 14, 30);
      let filterInfoY = 35;
      if (dateRange?.from) {
        const fromStr = format(dateRange.from, "dd/MM/yy", { locale: idLocale });
        const toStr = dateRange.to ? format(dateRange.to, "dd/MM/yy", { locale: idLocale }) : fromStr;
        doc.text(`Periode: ${fromStr} - ${toStr}`, 14, filterInfoY);
        filterInfoY += 5;
      }
      if (selectedUserId !== "all") doc.text(`Pengguna: ${usersForSelect.find(u => u.value === selectedUserId)?.label || selectedUserId}`, 14, filterInfoY); filterInfoY +=5;
      if (selectedOutletId !== "all") doc.text(`Outlet: ${outletsForSelect.find(o => o.value === selectedOutletId)?.label || selectedOutletId}`, 14, filterInfoY); filterInfoY +=5;
      if (selectedStatus !== "all") doc.text(`Status: ${selectedStatus}`, 14, filterInfoY); filterInfoY +=5;


      const tableColumn = ["No.", "Pengguna", "Outlet", "Mulai", "Selesai", "Durasi", "Status", "Modal Awal", "Kas Akhir", "Total Sales", "Catatan"];
      const tableRows: any[][] = [];

      filteredShifts.forEach((shift, index) => {
        const shiftData = [
          index + 1,
          shift.userName || "-",
          shift.outletName || "-",
          formatDate(shift.startTime),
          formatDate(shift.endTime),
          shift.duration || "-",
          shift.status,
          formatCurrency(shift.initialCash),
          formatCurrency(shift.finalCash),
          formatCurrency(shift.totalSales),
          shift.notes || "-",
        ];
        tableRows.push(shiftData);
      });
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: filterInfoY + 2,
        theme: 'grid',
        headStyles: { fillColor: [60, 56, 91], textColor: 255, fontStyle: 'bold' },
        styles: { font: "helvetica", fontSize: 8 },
        columnStyles: {
            0: {cellWidth: 8, halign: 'center'},
            7: { halign: 'right' },
            8: { halign: 'right' },
            9: { halign: 'right' },
            10: {cellWidth: 30} // Wider column for notes
        },
        didParseCell: function (data) {
            if (data.column.dataKey === 10) { // Notes column
                // Potentially truncate or wrap text if too long for PDF cell
            }
        }
      });
      
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.text(
          `Halaman ${i} dari ${pageCount}`,
          doc.internal.pageSize.width - 28,
          doc.internal.pageSize.height - 10
        );
      }

      doc.save(fileName);
      toast({
        title: "Unduh Berhasil",
        description: `Laporan shift telah berhasil diunduh sebagai ${fileName}.`,
      });

    } catch (error) {
      console.error("Gagal membuat PDF laporan shift:", error);
      toast({
        title: "Unduh Gagal",
        description: "Terjadi kesalahan saat membuat laporan PDF.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Laporan Shift" description="Analisis detail aktivitas shift pengguna." />
        <div className="flex justify-center items-center h-64">
          <p>Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Laporan Shift" description="Analisis detail aktivitas shift pengguna.">
        <Button variant="outline" onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" /> Unduh Laporan PDF
        </Button>
      </PageHeader>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5"/> Filter Laporan Shift</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="date-range">Rentang Tanggal</Label>
            <DatePickerWithRange 
              className="mt-1"
              date={dateRange}
              onDateChange={setDateRange} 
            />
          </div>
          <div>
            <Label htmlFor="user-filter">Pengguna (Kasir)</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger id="user-filter" className="mt-1">
                <SelectValue placeholder="Semua Pengguna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pengguna</SelectItem>
                {usersForSelect.map(user => (
                  <SelectItem key={user.value} value={user.value}>{user.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="outlet-filter">Outlet</Label>
            <Select value={selectedOutletId} onValueChange={setSelectedOutletId}>
              <SelectTrigger id="outlet-filter" className="mt-1">
                <SelectValue placeholder="Semua Outlet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Outlet</SelectItem>
                 {outletsForSelect.map(outlet => (
                  <SelectItem key={outlet.value} value={outlet.value}>{outlet.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="status-filter">Status Shift</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status-filter" className="mt-1">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                 {shiftStatuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detail Laporan Shift</CardTitle>
          <CardDescription>Menampilkan {filteredShifts.length} data shift.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pengguna</TableHead>
                <TableHead>Outlet</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead>Selesai</TableHead>
                <TableHead className="hidden sm:table-cell">Durasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Modal Awal</TableHead>
                <TableHead className="text-right hidden md:table-cell">Kas Akhir</TableHead>
                <TableHead className="text-right hidden md:table-cell">Total Penjualan</TableHead>
                <TableHead className="hidden lg:table-cell">Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShifts.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
                    Tidak ada data shift yang cocok dengan filter yang dipilih.
                  </TableCell>
                </TableRow>
              )}
              {filteredShifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell className="font-medium">{shift.userName}</TableCell>
                  <TableCell>{shift.outletName}</TableCell>
                  <TableCell>{formatDate(shift.startTime)}</TableCell>
                  <TableCell>{formatDate(shift.endTime)}</TableCell>
                  <TableCell className="hidden sm:table-cell">{shift.duration || "-"}</TableCell>
                  <TableCell>
                     <Badge variant={getStatusBadgeVariant(shift.status)}
                      className={
                        shift.status === 'Berjalan' ? "bg-blue-500 hover:bg-blue-600 text-primary-foreground" :
                        shift.status === 'Selesai' ? "bg-green-500 hover:bg-green-600 text-primary-foreground" :
                        shift.status === 'Dibatalkan' ? "bg-red-500 hover:bg-red-600 text-primary-foreground" : ""
                      }
                     >{shift.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(shift.initialCash)}</TableCell>
                  <TableCell className="text-right hidden md:table-cell">{formatCurrency(shift.finalCash)}</TableCell>
                  <TableCell className="text-right hidden md:table-cell">{formatCurrency(shift.totalSales)}</TableCell>
                  <TableCell className="hidden lg:table-cell max-w-xs truncate" title={shift.notes}>{shift.notes || "-"}</TableCell>
                </TableRow>
              ))}
              {filteredShifts.length > 0 && (
                <TableRow className="font-bold bg-muted/50">
                  <TableCell colSpan={8} className="text-right">Total Penjualan (Filtered)</TableCell>
                  <TableCell className="text-right">{formatCurrency(filteredShifts.reduce((sum, item) => sum + (item.totalSales || 0), 0))}</TableCell>
                  <TableCell className="hidden lg:table-cell"></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
