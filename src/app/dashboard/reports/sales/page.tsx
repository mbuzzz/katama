
"use client";

import * as React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx"; // Import xlsx library
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Download, Filter, DollarSign, ShoppingCart, TrendingUp, Percent, FileSpreadsheet } from "lucide-react"; // Added FileSpreadsheet
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, isValid } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { getMockShiftsForSelect } from "@/data/shifts";
import type { Product } from "@/types/product";
import { getMockProducts } from "@/data/products";

const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';
const paymentMethods = ["Tunai", "Kartu", "QRIS"];

const mockSalesDataFullStatic = [
  { companyId:"comp_es_teh_jaya", id: "S001", outlet: "Outlet Pusat", timestamp: "2024-07-21T10:30:00.000Z", user: "Ana Maria", productId: "1", productName: "Kopi Susu Aren", price: 18000, quantity: 2, total: 36000, shiftId: "shift2", paymentMethod: "QRIS" },
  { companyId:"comp_kopi_maju", id: "S002", outlet: "Outlet Cabang A", timestamp: "2024-07-21T11:15:00.000Z", user: "Budi Santoso", productId: "2", productName: "Croissant Coklat", price: 22000, quantity: 1, total: 22000, shiftId: "shift1", paymentMethod: "Kartu" },
  { companyId:"comp_es_teh_jaya", id: "S003", outlet: "Outlet Pusat", timestamp: "2024-07-20T14:00:00.000Z", user: "Ana Maria", productId: "3", productName: "Teh Melati Panas", price: 15000, quantity: 3, total: 45000, shiftId: "shift1", paymentMethod: "Tunai" },
  { companyId:"comp_es_teh_jaya", id: "S004", outlet: "Outlet Pusat", timestamp: "2024-07-22T09:00:00.000Z", user: "Ana Maria", productId: "5", productName: "Americano", price: 16000, quantity: 1, total: 16000, shiftId: "shift2", paymentMethod: "QRIS" },
  { companyId:"comp_kopi_maju", id: "S005", outlet: "Outlet Cabang A", timestamp: "2024-07-22T12:30:00.000Z", user: "Budi Santoso", productId: "1", productName: "Kopi Susu Aren", price: 18000, quantity: 1, total: 18000, shiftId: "shift1", paymentMethod: "Tunai" },
  { companyId:"comp_roti_lezat_selalu", id: "S006", outlet: "Outlet Cabang Sudirman", timestamp: "2024-07-22T14:00:00.000Z", user: "Dewi Lestari", productId: "16", productName: "Es Teh Manis", price: 10000, quantity: 5, total: 50000, shiftId: "shift3", paymentMethod: "Tunai" },
];

type EnrichedSaleRecord = typeof mockSalesDataFullStatic[0] & {
  transactionId: string;
  hppPerUnit: number; 
  totalHpp: number; 
  profit: number; 
};

