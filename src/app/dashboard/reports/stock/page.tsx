
"use client"; 

import * as React from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Search, Package, Archive } from "lucide-react";
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
}


const LOW_STOCK_THRESHOLD_PRODUCT = 10; // Adjusted threshold for demo
const LOW_STOCK_THRESHOLD_RAWMATERIAL = 20; // Adjusted threshold for demo

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export default function StockReportPage() {
  const [allStockItems, setAllStockItems] = React.useState<StockItem[]>([]);
  const [filteredStockItems, setFilteredStockItems] = React.useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  // const [units, setUnits] = React.useState<Unit[]>([]); // Units are fetched and used directly in effect
  const { toast } = useToast(); 

  React.useEffect(() => {
    const fetchedUnits = getMockUnits();
    // setUnits(fetchedUnits); // Not strictly needed in state if only used here

    const products = getMockProducts();
    const rawMaterials = getMockRawMaterials();

    const productStockItems: StockItem[] = products.map(p => {
      let status: StockItem["status"] = "Stok Aman";
      if (p.stock === 0) status = "Stok Habis";
      else if (p.stock < LOW_STOCK_THRESHOLD_PRODUCT) status = "Stok Menipis";
      return {
        id: `prod-${p.id}`,
        name: p.name,
        type: "Produk Jadi",
        categoryOrType: p.category,
        quantity: p.stock,
        unit: "unit", 
        status,
        icon: Package,
      };
    });

    const rawMaterialStockItems: StockItem[] = rawMaterials.map(rm => {
      let status: StockItem["status"] = "Stok Aman";
      if (rm.stock === 0) status = "Stok Habis";
      else if (rm.stock < LOW_STOCK_THRESHOLD_RAWMATERIAL) status = "Stok Menipis"; 
      
      const unitInfo = fetchedUnits.find(u => u.id === rm.unitId);
      return {
        id: `rm-${rm.id}`,
        name: rm.name,
        type: "Bahan Baku",
        categoryOrType: "Bahan Baku", // Or derive more specific type if available
        quantity: rm.stock,
        unit: unitInfo?.abbreviation || "N/A",
        status,
        icon: Archive,
      };
    });

    const combinedItems = [...productStockItems, ...rawMaterialStockItems].sort((a,b) => a.name.localeCompare(b.name));
    setAllStockItems(combinedItems);
    // setFilteredStockItems(combinedItems); // Initial filter will be applied by the next effect
  }, []);

  React.useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = allStockItems.filter(item => 
      item.name.toLowerCase().includes(lowerSearchTerm) ||
      item.categoryOrType.toLowerCase().includes(lowerSearchTerm) ||
      item.type.toLowerCase().includes(lowerSearchTerm) ||
      item.status.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredStockItems(filtered);
  }, [searchTerm, allStockItems]);

  const handleDownloadReport = () => {
     if (filteredStockItems.length === 0) {
      toast({
        title: "Tidak Ada Data",
        description: "Tidak ada data stok untuk filter yang dipilih.",
        variant: "destructive",
      });
      return;
    }
     try {
      const doc = new jsPDF() as jsPDFWithAutoTable;
      const currentDate = format(new Date(), "dd MMMM yyyy HH:mm", { locale: idLocale });
      const reportTitle = "Laporan Stok";
      const fileName = `Laporan_Stok_${format(new Date(), "yyyyMMddHHmmss")}.pdf`;

      doc.setFontSize(18);
      doc.text(reportTitle, 14, 22);
      doc.setFontSize(10);
      doc.text(`Tanggal Laporan: ${currentDate}`, 14, 30);
      doc.text(`Filter Pencarian: ${searchTerm || "Tidak ada"}`, 14, 35);


      const tableColumn = ["Tipe", "Nama Barang", "Kategori/Jenis", "Jumlah", "Satuan", "Status"];
      const tableRows: any[][] = [];

      filteredStockItems.forEach(item => {
        const itemData = [
          item.type,
          item.name,
          item.categoryOrType,
          item.quantity.toLocaleString('id-ID'),
          item.unit,
          item.status
        ];
        tableRows.push(itemData);
      });
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 42, 
        theme: 'grid',
        headStyles: { fillColor: [60, 56, 91], textColor: 255 }, 
        styles: { font: "helvetica", fontSize: 9 },
        columnStyles: {
          3: { halign: 'right' },
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
        description: `Laporan stok telah berhasil diunduh sebagai ${fileName}.`,
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
      <PageHeader title="Laporan Stok" description="Monitor ketersediaan stok barang jadi dan bahan baku.">
        <Button variant="outline" onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" /> Unduh Laporan PDF
        </Button>
      </PageHeader>

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
                <TableHead className="w-[50px]">Tipe</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Kategori/Jenis</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStockItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                    Tidak ada item stok yang cocok dengan pencarian Anda.
                  </TableCell>
                </TableRow>
              )}
              {filteredStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <item.icon className="h-5 w-5 text-muted-foreground" title={item.type} />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.categoryOrType}</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
