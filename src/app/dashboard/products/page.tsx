import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Edit, Trash2, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data
const mockProducts = [
  { id: "1", name: "Kopi Susu Aren", hpp: 8000, price: 18000, margin: 10000, stock: 50, image: "https://picsum.photos/40/40?random=1", variants: 2, category: "Minuman" },
  { id: "2", name: "Croissant Coklat", hpp: 12000, price: 22000, margin: 10000, stock: 30, image: "https://picsum.photos/40/40?random=2", variants: 0, category: "Makanan" },
  { id: "3", name: "Teh Melati", hpp: 5000, price: 15000, margin: 10000, stock: 100, image: "https://picsum.photos/40/40?random=3", variants: 1, category: "Minuman" },
];

export default function ProductsPage() {
  return (
    <div>
      <PageHeader title="Produk" description="Kelola daftar produk Anda.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Produk
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
                <TableHead className="hidden md:table-cell">Stok</TableHead>
                <TableHead className="hidden md:table-cell">Varian</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                      height="40"
                      src={product.image}
                      width="40"
                      data-ai-hint={`${product.category} ${product.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">Rp {product.hpp.toLocaleString()}</TableCell>
                  <TableCell>Rp {product.price.toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell">Rp {product.margin.toLocaleString()}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
                  <TableCell className="hidden md:table-cell">{product.variants > 0 ? `${product.variants} Varian` : '-'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
