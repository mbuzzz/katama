
"use client";

import * as React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Download, Filter } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, isValid } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { getMockShiftsForSelect } from "@/data/shifts"; // Import shift data helper

// Mock Data - Placed here for client component context
const mockSalesDataFullStatic = [
  { id: "S001", outlet: "Outlet Pusat", timestamp: "2024-07-21T10:30:00.000Z", user: "Kasir Ana", productName: "Kopi Susu Aren", price: 18000, quantity: 2, total: 36000, shiftId: "shift2" },
  { id: "S002", outlet: "Outlet Cabang A", timestamp: "2024-07-21T11:15:00.000Z", user: "Kasir Budi", productName: "Croissant Coklat", price: 22000, quantity: 1, total: 22000, shiftId: "shift1" },
  { id: "S003", outlet: "Outlet Pusat", timestamp: "2024-07-20T14:00:00.000Z", user: "Kasir Ana", productName: "Teh Melati", price: 15000, quantity: 3, total: 45000, shiftId: "shift1" },
  { id: "S004", outlet: "Outlet Pusat", timestamp: "2024-07-22T09:00:00.000Z", user: "Kasir Ana", productName: "Americano", price: 16000, quantity: 1, total: 16000, shiftId: "shift2" },
  { id: "S005", outlet: "Outlet Cabang A", timestamp: "2024-07-22T12:30:00.000Z", user: "Kasir Budi", productName: "Kopi Susu Aren", price: 18000, quantity: 1, total: 18000, shiftId: "shift1" },
  { id: "S006", outlet: "Outlet Cabang Sudirman", timestamp: "2024-07-22T14:00:00.000Z", user: "Dewi Lestari", productName: "Es Teh Manis", price: 10000, quantity: 5, total: 50000, shiftId: "shift3" },
];

type SaleRecord = typeof mockSalesDataFullStatic[0];

const uniqueUsersStatic = Array.from(new Set(mockSalesDataFullStatic.map(sale => sale.user)));
const uniqueOutletsStatic = Array.from(new Set(mockSalesDataFullStatic.map(sale => sale.outlet)));


interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export default function SalesReportPage() {
  const { toast } = useToast();
  const [mockSalesDataFull, setMockSalesDataFull] = React.useState<SaleRecord[]>([]);
  const [filteredSalesData, setFilteredSalesData] = React.useState<SaleRecord[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [selectedUser, setSelectedUser] = React.useState<string>("all");
  const [selectedOutlet, setSelectedOutlet] = React.useState<string>("all");
  const [selectedShiftId, setSelectedShiftId] = React.useState<string>("all");
  const [isLoading, setIsLoading] = React.useState(true);

  const [shiftsForSelect, setShiftsForSelect] = React.useState<{value: string; label: string}[]>([]);
  const [uniqueUsers, setUniqueUsers] = React.useState<string[]>([]);
  const [uniqueOutlets, setUniqueOutlets] = React.useState<string[]>([]);


  React.useEffect(() => {
    // Simulate fetching or initializing data client-side
    setMockSalesDataFull(mockSalesDataFullStatic);
    setShiftsForSelect(getMockShiftsForSelect());
    setUniqueUsers(uniqueUsersStatic);
    setUniqueOutlets(uniqueOutletsStatic);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (isLoading) return; // Don't filter until data is loaded

    let data = [...mockSalesDataFull];

    if (dateRange?.from) {
      const from = startOfDay(dateRange.from);
      const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
      data = data.filter(sale => {
        const saleDate = parseISO(sale.timestamp);
        return isValid(saleDate) && isWithinInterval(saleDate, { start: from, end: to });
      });
    }

    if (selectedUser !== "all") {
      data = data.filter(sale => sale.user === selectedUser);
    }

    if (selectedOutlet !== "all") {
      data = data.filter(sale => sale.outlet === selectedOutlet);
    }

    if (selectedShiftId !== "all") {
      data = data.filter(sale => sale.shiftId === selectedShiftId);
    }

    setFilteredSalesData(data);
  }, [dateRange, selectedUser, selectedOutlet, selectedShiftId, mockSalesDataFull, isLoading]);


  const handleDownloadReport = () => {
    if (filteredSalesData.length === 0) {
      toast({
        title: "Tidak Ada Data",
        description: "Tidak ada data penjualan untuk filter yang dipilih.",
        variant: "destructive",
      });
      return;
    }
    try {
      const doc = new jsPDF() as jsPDFWithAutoTable;
      const currentDate = format(new Date(), "dd MMMM yyyy HH:mm", { locale: idLocale });
      const reportTitle = "Laporan Penjualan";
      const fileName = `Laporan_Penjualan_${format(new Date(), "yyyyMMddHHmmss")}.pdf`;

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
      if (selectedUser !== "all") {
        doc.text(`Pengguna: ${selectedUser}`, 14, filterInfoY);
        filterInfoY += 5;
      }
      if (selectedOutlet !== "all") {
        doc.text(`Outlet: ${selectedOutlet}`, 14, filterInfoY);
        filterInfoY += 5;
      }
      if (selectedShiftId !== "all") {
        const shiftLabel = shiftsForSelect.find(s => s.value === selectedShiftId)?.label || selectedShiftId;
        doc.text(`Shift: ${shiftLabel}`, 14, filterInfoY);
        filterInfoY += 5;
      }


      const tableColumn = ["Outlet", "Waktu", "Pengguna", "Produk", "Harga", "Jumlah", "Total"];
      const tableRows: any[][] = [];

      filteredSalesData.forEach(sale => {
        const saleData = [
          sale.outlet,
          format(parseISO(sale.timestamp), "dd/MM/yy, HH:mm", { locale: idLocale }),
          sale.user,
          sale.productName,
          `Rp ${sale.price.toLocaleString('id-ID')}`,
          sale.quantity.toString(),
          `Rp ${sale.total.toLocaleString('id-ID')}`
        ];
        tableRows.push(saleData);
      });

      const totalOverall = filteredSalesData.reduce((sum, item) => sum + item.total, 0);
      tableRows.push([
        { content: "Total Keseluruhan", colSpan: 6, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: `Rp ${totalOverall.toLocaleString('id-ID')}`, styles: { fontStyle: 'bold' } }
      ]);
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: filterInfoY + 2,
        theme: 'grid',
        headStyles: { fillColor: [60, 56, 91], textColor: 255 },
        styles: { font: "helvetica", fontSize: 9 },
        columnStyles: {
          4: { halign: 'right' },
          5: { halign: 'right' },
          6: { halign: 'right' },
        }
      });
      
      const pageCount = doc.internal.getNumberOfPages();
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
        description: `Laporan penjualan telah berhasil diunduh sebagai ${fileName}.`,
      });

    } catch (error) {
      console.error("Gagal membuat PDF:", error);
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
        <PageHeader title="Laporan Penjualan" description="Analisis detail penjualan Anda." />
        <div className="flex justify-center items-center h-64">
          <p>Memuat data laporan...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Laporan Penjualan" description="Analisis detail penjualan Anda.">
        <Button variant="outline" onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" /> Unduh Laporan PDF
        </Button>
      </PageHeader>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5"/> Filter Laporan</CardTitle>
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
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger id="user-filter" className="mt-1">
                <SelectValue placeholder="Semua Pengguna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pengguna</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="outlet-filter">Outlet</Label>
            <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
              <SelectTrigger id="outlet-filter" className="mt-1">
                <SelectValue placeholder="Semua Outlet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Outlet</SelectItem>
                 {uniqueOutlets.map(outlet => (
                  <SelectItem key={outlet} value={outlet}>{outlet}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="shift-filter">Shift</Label>
            <Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
              <SelectTrigger id="shift-filter" className="mt-1">
                <SelectValue placeholder="Semua Shift" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Shift</SelectItem>
                 {shiftsForSelect.map(shift => (
                  <SelectItem key={shift.value} value={shift.value}>{shift.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detail Penjualan</CardTitle>
          <CardDescription>Menampilkan {filteredSalesData.length} transaksi.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Outlet</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Pengguna (Kasir)</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalesData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                    Tidak ada data penjualan yang cocok dengan filter yang dipilih.
                  </TableCell>
                </TableRow>
              )}
              {filteredSalesData.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.outlet}</TableCell>
                  <TableCell>{format(parseISO(sale.timestamp), "dd/MM/yy, HH:mm", { locale: idLocale })}</TableCell>
                  <TableCell>{sale.user}</TableCell>
                  <TableCell className="font-medium">{sale.productName}</TableCell>
                  <TableCell className="text-right">Rp {sale.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right">{sale.quantity}</TableCell>
                  <TableCell className="text-right">Rp {sale.total.toLocaleString('id-ID')}</TableCell>
                </TableRow>
              ))}
              {filteredSalesData.length > 0 && (
                <TableRow className="font-bold bg-muted/50">
                  <TableCell colSpan={6} className="text-right">Total Keseluruhan (Filtered)</TableCell>
                  <TableCell className="text-right">Rp {filteredSalesData.reduce((sum, item) => sum + item.total, 0).toLocaleString('id-ID')}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

