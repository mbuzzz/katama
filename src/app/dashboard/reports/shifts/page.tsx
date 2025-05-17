
"use client";

import * as React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx"; // Import xlsx library
import type { jsPDFDocument } from "jspdf-autotable";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Download, UserCheck, Filter, DollarSign, TrendingUp, ClockIcon, FileSpreadsheet } from "lucide-react"; // Added FileSpreadsheet
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
    const shiftsData = getMockShifts();
    setAllShifts(shiftsData);
    setUsersForSelect(getMockUsersForSelect());
    setOutletsForSelect(getMockOutletsForSelect());
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (isLoading) return; 
    let data = [...allShifts];

    if (dateRange?.from) {
      const from = startOfDay(dateRange.from);
      const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
      data = data.filter(shift => {
        const shiftStartDate = parseISO(shift.startTime);
        return isValid(shiftStartDate) && isWithinInterval(shiftStartDate, { start: from, end: to });
      });
    }

    if (selectedUserId !== "all") data = data.filter(shift => shift.userId === selectedUserId);
    if (selectedOutletId !== "all") data = data.filter(shift => shift.outletId === selectedOutletId);
    if (selectedStatus !== "all") data = data.filter(shift => shift.status === selectedStatus);

    setFilteredShifts(data);
  }, [dateRange, selectedUserId, selectedOutletId, selectedStatus, allShifts, isLoading]);

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "-";
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };
  const formatCurrencyForExcel = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return null; // Return null for Excel if no value
    return amount;
  };


  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    const dateObj = parseISO(dateString);
    return isValid(dateObj) ? format(dateObj, "dd MMM yyyy, HH:mm", { locale: idLocale }) : "-";
  };
  const formatDateForExcel = (dateString?: string | null) => {
    if (!dateString) return null;
    const dateObj = parseISO(dateString);
    return isValid(dateObj) ? format(dateObj, "dd/MM/yyyy HH:mm:ss", { locale: idLocale }) : null;
  };
  
  const getStatusBadgeVariant = (status: Shift['status']) => {
    switch (status) {
      case 'Berjalan': return 'default';
      case 'Selesai': return 'secondary';
      case 'Dibatalkan': return 'destructive';
      default: return 'outline';
    }
  };
  
  const summaryValues = React.useMemo(() => {
    return {
      totalShifts: filteredShifts.length,
      totalSalesFromShifts: filteredShifts.reduce((sum, shift) => sum + (shift.totalSales || 0), 0),
      totalInitialCash: filteredShifts.reduce((sum, shift) => sum + (shift.initialCash || 0), 0),
      totalFinalCash: filteredShifts.reduce((sum, shift) => sum + (shift.finalCash || 0), 0),
    };
  }, [filteredShifts]);


  const handleDownloadPdfReport = () => {
    if (filteredShifts.length === 0) {
      toast({ title: "Tidak Ada Data", description: "Tidak ada data shift untuk filter yang dipilih.", variant: "destructive" });
      return;
    }
    try {
      const doc = new jsPDF('landscape') as jsPDFWithAutoTable;
      const currentDate = format(new Date(), "dd MMMM yyyy HH:mm", { locale: idLocale });
      const reportTitle = "Laporan Shift Rinci";
      const fileName = `Laporan_Shift_${format(new Date(), "yyyyMMddHHmmss")}.pdf`;

      doc.setFontSize(16);
      doc.text(reportTitle, 14, 20);
      doc.setFontSize(10);
      doc.text(`Tanggal Laporan: ${currentDate}`, 14, 26);
      let filterInfoY = 31;
      if (dateRange?.from) {
        const fromStr = format(dateRange.from, "dd/MM/yy", { locale: idLocale });
        const toStr = dateRange.to ? format(dateRange.to, "dd/MM/yy", { locale: idLocale }) : fromStr;
        doc.text(`Periode: ${fromStr} - ${toStr}`, 14, filterInfoY); filterInfoY +=5;
      }
      if (selectedUserId !== "all") { doc.text(`Pengguna: ${usersForSelect.find(u => u.value === selectedUserId)?.label || selectedUserId}`, 14, filterInfoY); filterInfoY +=5; }
      if (selectedOutletId !== "all") { doc.text(`Outlet: ${outletsForSelect.find(o => o.value === selectedOutletId)?.label || selectedOutletId}`, 14, filterInfoY); filterInfoY +=5; }
      if (selectedStatus !== "all") { doc.text(`Status: ${selectedStatus}`, 14, filterInfoY); filterInfoY +=5; }

      const tableColumn = ["ID Shift", "Pengguna", "Outlet", "Mulai", "Selesai", "Durasi", "Status", "Modal Awal", "Kas Akhir", "Total Sales", "Selisih", "Catatan"];
      const tableRows: any[][] = [];

      filteredShifts.forEach((shift) => {
        const selisih = (shift.finalCash || 0) - (shift.initialCash || 0) - (shift.totalSales || 0);
        const shiftData = [
          shift.id.slice(-6),
          shift.userName || "-",
          shift.outletName || "-",
          formatDate(shift.startTime),
          formatDate(shift.endTime),
          shift.duration || "-",
          shift.status,
          formatCurrency(shift.initialCash),
          formatCurrency(shift.finalCash),
          formatCurrency(shift.totalSales),
          formatCurrency(selisih),
          shift.notes || "-",
        ];
        tableRows.push(shiftData);
      });
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: filterInfoY + 2,
        theme: 'grid',
        headStyles: { fillColor: [60, 56, 91], textColor: 255, fontStyle: 'bold', fontSize: 7.5 },
        styles: { font: "helvetica", fontSize: 7, cellPadding: 1.5 },
        columnStyles: {
            0: {cellWidth: 12}, 1: {cellWidth: 20}, 2: {cellWidth: 20}, 3: {cellWidth: 20}, 4: {cellWidth: 20}, 
            5: {cellWidth: 15}, 6: {cellWidth: 15}, 7: { halign: 'right', cellWidth: 18 }, 8: { halign: 'right', cellWidth: 18 }, 
            9: { halign: 'right', cellWidth: 18 }, 10: { halign: 'right', cellWidth: 18 }, 11: {cellWidth: 30} 
        }
      });
      
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text( `Halaman ${i} dari ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10 );
      }

      doc.save(fileName);
      toast({ title: "Unduh PDF Berhasil", description: `Laporan shift telah berhasil diunduh sebagai ${fileName}.`});

    } catch (error) {
      console.error("Gagal membuat PDF laporan shift:", error);
      toast({ title: "Unduh PDF Gagal", description: "Terjadi kesalahan saat membuat laporan PDF.", variant: "destructive" });
    }
  };

  const handleDownloadExcelReport = () => {
    if (filteredShifts.length === 0) {
      toast({ title: "Tidak Ada Data", description: "Tidak ada data shift untuk filter yang dipilih.", variant: "destructive" });
      return;
    }
    try {
      const fileName = `Laporan_Shift_${format(new Date(), "yyyyMMddHHmmss")}.xlsx`;
      const header = ["ID Shift", "Pengguna", "Outlet", "Waktu Mulai", "Waktu Selesai", "Durasi Shift", "Status Shift", "Modal Awal (Rp)", "Kas Akhir Aktual (Rp)", "Total Penjualan (Rp)", "Selisih Kas (Rp)", "Catatan"];
      
      const dataForExcel = filteredShifts.map(shift => {
        const selisihKas = (shift.finalCash || 0) - (shift.initialCash || 0) - (shift.totalSales || 0);
        return [
          shift.id.slice(-6),
          shift.userName,
          shift.outletName,
          formatDateForExcel(shift.startTime),
          formatDateForExcel(shift.endTime),
          shift.duration,
          shift.status,
          formatCurrencyForExcel(shift.initialCash),
          formatCurrencyForExcel(shift.finalCash),
          formatCurrencyForExcel(shift.totalSales),
          formatCurrencyForExcel(selisihKas),
          shift.notes
        ];
      });

      const worksheetData = [header, ...dataForExcel];
      const totalRowIndex = worksheetData.length + 1;
      
      const totals = [
        "", "", "", "", "", "", "Total Keseluruhan:",
        { t: 'n', f: `SUM(H2:H${totalRowIndex-1})` }, // Modal Awal
        { t: 'n', f: `SUM(I2:I${totalRowIndex-1})` }, // Kas Akhir
        { t: 'n', f: `SUM(J2:J${totalRowIndex-1})` }, // Total Sales
        { t: 'n', f: `SUM(K2:K${totalRowIndex-1})` }, // Selisih Kas
      ];
      worksheetData.push(totals);

      const ws = XLSX.utils.aoa_to_sheet(worksheetData);
      
      const moneyCols = ['H', 'I', 'J', 'K'];
      for (let R = 1; R < worksheetData.length; ++R) { // Iterate through all data rows including total rows
          moneyCols.forEach(C => {
              const cellAddress = `${C}${R + 1}`;
              if (ws[cellAddress] && (ws[cellAddress].v !== null && ws[cellAddress].v !== undefined)) {
                  if (typeof ws[cellAddress].v === 'number' || (ws[cellAddress].t === 'n' && ws[cellAddress].f)) {
                    ws[cellAddress].z = '"Rp"#,##0';
                  }
              }
          });
      }

      const colWidths = header.map((_, i) => ({
        wch: Math.max(...worksheetData.map(row => row[i] ? String(row[i]).length : 0), header[i].length) + 2
      }));
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Shift");
      XLSX.writeFile(wb, fileName);

      toast({ title: "Unduh Excel Berhasil", description: `Laporan shift telah berhasil diunduh sebagai ${fileName}.` });
    } catch (error) {
      console.error("Gagal membuat Excel laporan shift:", error);
      toast({ title: "Unduh Excel Gagal", description: "Terjadi kesalahan saat membuat laporan Excel.", variant: "destructive" });
    }
  };


  if (isLoading) {
    return (
      <div>
        <PageHeader title="Laporan Shift" description="Analisis detail aktivitas shift pengguna." />
        <div className="flex justify-center items-center h-64"> <p>Memuat data laporan...</p> </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Laporan Shift" description="Analisis detail aktivitas shift pengguna.">
        <Button variant="outline" onClick={handleDownloadPdfReport} className="mr-2">
          <Download className="mr-2 h-4 w-4" /> Unduh PDF
        </Button>
        <Button variant="outline" onClick={handleDownloadExcelReport}>
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Unduh Excel
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shift (Filtered)</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryValues.totalShifts.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penjualan dari Shift (Filtered)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryValues.totalSalesFromShifts)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modal Awal (Filtered)</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(summaryValues.totalInitialCash)}</div>
          </CardContent>
        </Card>
      </div>


      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5"/> Filter Laporan Shift</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="date-range">Rentang Tanggal Mulai Shift</Label>
            <DatePickerWithRange className="mt-1" date={dateRange} onDateChange={setDateRange} />
          </div>
          <div>
            <Label htmlFor="user-filter">Pengguna (Kasir)</Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger id="user-filter" className="mt-1"><SelectValue placeholder="Semua Pengguna" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pengguna</SelectItem>
                {usersForSelect.map(user => ( <SelectItem key={user.value} value={user.value}>{user.label}</SelectItem> ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="outlet-filter">Outlet</Label>
            <Select value={selectedOutletId} onValueChange={setSelectedOutletId}>
              <SelectTrigger id="outlet-filter" className="mt-1"><SelectValue placeholder="Semua Outlet" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Outlet</SelectItem>
                 {outletsForSelect.map(outlet => ( <SelectItem key={outlet.value} value={outlet.value}>{outlet.label}</SelectItem> ))}
              </SelectContent>
            </Select>
          </div>
           <div>
            <Label htmlFor="status-filter">Status Shift</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status-filter" className="mt-1"><SelectValue placeholder="Semua Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                 {shiftStatuses.map(status => ( <SelectItem key={status} value={status}>{status}</SelectItem> ))}
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
                <TableHead className="w-[80px]">ID Shift</TableHead>
                <TableHead>Pengguna</TableHead>
                <TableHead>Outlet</TableHead>
                <TableHead>Mulai</TableHead>
                <TableHead>Selesai</TableHead>
                <TableHead className="hidden sm:table-cell">Durasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Modal Awal</TableHead>
                <TableHead className="text-right hidden md:table-cell">Kas Akhir</TableHead>
                <TableHead className="text-right hidden md:table-cell">Total Sales</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Selisih Kas</TableHead>
                <TableHead className="hidden xl:table-cell">Catatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShifts.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={12} className="text-center text-muted-foreground py-10">
                    Tidak ada data shift yang cocok dengan filter yang dipilih.
                  </TableCell>
                </TableRow>
              )}
              {filteredShifts.map((shift) => {
                const selisihKas = (shift.finalCash || 0) - (shift.initialCash || 0) - (shift.totalSales || 0);
                return (
                <TableRow key={shift.id}>
                  <TableCell className="text-xs">{shift.id.slice(-6)}</TableCell>
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
                  <TableCell className="text-right hidden lg:table-cell">{formatCurrency(selisihKas)}</TableCell>
                  <TableCell className="hidden xl:table-cell max-w-[150px] truncate" title={shift.notes || undefined}>{shift.notes || "-"}</TableCell>
                </TableRow>
              );
              })}
              {filteredShifts.length > 0 && (
                <>
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={7} className="text-right">Total Modal Awal (Filtered)</TableCell>
                    <TableCell className="text-right">{formatCurrency(summaryValues.totalInitialCash)}</TableCell>
                    <TableCell className="hidden md:table-cell"></TableCell>
                    <TableCell className="hidden md:table-cell"></TableCell>
                    <TableCell className="hidden lg:table-cell"></TableCell>
                    <TableCell className="hidden xl:table-cell"></TableCell>
                  </TableRow>
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={8} className="text-right">Total Kas Akhir (Filtered)</TableCell>
                    <TableCell className="text-right">{formatCurrency(summaryValues.totalFinalCash)}</TableCell>
                    <TableCell className="hidden md:table-cell"></TableCell>
                    <TableCell className="hidden lg:table-cell"></TableCell>
                    <TableCell className="hidden xl:table-cell"></TableCell>
                  </TableRow>
                  <TableRow className="font-bold bg-muted/50">
                    <TableCell colSpan={9} className="text-right">Total Penjualan dari Shift (Filtered)</TableCell>
                    <TableCell className="text-right">{formatCurrency(summaryValues.totalSalesFromShifts)}</TableCell>
                    <TableCell className="hidden lg:table-cell"></TableCell>
                    <TableCell className="hidden xl:table-cell"></TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

