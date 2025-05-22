
"use client";

import * as React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx"; // Import xlsx library
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Filter, FileSpreadsheet } from "lucide-react"; // Added FileSpreadsheet
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"; 
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, isValid } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { getMockShiftsForSelect } from "@/data/shifts"; 

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';

// Mock Data
const mockPurchaseReportDataFullStatic = [
  { companyId:"comp_es_teh_jaya", id: "P001", outlet: "Outlet Pusat", timestamp: "2024-07-20T10:00:00.000Z", user: "Admin Toko", itemName: "Biji Kopi Arabika", price: 150000, quantity: 10, unit: "kg", total: 1500000, shiftId: "shift1", supplier: "Supplier Kopi Jaya" },
  { companyId:"comp_es_teh_jaya", id: "P002", outlet: "Outlet Pusat", timestamp: "2024-07-19T15:30:00.000Z", user: "Admin Toko", itemName: "Susu UHT Full Cream", price: 80000, quantity: 5, unit: "karton", total: 400000, shiftId: "shift1", supplier: "Distributor Susu Segar" },
  { companyId:"comp_kopi_maju", id: "P003", outlet: "Outlet Cabang A", timestamp: "2024-07-18T09:00:00.000Z", user: "Manajer Cabang", itemName: "Gula Aren Cair", price: 25000, quantity: 20, unit: "liter", total: 500000, shiftId: "shift1", supplier: "Produsen Gula Aren" },
  { companyId:"comp_es_teh_jaya", id: "P004", outlet: "Outlet Pusat", timestamp: "2024-07-22T11:00:00.000Z", user: "Admin Toko", itemName: "Biji Kopi Robusta", price: 120000, quantity: 8, unit: "kg", total: 960000, shiftId: "shift2", supplier: "Supplier Kopi Robusta" },
  { companyId:"comp_roti_lezat_selalu", id: "P005", outlet: "Outlet Cabang Sudirman", timestamp: "2024-07-22T14:00:00.000Z", user: "Manajer Cabang", itemName: "Bubuk Es Teh", price: 50000, quantity: 10, unit: "kg", total: 500000, shiftId: "shift3", supplier: "Supplier Teh Nusantara" },
];

