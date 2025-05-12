
"use client"; // For useState, useEffect

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, Search, Package, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getMockProducts } from "@/data/products";
import { getMockRawMaterials } from "@/data/raw-materials";
import { getMockUnits } from "@/data/units"; // To get unit names/abbreviations
import type { Product } from "@/types/product";
import type { RawMaterial } from "@/types/raw-material";
import type { Unit } from "@/types/unit";
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface StockItem {
  id: string;
  name: string;
  type: "Produk Jadi" | "Bahan Baku";
  categoryOrType: string; // Category for Product, Type/Name for Raw Material
  quantity: number;
  unit: string; // Unit abbreviation
  status: "Stok Aman" | "Stok Menipis" | "Stok Habis";
  icon: React.ElementType;
}

// Define thresholds for stock status
const LOW_STOCK_THRESHOLD_PRODUCT = 5;
const LOW_STOCK_THRESHOLD_RAWMATERIAL = 10; // Example, can be per material

export default function StockReportPage() {
  const [allStockItems, setAllStockItems] = React.useState<StockItem[]>([]);
  const [filteredStockItems, setFilteredStockItems] = React.useState<StockItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [units, setUnits] = React.useState<Unit[]>([]);
  const { toast } = useToast(); // Initialize useToast

  React.useEffect(() => {
    const fetchedUnits = getMockUnits();
    setUnits(fetchedUnits);

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
        categoryOrType: "Bahan Baku", 
        quantity: rm.stock,
        unit: unitInfo?.abbreviation || "N/A",
        status,
        icon: Archive,
      };
    });

    const combinedItems = [...productStockItems, ...rawMaterialStockItems].sort((a,b) => a.name.localeCompare(b.name));
    setAllStockItems(combinedItems);
    setFilteredStockItems(combinedItems);

  }, []);

  React.useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = allStockItems.filter(item => 
      item.name.toLowerCase().includes(lowerSearchTerm) ||
      item.categoryOrType.toLowerCase().includes(lowerSearchTerm) ||
      item.type.toLowerCase().includes(lowerSearchTerm)
    );
    setFilteredStockItems(filtered);
  }, [searchTerm, allStockItems]);

  const handleDownloadReport = () => {
    toast({
      title: "Unduh Laporan (Dalam Pengembangan)",
      description: "Fitur unduh laporan PDF sedang dalam pengembangan dan akan segera tersedia.",
      duration: 5000,
    });
    // Placeholder for actual PDF generation logic
    console.log("Attempting to download stock report PDF...");
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
            <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Cari nama barang, kategori, atau tipe..." 
              className="pl-8" 
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
                        item.status === "Stok Aman" ? "bg-green-100 text-green-800 border-green-300" :
                        item.status === "Stok Menipis" ? "bg-yellow-100 text-yellow-800 border-yellow-300" :
                        "" 
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
