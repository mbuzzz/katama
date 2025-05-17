
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
import { Download, Search, Package, Archive, DollarSign, TrendingUp, FileSpreadsheet } from "lucide-react"; // Added FileSpreadsheet
import { Badge } from "@/components/ui/badge";
import { getMockProducts } from "@/data/products";
import { getMockRawMaterials } from "@/data/raw-materials";
import { getMockUnits } from "@/data/units"; 
import type { Product } from "@/types/product";
import type { RawMaterial } from "@/types/raw-material";
import type { Unit } from "@/types/unit";
import { useToast } from "@/hooks/use-toast"; 
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface StockItem {
  id: string;
  name: string;
  type: "Produk Jadi" | "Bahan Baku";
  categoryOrType: string; 
  quantity: number;
  unit: string; 
  status: "Stok Aman" | "Stok Menipis" | "Stok Habis";
  icon: React.ElementType;
  costOrHppPerUnit?: number; 
  sellingPricePerUnit?: number; 
  stockValueAtCostOrHpp?: number;
  stockValueAtSellingPrice?: number; 
  potentialProfit?: number; 
}

const LOW_STOCK_THRESHOLD_PRODUCT = 10; 
const LOW_STOCK_THRESHOLD_RAWMATERIAL = 20; 

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export default function StockReportPage() {
  const [allStockItems, setAllStockItems] = React.useState<StockItem[]>([]);
  const [filteredStockItems, setFilteredStockItems] = React.useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { toast } = useToast(); 
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchedUnits = getMockUnits();
    const products = getMockProducts();
    const rawMaterials = getMockRawMaterials();

    const productStockItems: StockItem[] = products.map(p => {
      let status: StockItem["status"] = "Stok Aman";
      if (p.stock === 0) status = "Stok Habis";
      else if (p.stock < LOW_STOCK_THRESHOLD_PRODUCT) status = "Stok Menipis";
      
      const hpp = p.hpp || 0;
      const stockValueAtHpp = p.stock * hpp;
      const stockValueAtSelling = p.stock * p.price;
      const potentialProfit = stockValueAtSelling - stockValueAtHpp;

      return {
        id: `prod-${p.id}`,
        name: p.name,
        type: "Produk Jadi",
        categoryOrType: p.category,
        quantity: p.stock,
        unit: "unit", 
        status,
        icon: Package,
        costOrHppPerUnit: hpp,
        sellingPricePerUnit: p.price,
        stockValueAtCostOrHpp: stockValueAtHpp,
        stockValueAtSellingPrice: stockValueAtSelling,
        potentialProfit: potentialProfit,
      };
    });

    const rawMaterialStockItems: StockItem[] = rawMaterials.map(rm => {
      let status: StockItem["status"] = "Stok Aman";
      if (rm.stock === 0) status = "Stok Habis";
      else if (rm.stock < LOW_STOCK_THRESHOLD_RAWMATERIAL) status = "Stok Menipis"; 
      
      const unitInfo = fetchedUnits.find(u => u.id === rm.unitId);
      const costPerUnit = rm.costPerUnit || 0;
      const stockValueAtCost = rm.stock * costPerUnit;

      return {
        id: `rm-${rm.id}`,
        name: rm.name,
        type: "Bahan Baku",
        categoryOrType: "Bahan Baku",
        quantity: rm.stock,
        unit: unitInfo?.abbreviation || "N/A",
        status,
        icon: Archive,
        costOrHppPerUnit: costPerUnit,
        stockValueAtCostOrHpp: stockValueAtCost,
      };
    });

    const combinedItems = [...productStockItems, ...rawMaterialStockItems].sort((a,b) => a.name.localeCompare(b.name));
    setAllStockItems(combinedItems);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (isLoading) return;
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = allStockItems.filter(item => 
      item.name.toLowerCase().includes(lowerSearchTerm) ||
      item.categoryOrType.toLowerCase().includes(lowerSearchTerm) ||
      item.type.toLowerCase().includes(lowerSearchTerm) ||
      item.status.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredStockItems(filtered);
  }, [searchTerm, allStockItems, isLoading]);
  
  const summaryValues = React.useMemo(() => {
    const productItems = filteredStockItems.filter(item => item.type === "Produk Jadi");
    const rawMaterialItems = filteredStockItems.filter(item => item.type === "Bahan Baku");

    return {
      totalProductStockValueAtSelling: productItems.reduce((sum, item) => sum + (item.stockValueAtSellingPrice || 0), 0),
      totalProductPotentialProfit: productItems.reduce((sum, item) => sum + (item.potentialProfit || 0), 0),
      totalRawMaterialValueAtCost: rawMaterialItems.reduce((sum, item) => sum + (item.stockValueAtCostOrHpp || 0), 0),
      totalProductValueAtHpp: productItems.reduce((sum, item) => sum + (item.stockValueAtCostOrHpp || 0), 0),
    };
  }, [filteredStockItems]);


  const handleDownloadPdfReport = () => {
     if (filteredStockItems.length === 0) {
      toast({ title: "Tidak Ada Data", description: "Tidak ada data stok untuk filter yang dipilih.", variant: "destructive" });
      return;
    }
     try {
      const doc = new jsPDF('landscape') as jsPDFWithAutoTable; 
      const currentDate = format(new Date(), "dd MMMM yyyy HH:mm", { locale: idLocale });
      const reportTitle = "Laporan Stok Rinci";
      const fileName = `Laporan_Stok_${format(new Date(), "yyyyMMddHHmmss")}.pdf`;

      doc.setFontSize(16);
      doc.text(reportTitle, 14, 20);
      doc.setFontSize(10);
      doc.text(`Tanggal Laporan: ${currentDate}`, 14, 26);
      doc.text(`Filter Pencarian: ${searchTerm || "Tidak ada"}`, 14, 31);

      const tableColumn = [
        "Tipe", "Nama", "Kategori/Jenis", "Status", 
        "Jml", "Satuan", "Biaya/HPP /unit", "Harga Jual /unit",
        "Nilai Stok (Biaya/HPP)", "Nilai Stok (Jual)", "Potensi Profit"
      ];
      const tableRows: any[][] = [];

      filteredStockItems.forEach(item => {
        const itemData = [
          item.type,
          item.name,
          item.categoryOrType,
          item.status,
          item.quantity.toLocaleString('id-ID'),
          item.unit,
          `Rp ${(item.costOrHppPerUnit || 0).toLocaleString('id-ID')}`,
          item.type === "Produk Jadi" ? `Rp ${(item.sellingPricePerUnit || 0).toLocaleString('id-ID')}` : "-",
          `Rp ${(item.stockValueAtCostOrHpp || 0).toLocaleString('id-ID')}`,
          item.type === "Produk Jadi" ? `Rp ${(item.stockValueAtSellingPrice || 0).toLocaleString('id-ID')}` : "-",
          item.type === "Produk Jadi" ? `Rp ${(item.potentialProfit || 0).toLocaleString('id-ID')}` : "-",
        ];
        tableRows.push(itemData);
      });
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 38, 
        theme: 'grid',
        headStyles: { fillColor: [60, 56, 91], textColor: 255, fontSize: 8 }, 
        styles: { font: "helvetica", fontSize: 7.5, cellPadding: 1.5 },
        columnStyles: {
          0: { cellWidth: 20 }, 1: { cellWidth: 35 }, 2: { cellWidth: 25 }, 3: { cellWidth: 20 }, 
          4: { halign: 'right', cellWidth: 12 }, 5: { cellWidth: 10 }, 
          6: { halign: 'right', cellWidth: 22 }, 7: { halign: 'right', cellWidth: 22 }, 
          8: { halign: 'right', cellWidth: 25 }, 9: { halign: 'right', cellWidth: 25 }, 
          10: { halign: 'right', cellWidth: 22 },
        }
      });

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text( `Halaman ${i} dari ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
      }

      doc.save(fileName);
      toast({ title: "Unduh PDF Berhasil", description: `Laporan stok telah berhasil diunduh sebagai ${fileName}.`});

    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      toast({ title: "Unduh PDF Gagal", description: "Terjadi kesalahan saat membuat laporan PDF.", variant: "destructive"});
    }
  };
  
  const handleDownloadExcelReport = () => {
    if (filteredStockItems.length === 0) {
      toast({ title: "Tidak Ada Data", description: "Tidak ada data stok untuk filter yang dipilih.", variant: "destructive" });
      return;
    }
    try {
      const fileName = `Laporan_Stok_${format(new Date(), "yyyyMMddHHmmss")}.xlsx`;
      const header = [
        "Tipe Barang", "Nama Barang", "Kategori/Jenis", "Status Stok", 
        "Kuantitas", "Satuan", "Biaya/HPP per Unit (Rp)", "Harga Jual per Unit (Rp)",
        "Total Nilai Stok (Biaya/HPP) (Rp)", "Total Nilai Stok (Harga Jual) (Rp)", "Total Potensi Profit (Rp)"
      ];
      
      const dataForExcel = filteredStockItems.map(item => [
        item.type,
        item.name,
        item.categoryOrType,
        item.status,
        item.quantity,
        item.unit,
        item.costOrHppPerUnit || 0,
        item.type === "Produk Jadi" ? (item.sellingPricePerUnit || 0) : null, // Null for raw materials
        item.stockValueAtCostOrHpp || 0,
        item.type === "Produk Jadi" ? (item.stockValueAtSellingPrice || 0) : null,
        item.type === "Produk Jadi" ? (item.potentialProfit || 0) : null
      ]);

      const worksheetData = [header, ...dataForExcel];
      
      const totalRowIndex = worksheetData.length + 1; 
      const productItems = filteredStockItems.filter(item => item.type === "Produk Jadi");
      const rawMaterialItems = filteredStockItems.filter(item => item.type === "Bahan Baku");

      const totalDataRow = [
        "", "", "", "", "", "Total Produk Jadi:", "", "",
        { t: 'n', f: `SUM(I2:I${productItems.length + 1})` },          // Sum of Product HPP values (adjust range if only products)
        { t: 'n', f: `SUM(J2:J${productItems.length + 1})` },          // Sum of Product Selling values
        { t: 'n', f: `SUM(K2:K${productItems.length + 1})` }           // Sum of Product Profit
      ];
       worksheetData.push(totalDataRow);

       const totalRawMaterialRow = [
        "", "", "", "", "", "Total Bahan Baku:", "", "",
        { t: 'n', f: `SUMIFS(I:I, A:A, "Bahan Baku")` }, // Sum of Raw Material Cost values
        "", ""
      ];
      worksheetData.push(totalRawMaterialRow);


      const ws = XLSX.utils.aoa_to_sheet(worksheetData);

      // Apply number formatting for currency columns (G, H, I, J, K)
      const moneyCols = ['G', 'H', 'I', 'J', 'K'];
      for (let R = 1; R < worksheetData.length; ++R) { // Iterate through all data rows including total rows
          moneyCols.forEach(C => {
              const cellAddress = `${C}${R + 1}`;
              if (ws[cellAddress] && (ws[cellAddress].v !== null && ws[cellAddress].v !== undefined)) { // Check for null/undefined before formatting
                  if (typeof ws[cellAddress].v === 'number' || (ws[cellAddress].t === 'n' && ws[cellAddress].f)) { // Is a number or a formula resulting in a number
                    ws[cellAddress].z = '"Rp"#,##0';
                  }
              }
          });
      }
      
      // Auto-fit columns
      const colWidths = header.map((_, i) => ({
        wch: Math.max(...worksheetData.map(row => row[i] ? String(row[i]).length : 0), header[i].length) + 2
      }));
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Laporan Stok");
      XLSX.writeFile(wb, fileName);

      toast({ title: "Unduh Excel Berhasil", description: `Laporan stok telah berhasil diunduh sebagai ${fileName}.` });
    } catch (error) {
      console.error("Gagal membuat Excel:", error);
      toast({ title: "Unduh Excel Gagal", description: "Terjadi kesalahan saat membuat laporan Excel.", variant: "destructive" });
    }
  };
  
  if (isLoading) {
    return (
      <div>
        <PageHeader title="Laporan Stok" description="Monitor ketersediaan stok barang jadi dan bahan baku." />
        <div className="flex justify-center items-center h-64"><p>Memuat data laporan...</p></div>
      </div>
    );
  }


  return (
    <div>
      <PageHeader title="Laporan Stok" description="Monitor ketersediaan stok barang jadi dan bahan baku.">
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
            <CardTitle className="text-sm font-medium">Total Nilai Stok Produk (Jual)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {summaryValues.totalProductStockValueAtSelling.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Potensi Profit Produk</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {summaryValues.totalProductPotentialProfit.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nilai Stok Bahan Baku (Biaya)</CardTitle>
            <Archive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {summaryValues.totalRawMaterialValueAtCost.toLocaleString('id-ID')}</div>
          </CardContent>
        </Card>
      </div>


      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle>Filter Stok</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Cari nama, kategori, tipe, atau status..." 
              className="pl-8 h-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Detail Stok Barang</CardTitle>
          <CardDescription>Menampilkan {filteredStockItems.length} item stok.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px] p-2">Tipe</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead className="hidden md:table-cell">Kategori/Jenis</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Biaya/HPP /unit</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Hrg.Jual /unit</TableHead>
                <TableHead className="text-right hidden xl:table-cell">Nilai Stok (HPP)</TableHead>
                <TableHead className="text-right hidden xl:table-cell">Nilai Stok (Jual)</TableHead>
                <TableHead className="text-right hidden xl:table-cell">Potensi Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStockItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="text-center text-muted-foreground py-10">
                    Tidak ada item stok yang cocok dengan pencarian Anda.
                  </TableCell>
                </TableRow>
              )}
              {filteredStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="p-2">
                    <item.icon className="h-5 w-5 text-muted-foreground" title={item.type} />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{item.categoryOrType}</TableCell>
                  <TableCell className="text-right">{item.quantity.toLocaleString('id-ID')}</TableCell>
                  <TableCell>{item.unit}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.status === "Stok Aman" ? "default" :
                        item.status === "Stok Menipis" ? "secondary" : 
                        "destructive" 
                      }
                      className={
                        item.status === "Stok Aman" ? "bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-200 border-green-300 dark:border-green-700" :
                        item.status === "Stok Menipis" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700" :
                        item.status === "Stok Habis" ? "bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-200 border-red-300 dark:border-red-700" : ""
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right hidden lg:table-cell">Rp {(item.costOrHppPerUnit || 0).toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right hidden lg:table-cell">{item.type === "Produk Jadi" ? `Rp ${(item.sellingPricePerUnit || 0).toLocaleString('id-ID')}` : "-"}</TableCell>
                  <TableCell className="text-right hidden xl:table-cell">Rp {(item.stockValueAtCostOrHpp || 0).toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-right hidden xl:table-cell">{item.type === "Produk Jadi" ? `Rp ${(item.stockValueAtSellingPrice || 0).toLocaleString('id-ID')}` : "-"}</TableCell>
                  <TableCell className="text-right hidden xl:table-cell">{item.type === "Produk Jadi" ? `Rp ${(item.potentialProfit || 0).toLocaleString('id-ID')}` : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

