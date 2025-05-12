
"use client";

import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle, Trash2, Printer, CreditCard, QrCode, DollarSignIcon } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  variants?: { name: string; price: number }[];
}

interface CartItem extends Product {
  quantity: number;
  // selectedVariant?: { name: string; price: number }; // For future use
}

// Mock data
const mockProducts: Product[] = [
  { id: "1", name: "Kopi Susu Aren", price: 18000, image: "https://picsum.photos/100/100?random=1", category: "Minuman", variants: [{name: "Less Sugar", price: 0}, {name: "Extra Shot", price: 5000}] },
  { id: "2", name: "Croissant Coklat", price: 22000, image: "https://picsum.photos/100/100?random=2", category: "Makanan" },
  { id: "3", name: "Teh Melati", price: 15000, image: "https://picsum.photos/100/100?random=3", category: "Minuman" },
  { id: "4", name: "Nasi Goreng Spesial", price: 35000, image: "https://picsum.photos/100/100?random=4", category: "Makanan" },
  { id: "5", name: "Americano", price: 16000, image: "https://picsum.photos/100/100?random=5", category: "Minuman" },
  { id: "6", name: "Donat Gula", price: 10000, image: "https://picsum.photos/100/100?random=6", category: "Makanan" },
];

export default function POSPage() {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { toast } = useToast();

  const handleAddProductToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    toast({ title: `${product.name} ditambahkan ke keranjang.` });
  };

  const handleUpdateQuantity = (productId: string, change: number) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(0, item.quantity + change) } : item
      );
      return updatedItems.filter(item => item.quantity > 0); // Remove item if quantity is 0
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    toast({ title: `Item dihapus dari keranjang.`, variant: "destructive" });
  };
  
  const filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.1; // 10% tax
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handlePayment = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Silakan tambahkan produk ke keranjang terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }
    // Mock payment
    toast({
      title: "Pembayaran Berhasil (Simulasi)",
      description: `Total Rp ${total.toLocaleString()} telah dibayar. Struk dicetak.`,
    });
    setCartItems([]); // Clear cart after payment
  }

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-2rem)] md:h-[calc(100vh-var(--header-height,5rem)-2rem)]">
      <PageHeader title="Point of Sale" description="Buat transaksi penjualan baru." />
      <div className="grid md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Product Selection */}
        <Card className="md:col-span-2 shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle>Pilih Produk</CardTitle>
            <Input 
              type="search" 
              placeholder="Cari produk..." 
              className="mt-2" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      width={150} 
                      height={150} 
                      className="w-full h-32 object-cover"
                      data-ai-hint={`${product.category} ${product.name}`} 
                    />
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">Rp {product.price.toLocaleString()}</p>
                      <Button 
                        size="sm" 
                        className="w-full mt-2 text-xs"
                        onClick={() => handleAddProductToCart(product)}
                      >
                        Tambah
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <p className="text-muted-foreground text-center py-10">Produk tidak ditemukan.</p>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Order Summary & Payment */}
        <Card className="shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle>Detail Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-2">
              {cartItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">Keranjang kosong.</p>
              ) : (
                <ul className="space-y-3">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Rp {item.price.toLocaleString()} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleUpdateQuantity(item.id, -1)}><MinusCircle className="h-3 w-3" /></Button>
                        <span className="w-4 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => handleUpdateQuantity(item.id, 1)}><PlusCircle className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleRemoveFromCart(item.id)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
          {cartItems.length > 0 && (
            <>
              <Separator />
              <CardContent className="space-y-2 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rp {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pajak ({taxRate * 100}%)</span>
                  <span>Rp {tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString()}</span>
                </div>
              </CardContent>
            </>
          )}
          <CardFooter className="flex flex-col gap-3 pt-4 border-t">
             <Label className="text-sm self-start">Metode Pembayaran</Label>
            <div className="grid grid-cols-3 gap-2 w-full">
                <Button variant="outline"><DollarSignIcon className="mr-1 h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Tunai</span><span className="sm:hidden">Cash</span></Button>
                <Button variant="outline"><CreditCard className="mr-1 h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Kartu</span><span className="sm:hidden">Card</span></Button>
                <Button variant="outline"><QrCode className="mr-1 h-4 w-4 sm:mr-2" /> QRIS</Button>
            </div>
            <Button size="lg" className="w-full mt-2" onClick={handlePayment} disabled={cartItems.length === 0}>
              <Printer className="mr-2 h-4 w-4" /> Bayar & Cetak Struk
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

    