const uniqueUsersStatic = Array.from(new Set(mockSalesDataFullStatic.map(sale => sale.user)));
const uniqueOutletsStatic = Array.from(new Set(mockSalesDataFullStatic.map(sale => sale.outlet)));

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export default function SalesReportPage() {
  const { toast } = useToast();
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [mockSalesDataFull, setMockSalesDataFull] = React.useState<EnrichedSaleRecord[]>([]);
  const [filteredSalesData, setFilteredSalesData] = React.useState<EnrichedSaleRecord[]>([]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  const [selectedUser, setSelectedUser] = React.useState<string>("all");
  const [selectedOutlet, setSelectedOutlet] = React.useState<string>("all");
  const [selectedShiftId, setSelectedShiftId] = React.useState<string>("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string>("all");
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);

  const [shiftsForSelect, setShiftsForSelect] = React.useState<{value: string; label: string}[]>([]);
  const [uniqueUsers, setUniqueUsers] = React.useState<string[]>([]);
  const [uniqueOutlets, setUniqueOutlets] = React.useState<string[]>([]);

  React.useEffect(() => {
    const storedCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
    setActiveCompanyId(storedCompanyId);

    const products = getMockProducts(storedCompanyId || undefined); 
    setAllProducts(products);
    
    const companySalesData = storedCompanyId 
        ? mockSalesDataFullStatic.filter(sale => sale.companyId === storedCompanyId) 
        : [];

    const enrichedStaticData = companySalesData.map(sale => {
      const product = products.find(p => p.id === sale.productId && p.companyId === sale.companyId);
      const hppPerUnit = product?.hpp || 0;
      const totalHpp = hppPerUnit * sale.quantity;
      const profit = sale.total - totalHpp;
      return {
        ...sale,
        transactionId: `TXN-${sale.id.slice(-4)}-${parseISO(sale.timestamp).getTime().toString().slice(-4)}`,
        hppPerUnit: hppPerUnit,
        totalHpp: totalHpp,
        profit: profit,
      };
    });
    setMockSalesDataFull(enrichedStaticData);

    setShiftsForSelect(getMockShiftsForSelect()); // Assuming this is global for now, or needs companyId
    setUniqueUsers(Array.from(new Set(companySalesData.map(sale => sale.user))));
    setUniqueOutlets(Array.from(new Set(companySalesData.map(sale => sale.outlet))));
    setIsLoading(false);
  }, [activeCompanyId]); // Re-run when activeCompanyId changes

  React.useEffect(() => {
    if (isLoading) return;

    let data = [...mockSalesDataFull];

    if (dateRange?.from) {
      const from = startOfDay(dateRange.from);
      const to = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
      data = data.filter(sale => {
        const saleDate = parseISO(sale.timestamp);
        return isValid(saleDate) && isWithinInterval(saleDate, { start: from, end: to });
      });
    }

    if (selectedUser !== "all") data = data.filter(sale => sale.user === selectedUser);
    if (selectedOutlet !== "all") data = data.filter(sale => sale.outlet === selectedOutlet);
    if (selectedShiftId !== "all") data = data.filter(sale => sale.shiftId === selectedShiftId);
    if (selectedPaymentMethod !== "all") data = data.filter(sale => sale.paymentMethod === selectedPaymentMethod);

    setFilteredSalesData(data);
  }, [dateRange, selectedUser, selectedOutlet, selectedShiftId, selectedPaymentMethod, mockSalesDataFull, isLoading]);
  
  const totalRevenue = React.useMemo(() => filteredSalesData.reduce((sum, item) => sum + item.total, 0), [filteredSalesData]);
  const totalTransactions = React.useMemo(() => filteredSalesData.length, [filteredSalesData]);
  const totalOverallHpp = React.useMemo(() => filteredSalesData.reduce((sum, item) => sum + item.totalHpp, 0), [filteredSalesData]);
  const totalProfit = React.useMemo(() => filteredSalesData.reduce((sum, item) => sum + item.profit, 0), [filteredSalesData]);


  const handleDownloadPdfReport = () => {
    if (filteredSalesData.length === 0) {
      toast({ title: "Tidak Ada Data", description: "Tidak ada data penjualan untuk filter yang dipilih.", variant: "destructive" });
      return;
    }
    try {
      const doc = new jsPDF('landscape') as jsPDFWithAutoTable; 
      const currentDate = format(new Date(), "dd MMMM yyyy HH:mm", { locale: idLocale });
      const reportTitle = "Laporan Penjualan Rinci";
      const fileName = `Laporan_Penjualan_${format(new Date(), "yyyyMMddHHmmss")}.pdf`;

      doc.setFontSize(16);
      doc.text(reportTitle, 14, 20);
      doc.setFontSize(10);
      doc.text(`Tanggal Laporan: ${currentDate}`, 14, 26);
      let filterInfoY = 31;
      if (dateRange?.from) {
        const fromStr = format(dateRange.from, "dd/MM/yy", { locale: idLocale });
        const toStr = dateRange.to ? format(dateRange.to, "dd/MM/yy", { locale: idLocale }) : fromStr;
        doc.text(`Periode: ${fromStr} - ${toStr}`, 14, filterInfoY); filterInfoY += 5;
      }
      if (selectedUser !== "all") { doc.text(`Pengguna: ${selectedUser}`, 14, filterInfoY); filterInfoY += 5; }
      if (selectedOutlet !== "all") { doc.text(`Outlet: ${selectedOutlet}`, 14, filterInfoY); filterInfoY += 5; }
      if (selectedShiftId !== "all") {
        const shiftLabel = shiftsForSelect.find(s => s.value === selectedShiftId)?.label || selectedShiftId;
        doc.text(`Shift: ${shiftLabel}`, 14, filterInfoY); filterInfoY += 5;
      }
      if (selectedPaymentMethod !== "all") { doc.text(`Metode Bayar: ${selectedPaymentMethod}`, 14, filterInfoY); filterInfoY += 5;}


      const tableColumn = ["ID Trx", "Waktu", "Outlet", "Pengguna", "Produk", "Qty", "Harga", "Total", "HPP/Unit", "Total HPP", "Metode", "Keuntungan"];
      const tableRows: any[][] = [];

      filteredSalesData.forEach(sale => {
        const saleData = [
          sale.transactionId,
          format(parseISO(sale.timestamp), "dd/MM/yy, HH:mm", { locale: idLocale }),
          sale.outlet,
          sale.user,
          sale.productName,
          sale.quantity.toString(),
          `Rp ${sale.price.toLocaleString('id-ID')}`,
          `Rp ${sale.total.toLocaleString('id-ID')}`,
          `Rp ${sale.hppPerUnit.toLocaleString('id-ID')}`,
          `Rp ${sale.totalHpp.toLocaleString('id-ID')}`,
          sale.paymentMethod,
          `Rp ${sale.profit.toLocaleString('id-ID')}`
        ];
        tableRows.push(saleData);
      });

      tableRows.push([
        { content: "Total Keseluruhan", colSpan: 7, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: `Rp ${totalRevenue.toLocaleString('id-ID')}`, styles: { fontStyle: 'bold' } },
        { content: "" }, 
        { content: `Rp ${totalOverallHpp.toLocaleString('id-ID')}`, styles: { fontStyle: 'bold' } },
        { content: "" }, 
        { content: `Rp ${totalProfit.toLocaleString('id-ID')}`, styles: { fontStyle: 'bold' } }
      ]);
       tableRows.push([
        { content: "Total Transaksi", colSpan: 7, styles: { halign: 'right', fontStyle: 'bold' } },
        { content: totalTransactions.toLocaleString('id-ID'), styles: { fontStyle: 'bold' } },
        { content: "", colSpan: 4}, 
      ]);
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: filterInfoY + 3,
        theme: 'grid',
        headStyles: { fillColor: [60, 56, 91], textColor: 255, fontSize: 7 }, 
        styles: { font: "helvetica", fontSize: 6.5, cellPadding: 1.5 }, 
        columnStyles: { // Adjusted widths
          0: { cellWidth: 12 }, // ID Trx
          1: { cellWidth: 18 }, // Waktu
          2: { cellWidth: 18 }, // Outlet
          3: { cellWidth: 18 }, // Pengguna
          4: { cellWidth: 30 }, // Produk (wider)
          5: { halign: 'right', cellWidth: 8 }, // Qty
          6: { halign: 'right', cellWidth: 17 }, // Harga
          7: { halign: 'right', cellWidth: 17 }, // Total
          8: { halign: 'right', cellWidth: 17 }, // HPP/Unit
          9: { halign: 'right', cellWidth: 17 }, // Total HPP
          10: { cellWidth: 12 }, // Metode (narrower)
          11: { halign: 'right', cellWidth: 17 }, // Keuntungan
        }
      });
      
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text( `Halaman ${i} dari ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10 );
      }

      doc.save(fileName);
      toast({ title: "Unduh PDF Berhasil", description: `Laporan penjualan telah berhasil diunduh sebagai ${fileName}.` });

    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      toast({ title: "Unduh PDF Gagal", description: "Terjadi kesalahan saat membuat laporan PDF.", variant: "destructive" });
    }
  };

  const handleDownloadExcelReport = () => {
    if (filteredSalesData.length === 0) {
      toast({ title: "Tidak Ada Data", description: "Tidak ada data penjualan untuk filter yang dipilih.", variant: "destructive" });
      return;
    }
    try {
      const reportTitle = "Laporan Penjualan Rinci";
      const fileName = `Laporan_Penjualan_${format(new Date(), "yyyyMMddHHmmss")}.xlsx`;
      
      const header = ["ID Transaksi", "Waktu", "Outlet", "Pengguna", "Nama Produk", "Kuantitas", "Harga Satuan (Rp)", "Total Penjualan (Rp)", "HPP/Unit (Rp)", "Total HPP (Rp)", "Metode Pembayaran", "Keuntungan (Rp)"];
      
      const dataForExcel = filteredSalesData.map(sale => [
        sale.transactionId,
        format(parseISO(sale.timestamp), "dd/MM/yyyy HH:mm:ss", { locale: idLocale }),
        sale.outlet,
        sale.user,
        sale.productName,
        sale.quantity,
        sale.price,
        sale.total,
        sale.hppPerUnit,
        sale.totalHpp,
        sale.paymentMethod,
        sale.profit
      ]);

      const worksheetData = [header, ...dataForExcel];
      
      const totalRowIndex = worksheetData.length + 1; // Excel row number for totals (1-based)
      const totalDataRow = [
        "", "", "", "", "", "Total Keseluruhan:", "",
        { t: 'n', f: `SUM(H2:H${totalRowIndex-1})` }, // Total Penjualan
        "",
        { t: 'n', f: `SUM(J2:J${totalRowIndex-1})` }, // Total HPP
        "",
        { t: 'n', f: `SUM(L2:L${totalRowIndex-1})` }  // Keuntungan
      ];
      worksheetData.push(totalDataRow);
      
      const transactionsRow = ["", "", "", "", "", "Total Transaksi:", totalTransactions];
      worksheetData.push(transactionsRow);

      const ws = XLSX.utils.aoa_to_sheet(worksheetData);

      // Apply number formatting for currency columns (H, I, J, L)
      const moneyCols = ['H', 'I', 'J', 'L'];
      for (let R = 1; R < totalRowIndex; ++R) { // Data rows (0-indexed for loop, R+1 for Excel row)
          moneyCols.forEach(C => {
              const cellAddress = `${C}${R + 1}`;
              if (ws[cellAddress] && typeof ws[cellAddress].v === 'number') {
                  ws[cellAddress].z = '"Rp"#,##0';
              }
          });
      }
      // Format total cells
      if(ws[`H${totalRowIndex}`]) ws[`H${totalRowIndex}`].z = '"Rp"#,##0';
      if(ws[`J${totalRowIndex}`]) ws[`J${totalRowIndex}`].z = '"Rp"#,##0';
      if(ws[`L${totalRowIndex}`]) ws[`L${totalRowIndex}`].z = '"Rp"#,##0';
      

      // Auto-fit columns (basic)
      const colWidths = header.map((_, i) => ({
        wch: Math.max(...worksheetData.map(row => row[i] ? String(row[i]).length : 0), header[i].length) + 2
      }));
      ws['!cols'] = colWidths;


      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Penjualan");
      XLSX.writeFile(wb, fileName);

      toast({ title: "Unduh Excel Berhasil", description: `Laporan penjualan telah berhasil diunduh sebagai ${fileName}.` });

    } catch (error) {
      console.error("Gagal membuat Excel:", error);
      toast({ title: "Unduh Excel Gagal", description: "Terjadi kesalahan saat membuat laporan Excel.", variant: "destructive" });
    }
  };


  if (isLoading) {
    return (
      <div>
        <PageHeader title="Laporan Penjualan" description="Analisis detail penjualan, biaya, dan keuntungan Anda." />
        <div className="flex justify-center items-center h-64"> <p>Memuat data laporan...</p> </div>
      </div>
    );
  }

  if (!activeCompanyId && !isLoading) {
    return (
      <div>
        <PageHeader title="Laporan Penjualan" description="Pilih perusahaan untuk melihat laporan."/>
        <Card className="shadow-lg">
          <CardContent className="pt-6 flex justify-center items-center h-64">
            <p className="text-muted-foreground">Pilih perusahaan aktif terlebih dahulu untuk melihat laporan penjualan.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Laporan Penjualan" description="Analisis detail penjualan, biaya, dan keuntungan Anda.">
        <Button variant="outline" onClick={handleDownloadPdfReport} className="mr-2">
          <Download className="mr-2 h-4 w-4" /> Unduh PDF
        </Button>
        <Button variant="outline" onClick={handleDownloadExcelReport}>
          <FileSpreadsheet className="mr-2 h-4 w-4" /> Unduh Excel
        </Button>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalRevenue.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
         <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total HPP Penjualan</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalOverallHpp.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keuntungan</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalProfit.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Filter className="mr-2 h-5 w-5"/> Filter Laporan</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div>
            <Label htmlFor="date-range">Rentang Tanggal</Label>
            <DatePickerWithRange className="mt-1" date={dateRange} onDateChange={setDateRange} />
          </div>
          <div>
            <Label htmlFor="user-filter">Pengguna (Kasir)</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger id="user-filter" className="mt-1"><SelectValue placeholder="Semua Pengguna" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pengguna</SelectItem>
                {uniqueUsers.map(user => ( <SelectItem key={user} value={user}>{user}</SelectItem> ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="outlet-filter">Outlet</Label>
            <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
              <SelectTrigger id="outlet-filter" className="mt-1"><SelectValue placeholder="Semua Outlet" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Outlet</SelectItem>
                 {uniqueOutlets.map(outlet => ( <SelectItem key={outlet} value={outlet}>{outlet}</SelectItem> ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="shift-filter">Shift</Label>
            <Select value={selectedShiftId} onValueChange={setSelectedShiftId}>
              <SelectTrigger id="shift-filter" className="mt-1"><SelectValue placeholder="Semua Shift" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Shift</SelectItem>
                 {shiftsForSelect.map(shift => ( <SelectItem key={shift.value} value={shift.value}>{shift.label}</SelectItem> ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="payment-method-filter">Metode Bayar</Label>
            <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <SelectTrigger id="payment-method-filter" className="mt-1"><SelectValue placeholder="Semua Metode" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Metode</SelectItem>
                 {paymentMethods.map(method => ( <SelectItem key={method} value={method}>{method}</SelectItem> ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detail Penjualan</CardTitle>
          <CardDescription>Menampilkan {filteredSalesData.length} baris transaksi.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px] hidden xl:table-cell">ID Transaksi</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead className="hidden sm:table-cell">Outlet</TableHead>
                <TableHead className="hidden md:table-cell">Pengguna</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead className="text-right">Jml</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Harga</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right hidden lg:table-cell">HPP/Unit</TableHead>
                <TableHead className="text-right hidden xl:table-cell">Total HPP</TableHead>
                <TableHead className="hidden md:table-cell">Metode</TableHead>
                <TableHead className="text-right">Keuntungan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSalesData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={12} className="text-center text-muted-foreground py-10">
                    Tidak ada data penjualan yang cocok dengan filter yang dipilih.
                  </TableCell>
                </TableRow>
              )}
              {filteredSalesData.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="text-xs hidden xl:table-cell">{sale.transactionId}</TableCell>
                  <TableCell>{format(parseISO(sale.timestamp), "dd/MM/yy, HH:mm", { locale: idLocale })}</TableCell>
                  <TableCell className="hidden sm:table-cell max-w-[100px] truncate">{sale.outlet}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-[100px] truncate">{sale.user}</TableCell>
                  <TableCell className="font-medium max-w-[150px] truncate">{sale.productName}</TableCell>
                  <TableCell className="text-right">{sale.quantity}</TableCell>
                  <TableCell className="text-right hidden lg:table-cell">Rp {sale.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right">Rp {sale.total.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right hidden lg:table-cell">Rp {sale.hppPerUnit.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right hidden xl:table-cell">Rp {sale.totalHpp.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="hidden md:table-cell">{sale.paymentMethod}</TableCell>
                  <TableCell className="text-right">Rp {sale.profit.toLocaleString('id-ID')}</TableCell>
                </TableRow>
              ))}
              {filteredSalesData.length > 0 && (
                 <TableRow className="font-bold bg-muted/50">
                  {/* Label Cell - Adapts to screen size */}
                  <TableCell 
                    className="text-right"
                    colSpan={ (( (typeof window !== 'undefined' && window.innerWidth >= 1280) ? 1 : 0) + /* ID Transaksi (XL) */
                                1 + /* Waktu */
                                ( (typeof window !== 'undefined' && window.innerWidth >= 640) ? 1 : 0) + /* Outlet (SM+) */
                                ( (typeof window !== 'undefined' && window.innerWidth >= 768) ? 1 : 0) + /* Pengguna (MD+) */
                                1 + /* Nama Produk */
                                1 + /* Jml */
                                ( (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 1 : 0) /* Harga (LG+) */
                              ) -1 /* Subtract 1 because the label itself is a cell */                               
                              || 1 /* Min colSpan */
                            }
                  >Total (Filtered):</TableCell>
                  
                  {/* Total Revenue (aligns with "Total" column) */}
                  <TableCell className="text-right">Rp {totalRevenue.toLocaleString('id-ID')}</TableCell>
                  
                  {/* HPP/Unit - Placeholder, content only if column is visible */}
                  <TableCell className="text-right hidden lg:table-cell"></TableCell>
                  
                  {/* Total HPP - Content only if column is visible */}
                  <TableCell className="text-right hidden xl:table-cell">Rp {totalOverallHpp.toLocaleString('id-ID')}</TableCell>
                  
                  {/* Metode - Placeholder, content only if column is visible */}
                  <TableCell className="hidden md:table-cell"></TableCell>
                  
                  {/* Keuntungan */}
                  <TableCell className="text-right">Rp {totalProfit.toLocaleString('id-ID')}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

    