type PurchaseRecord = typeof mockPurchaseReportDataFullStatic[0];

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export default function PurchaseReportPage() {
  const { toast } = useToast();
  const [mockPurchaseReportDataFull, setMockPurchaseReportDataFull] = React.useState<PurchaseRecord[]>([]);
  const [filteredPurchaseData, setFilteredPurchaseData] = React.useState<PurchaseRecord[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [itemSearchTerm, setItemSearchTerm] = React.useState<string>("");
  const [selectedShiftId, setSelectedShiftId] = React.useState<string>("all");
  const [isLoading, setIsLoading] = React.useState(true);
  const [shiftsForSelect, setShiftsForSelect] = React.useState<{value: string; label: string}[]>([]);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);

    const companyPurchases = storedCompanyId 
      ? mockPurchaseReportDataFullStatic.filter(p => p.companyId === storedCompanyId)
      : [];
    setMockPurchaseReportDataFull(companyPurchases);
    setShiftsForSelect(getMockShiftsForSelect()); // Assuming this is global or needs companyId
    setIsLoading(false);
  }, [activeCompanyId]);

  React.useEffect(() => {
    if (isLoading) return; 

    let data = [...mockPurchaseReportDataFull];

    if (dateRange?.from) {
      const from = startOfDay(dateRange.from);
      const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
      data = data.filter(purchase => {
        const purchaseDate = parseISO(purchase.timestamp);
        return isValid(purchaseDate) && isWithinInterval(purchaseDate, { start: from, end: to });
      });
    }

    if (itemSearchTerm) {
      data = data.filter(purchase => 
        purchase.itemName.toLowerCase().includes(itemSearchTerm.toLowerCase())
      );
    }

    if (selectedShiftId !== "all") {
      data = data.filter(purchase => purchase.shiftId === selectedShiftId);
    }

    setFilteredPurchaseData(data);
  }, [dateRange, itemSearchTerm, selectedShiftId, mockPurchaseReportDataFull, isLoading]);


  const handleDownloadPdfReport = () => {
    if (filteredPurchaseData.length === 0) {
      toast({ title: "Tidak Ada Data", description: "Tidak ada data pembelanjaan untuk filter yang dipilih.", variant: "destructive" });
      return;
    }
    try {
      const doc = new jsPDF() as jsPDFWithAutoTable;
      const currentDate = format(new Date(), "dd MMMM yyyy HH:mm", { locale: idLocale });
      const reportTitle = "Laporan Pembelanjaan";
      const fileName = `Laporan_Pembelanjaan_${format(new Date(), "yyyyMMddHHmmss")}.pdf`;

      doc.setFontSize(18);
      doc.text(reportTitle, 14, 22);
      doc.setFontSize(10);
      doc.text(`Tanggal Laporan: ${currentDate}`, 14, 30);
      let filterInfoY = 35;
      if (dateRange?.from) {
        const fromStr = format(dateRange.from, "dd/MM/yy", { locale: idLocale });
        const toStr = dateRange.to ? format(dateRange.to, "dd/MM/yy", { locale: idLocale }) : fromStr;
        doc.text(`Periode: ${fromStr} - ${toStr}`, 14, filterInfoY); filterInfoY += 5;
      }
      if (itemSearchTerm) { doc.text(`Filter Barang: ${itemSearchTerm}`, 14, filterInfoY); filterInfoY += 5; }
      if (selectedShiftId !== "all") {
        const shiftLabel = shiftsForSelect.find(s => s.value === selectedShiftId)?.label || selectedShiftId;
        doc.text(`Shift: ${shiftLabel}`, 14, filterInfoY); filterInfoY += 5;
      }

      const tableColumn = ["ID", "Waktu", "Outlet", "Pengguna", "Nama Barang", "Pemasok", "Jml", "Satuan", "Harga Satuan", "Total"];
      const tableRows: any[][] = [];

      filteredPurchaseData.forEach(purchase => {
        const purchaseData = [
          purchase.id,
          format(parseISO(purchase.timestamp), "dd/MM/yy, HH:mm", { locale: idLocale }),
          purchase.outlet,
          purchase.user,
          purchase.itemName,
          purchase.supplier,
          purchase.quantity.toString(),
          purchase.unit,
          `Rp ${purchase.price.toLocaleString('id-ID')}`,
          `Rp ${purchase.total.toLocaleString('id-ID')}`
        ];
        tableRows.push(purchaseData);
      });
      
      const totalOverall = filteredPurchaseData.reduce((sum, item) => sum + item.total, 0);
      tableRows.push([
        { content: "Total Keseluruhan Pembelanjaan", colSpan: 9, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: `Rp ${totalOverall.toLocaleString('id-ID')}`, styles: { fontStyle: 'bold' } }
      ]);

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: filterInfoY + 2,
        theme: 'grid',
        headStyles: { fillColor: [60, 56, 91], textColor: 255, fontSize: 8 }, 
        styles: { font: "helvetica", fontSize: 7.5, cellPadding: 1.5 },
        columnStyles: {
          0: {cellWidth: 12}, 1: {cellWidth: 20}, 4: {cellWidth: 30}, 5: {cellWidth: 25}, 
          6: { halign: 'right', cellWidth: 10 }, 7: {cellWidth: 12}, 
          8: { halign: 'right', cellWidth: 20 }, 9: { halign: 'right', cellWidth: 20 },
        }
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text( `Halaman ${i} dari ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10 );
      }

      doc.save(fileName);
      toast({ title: "Unduh PDF Berhasil", description: `Laporan pembelanjaan telah berhasil diunduh sebagai ${fileName}.` });

    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      toast({ title: "Unduh PDF Gagal", description: "Terjadi kesalahan saat membuat laporan PDF.", variant: "destructive" });
    }
  };
  
  const handleDownloadExcelReport = () => {
    if (filteredPurchaseData.length === 0) {
      toast({ title: "Tidak Ada Data", description: "Tidak ada data pembelanjaan untuk filter yang dipilih.", variant: "destructive" });
      return;
    }
    try {
      const fileName = `Laporan_Pembelanjaan_${format(new Date(), "yyyyMMddHHmmss")}.xlsx`;
      const header = ["ID", "Waktu", "Outlet", "Pengguna", "Nama Barang", "Pemasok", "Jumlah", "Satuan", "Harga Satuan (Rp)", "Total Pembelanjaan (Rp)"];
      
      const dataForExcel = filteredPurchaseData.map(purchase => [
        purchase.id,
        format(parseISO(purchase.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: idLocale }),
        purchase.outlet,
        purchase.user,
        purchase.itemName,
        purchase.supplier,
        purchase.quantity,
        purchase.unit,
        purchase.price,
        purchase.total
      ]);

      const worksheetData = [header, ...dataForExcel];
      
      const totalRowIndex = worksheetData.length + 1; // Excel row number
      const totalDataRow = [
        "", "", "", "", "", "", "", "", "Total Keseluruhan:",
        { t: 'n', f: `SUM(J2:J${totalRowIndex-1})` } // Total Pembelanjaan
      ];
      worksheetData.push(totalDataRow);

      const ws = XLSX.utils.aoa_to_sheet(worksheetData);

      // Apply number formatting for currency columns (I, J)
      const moneyCols = ['I', 'J'];
      for (let R = 1; R < totalRowIndex; ++R) { // Data rows
          moneyCols.forEach(C => {
              const cellAddress = `${C}${R + 1}`;
              if (ws[cellAddress] && typeof ws[cellAddress].v === 'number') {
                  ws[cellAddress].z = '"Rp"#,##0';
              }
          });
      }
      if(ws[`J${totalRowIndex}`]) ws[`J${totalRowIndex}`].z = '"Rp"#,##0';

      // Auto-fit columns
      const colWidths = header.map((_, i) => ({
        wch: Math.max(...worksheetData.map(row => row[i] ? String(row[i]).length : 0), header[i].length) + 2
      }));
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Pembelanjaan");
      XLSX.writeFile(wb, fileName);

      toast({ title: "Unduh Excel Berhasil", description: `Laporan pembelanjaan telah berhasil diunduh sebagai ${fileName}.` });
    } catch (error) {
      console.error("Gagal membuat Excel:", error);
      toast({ title: "Unduh Excel Gagal", description: "Terjadi kesalahan saat membuat laporan Excel.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div>
        <PageHeader title="Laporan Pembelanjaan" description="Lacak semua pembelanjaan barang." />
        <div className="flex justify-center items-center h-64"> <p>Memuat data laporan...</p> </div>
      </div>
    );
  }

  if (!activeCompanyId && !isLoading) {
    return (
      <div>
        <PageHeader title="Laporan Pembelanjaan" description="Pilih perusahaan untuk melihat laporan."/>
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex justify-center items-center h-64">
            <p className="text-muted-foreground">Pilih perusahaan aktif terlebih dahulu untuk melihat laporan pembelanjaan.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Laporan Pembelanjaan" description="Lacak semua pembelanjaan barang.">
        <Button variant="outline" onClick={handleDownloadPdfReport} className="mr-2">
          <Download className="mr-2 h-4 w-4" /> Unduh PDF
        </Button>
        <Button variant="outline" onClick={handleDownloadExcelReport}>
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Unduh Excel
        </Button>
      </PageHeader>
      
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5"/> Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="date-range">Rentang Tanggal</Label>
            <DatePickerWithRange className="mt-1" date={dateRange} onDateChange={setDateRange} />
          </div>
          <div>
            <Label htmlFor="item-search">Nama Barang</Label>
            <Input id="item-search" type="search" placeholder="Cari nama barang..." className="mt-1" value={itemSearchTerm} onChange={(e) => setItemSearchTerm(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="shift-filter-purchases">Shift</Label>
            <Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
              <SelectTrigger id="shift-filter-purchases" className="mt-1"><SelectValue placeholder="Semua Shift" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Shift</SelectItem>
                 {shiftsForSelect.map(shift => ( <SelectItem key={shift.value} value={shift.value}>{shift.label}</SelectItem> ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detail Pembelanjaan</CardTitle>
          <CardDescription>Menampilkan {filteredPurchaseData.length} transaksi pembelanjaan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] hidden xl:table-cell">ID</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead className="hidden sm:table-cell">Outlet</TableHead>
                <TableHead className="hidden md:table-cell">Pengguna</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead className="hidden lg:table-cell">Pemasok</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead className="hidden md:table-cell">Satuan</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Harga Satuan</TableHead>
                <TableHead className="text-right">Total Pembelanjaan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchaseData.length === 0 && !isLoading && (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
                    Tidak ada data pembelanjaan yang cocok dengan filter yang dipilih.
                  </TableCell>
                </TableRow>
              )}
              {filteredPurchaseData.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="text-xs hidden xl:table-cell">{purchase.id}</TableCell>
                  <TableCell>{format(parseISO(purchase.timestamp), "dd/MM/yy, HH:mm", { locale: idLocale })}</TableCell>
                  <TableCell className="hidden sm:table-cell max-w-[100px] truncate">{purchase.outlet}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[100px] truncate">{purchase.user}</TableCell>
                  <TableCell className="font-medium max-w-[150px] truncate">{purchase.itemName}</TableCell>
                  <TableCell className="hidden lg:table-cell max-w-[100px] truncate">{purchase.supplier}</TableCell>
                  <TableCell className="text-right">{purchase.quantity}</TableCell>
                  <TableCell className="hidden md:table-cell">{purchase.unit}</TableCell>
                  <TableCell className="text-right hidden lg:table-cell">Rp {purchase.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right">Rp {purchase.total.toLocaleString('id-ID')}</TableCell>
                </TableRow>
              ))}
               {filteredPurchaseData.length > 0 && (
                <TableRow className="font-bold bg-muted/50">
                  <TableCell colSpan={9} className="text-right hidden lg:table-cell">Total Keseluruhan Pembelanjaan (Filtered)</TableCell>
                  <TableCell colSpan={5} className="text-right sm:hidden">Total (Filtered)</TableCell>
                  <TableCell colSpan={3} className="text-right hidden sm:table-cell md:hidden">Total (Filtered)</TableCell>
                  <TableCell colSpan={1} className="text-right hidden md:table-cell lg:hidden">Total (Filtered)</TableCell>
                  <TableCell className="text-right">Rp {filteredPurchaseData.reduce((sum, item) => sum + item.total, 0).toLocaleString('id-ID')}</TableCell>
                </TableRow>
               )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    