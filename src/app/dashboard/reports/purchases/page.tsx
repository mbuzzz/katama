
"use client";

import * as React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { useToast } from "@/hooks/use-toast"; 
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

// Mock Data
const mockPurchaseReportDataFull = [
  { id: "P001", outlet: "Outlet Pusat", timestamp: "2024-07-20T10:00:00", user: "Admin Toko", itemName: "Biji Kopi Arabika", price: 150000, quantity: 10, unit: "kg", total: 1500000 },
  { id: "P002", outlet: "Outlet Pusat", timestamp: "2024-07-19T15:30:00", user: "Admin Toko", itemName: "Susu UHT Full Cream", price: 80000, quantity: 5, unit: "karton", total: 400000 },
  { id: "P003", outlet: "Outlet Cabang A", timestamp: "2024-07-18T09:00:00", user: "Manajer Cabang", itemName: "Gula Aren Cair", price: 25000, quantity: 20, unit: "liter", total: 500000 },
  { id: "P004", outlet: "Outlet Pusat", timestamp: "2024-07-22T11:00:00", user: "Admin Toko", itemName: "Biji Kopi Robusta", price: 120000, quantity: 8, unit: "kg", total: 960000 },
];

type PurchaseRecord = typeof mockPurchaseReportDataFull[0];

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export default function PurchaseReportPage() {
  const { toast } = useToast();
  const [filteredPurchaseData, setFilteredPurchaseData] = React.useState<PurchaseRecord[]>(mockPurchaseReportDataFull);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [itemSearchTerm, setItemSearchTerm] = React.useState<string>("");

  React.useEffect(() => {
    let data = [...mockPurchaseReportDataFull];

    if (dateRange?.from && dateRange?.to) {
      data = data.filter(purchase => {
        const purchaseDate = parseISO(purchase.timestamp);
        return isWithinInterval(purchaseDate, { start: startOfDay(dateRange.from as Date), end: endOfDay(dateRange.to as Date) });
      });
    } else if (dateRange?.from) {
        data = data.filter(purchase => {
        const purchaseDate = parseISO(purchase.timestamp);
        return isWithinInterval(purchaseDate, { start: startOfDay(dateRange.from as Date), end: endOfDay(dateRange.from as Date) });
      });
    }


    if (itemSearchTerm) {
      data = data.filter(purchase => 
        purchase.itemName.toLowerCase().includes(itemSearchTerm.toLowerCase())
      );
    }
    setFilteredPurchaseData(data);
  }, [dateRange, itemSearchTerm]);


  const handleDownloadReport = () => {
    if (filteredPurchaseData.length === 0) {
      toast({
        title: "Tidak Ada Data",
        description: "Tidak ada data pembelanjaan untuk filter yang dipilih.",
        variant: "destructive",
      });
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
        doc.text(`Periode: ${fromStr} - ${toStr}`, 14, filterInfoY);
        filterInfoY += 5;
      }
      if (itemSearchTerm) {
        doc.text(`Filter Barang: ${itemSearchTerm}`, 14, filterInfoY);
        filterInfoY += 5;
      }

      const tableColumn = ["Outlet", "Waktu", "Pengguna", "Nama Barang", "Harga Satuan", "Jumlah", "Satuan", "Total"];
      const tableRows: any[][] = [];

      filteredPurchaseData.forEach(purchase => {
        const purchaseData = [
          purchase.outlet,
          format(parseISO(purchase.timestamp), "dd/MM/yy, HH:mm", { locale: idLocale }),
          purchase.user,
          purchase.itemName,
          `Rp ${purchase.price.toLocaleString('id-ID')}`,
          purchase.quantity.toString(),
          purchase.unit,
          `Rp ${purchase.total.toLocaleString('id-ID')}`
        ];
        tableRows.push(purchaseData);
      });
      
      const totalOverall = filteredPurchaseData.reduce((sum, item) => sum + item.total, 0);
      tableRows.push([
        { content: "Total Keseluruhan Pembelanjaan", colSpan: 7, styles: { halign: 'right', fontStyle: 'bold' } },
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
          7: { halign: 'right' },
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
        description: `Laporan pembelanjaan telah berhasil diunduh sebagai ${fileName}.`,
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

  return (
    <div>
      <PageHeader title="Laporan Pembelanjaan" description="Lacak semua pembelanjaan barang.">
        <Button variant="outline" onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" /> Unduh Laporan PDF
        </Button>
      </PageHeader>
      
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle>Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date-range">Rentang Tanggal</Label>
            <DatePickerWithRange 
              className="mt-1" 
              date={dateRange}
              onDateChange={setDateRange}
            />
          </div>
          <div>
            <Label htmlFor="item-search">Nama Barang</Label>
            <Input 
              id="item-search" 
              type="search" 
              placeholder="Cari nama barang..." 
              className="mt-1" 
              value={itemSearchTerm}
              onChange={(e) => setItemSearchTerm(e.target.value)}
            />
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
                <TableHead>Outlet</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Pengguna</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead className="text-right">Harga Satuan</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead className="text-right">Total Pembelanjaan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchaseData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                    Tidak ada data pembelanjaan yang cocok dengan filter yang dipilih.
                  </TableCell>
                </TableRow>
              )}
              {filteredPurchaseData.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{purchase.outlet}</TableCell>
                  <TableCell>{format(parseISO(purchase.timestamp), "dd/MM/yy, HH:mm", { locale: idLocale })}</TableCell>
                  <TableCell>{purchase.user}</TableCell>
                  <TableCell className="font-medium">{purchase.itemName}</TableCell>
                  <TableCell className="text-right">Rp {purchase.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right">{purchase.quantity}</TableCell>
                  <TableCell>{purchase.unit}</TableCell>
                  <TableCell className="text-right">Rp {purchase.total.toLocaleString('id-ID')}</TableCell>
                </TableRow>
              ))}
               {filteredPurchaseData.length > 0 && (
                <TableRow className="font-bold bg-muted/50">
                  <TableCell colSpan={7} className="text-right">Total Keseluruhan Pembelanjaan (Filtered)</TableCell>
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
