import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@/types/product";

// Mock data - Updated to be compatible with the new Product type
const mockProducts: Product[] = [
  { id: "1", name: "Kopi Susu Aren", hpp: 8000, price: 18000, stock: 50, image: "https://picsum.photos/40/40?random=1", category: "Minuman Dingin", ingredients: [{rawMaterialId: "rm1", quantity: 20}, {rawMaterialId: "rm2", quantity: 100}, {rawMaterialId: "rm3", quantity: 15}] },
  { id: "2", name: "Croissant Coklat", hpp: 12000, price: 22000, stock: 30, image: "https://picsum.photos/40/40?random=2", category: "Roti & Pastry" },
  { id: "3", name: "Teh Melati Panas", hpp: 5000, price: 15000, stock: 100, image: "https://picsum.photos/40/40?random=3", category: "Minuman Panas", ingredients: [{rawMaterialId: "rm6", quantity: 5}] },
  { id: "4", name: "Nasi Goreng Spesial", hpp: 18000, price: 35000, stock: 25, image: "https://picsum.photos/40/40?random=4", category: "Makanan Berat" },
];

export default function ProductsPage() {
  return (
    <div>
      <PageHeader title="Produk" description="Kelola daftar produk Anda.">
        <Button asChild>
          <Link href="/dashboard/products/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk
          </Link>
        </Button>
      </PageHeader>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Daftar Produk</CardTitle>
          <CardDescription>Total {mockProducts.length} produk ditemukan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Gambar</TableHead>
                <TableHead>Nama Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="hidden md:table-cell">HPP</TableHead>
                <TableHead>Harga Jual</TableHead>
                <TableHead className="hidden md:table-cell">Margin</TableHead>
                <TableHead>Stok</TableHead>
                {/* <TableHead className="hidden md:table-cell">Varian</TableHead> */}
                <TableHead>
                  <span className="sr-only">Aksi</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => {
                const margin = product.hpp ? product.price - product.hpp : product.price;
                return (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="40"
                        src={product.image || "https://picsum.photos/40/40?random=placeholder"}
                        width="40"
                        data-ai-hint={`${product.category} produk`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">Rp {product.hpp?.toLocaleString('id-ID') || "-"}</TableCell>
                    <TableCell>Rp {product.price.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="hidden md:table-cell">Rp {margin.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    {/* <TableCell className="hidden md:table-cell">{product.variants?.length || '-'} Varian</TableCell> */}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Alihkan menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                            {/* Future: <Link href={`/dashboard/products/edit/${product.id}`}>Edit</Link> */}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
