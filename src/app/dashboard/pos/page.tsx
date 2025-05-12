"use client";

import type { Product as ProductType } from "@/types/product";
import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle, Trash2, Printer, CreditCard, QrCode, DollarSignIcon, PlayCircle } from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface Product extends ProductType {
  image: string;
  variants?: { name: string; price: number }[];
}

interface CartItem extends Product {
  quantity: number;
}

interface POSSession {
  initialCash: number;
  startTime: Date;
}

const mockProducts: Product[] = [
  { id: "1", name: "Kopi Susu Aren", price: 18000, image: "https://picsum.photos/150/150?random=1", category: "Minuman", stock: 100, variants: [{name: "Kurang Gula", price: 0}, {name: "Ekstra Shot", price: 5000}] },
  { id: "2", name: "Croissant Coklat", price: 22000, image: "https://picsum.photos/150/150?random=2", category: "Makanan", stock: 50 },
  { id: "3", name: "Teh Melati", price: 15000, image: "https://picsum.photos/150/150?random=3", category: "Minuman", stock: 100 },
  { id: "4", name: "Nasi Goreng Spesial", price: 35000, image: "https://picsum.photos/150/150?random=4", category: "Makanan", stock: 30 },
  { id: "5", name: "Americano", price: 16000, image: "https://picsum.photos/150/150?random=5", category: "Minuman", stock: 100 },
  { id: "6", name: "Donat Gula", price: 10000, image: "https://picsum.photos/150/150?random=6", category: "Makanan", stock: 80 },
  { id: "7", name: "Cappuccino", price: 20000, image: "https://picsum.photos/150/150?random=7", category: "Minuman", stock: 100 },
  { id: "8", name: "Red Velvet Latte", price: 25000, image: "https://picsum.photos/150/150?random=8", category: "Minuman", stock: 70 },
  { id: "9", name: "Matcha Latte", price: 25000, image: "https://picsum.photos/150/150?random=9", category: "Minuman", stock: 70 },
  { id: "10", name: "Kentang Goreng", price: 18000, image: "https://picsum.photos/150/150?random=10", category: "Makanan", stock: 120 },
  { id: "11", name: "Roti Bakar Coklat Keju", price: 20000, image: "https://picsum.photos/150/150?random=11", category: "Makanan", stock: 60 },
  { id: "12", name: "Es Teh Lemon", price: 12000, image: "https://picsum.photos/150/150?random=12", category: "Minuman", stock: 150 },
  { id: "13", name: "Muffin Blueberry", price: 18000, image: "https://picsum.photos/150/150?random=13", category: "Makanan", stock: 40 },
  { id: "14", name: "Air Mineral", price: 5000, image: "https://picsum.photos/150/150?random=14", category: "Minuman", stock: 200 },
  { id: "15", name: "Mie Ayam", price: 28000, image: "https://picsum.photos/150/150?random=15", category: "Makanan", stock: 25 },
];

export default function POSPage() {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [posSession, setPosSession] = React.useState<POSSession | null>(null);
  const [showOpenPOSDialog, setShowOpenPOSDialog] = React.useState(false);
  const [initialCashInput, setInitialCashInput] = React.useState("");
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
      return updatedItems.filter(item => item.quantity > 0);
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
  const taxRate = 0.1; 
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
    // In a real app, integrate with payment gateway or record transaction
    toast({
      title: "Pembayaran Berhasil (Simulasi)",
      description: `Total Rp ${total.toLocaleString()} telah dibayar. Struk dicetak.`,
    });
    setCartItems([]); 
    // Potentially clear customer info, etc.
  }

  const handleOpenPOSSession = () => {
    const cashAmount = parseFloat(initialCashInput);
    if (isNaN(cashAmount) || cashAmount < 0) {
      toast({
        title: "Input Tidak Valid",
        description: "Masukkan jumlah modal awal yang valid.",
        variant: "destructive",
      });
      return;
    }
    setPosSession({ initialCash: cashAmount, startTime: new Date() });
    setShowOpenPOSDialog(false);
    setInitialCashInput("");
    toast({
      title: "Sesi POS Dibuka",
      description: `Modal awal Rp ${cashAmount.toLocaleString()} telah dicatat.`,
    });
  };

  // Screen to open POS session
  if (!posSession) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Buka Sesi POS</CardTitle>
            <CardContent className="text-center text-muted-foreground pt-4">
              Anda perlu membuka sesi Point of Sale dan memasukkan modal awal kasir sebelum dapat melakukan transaksi.
            </CardContent>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" size="lg" onClick={() => setShowOpenPOSDialog(true)}>
              <PlayCircle className="mr-2 h-5 w-5" /> Buka Sesi POS
            </Button>
          </CardFooter>
        </Card>

        <Dialog open={showOpenPOSDialog} onOpenChange={setShowOpenPOSDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Masukkan Modal Awal Kasir</DialogTitle>
              <DialogDescription>
                Masukkan jumlah uang tunai yang Anda siapkan di kasir sebagai modal awal untuk kembalian.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="initialCash" className="text-right col-span-1">
                  Modal Awal (Rp)
                </Label>
                <Input
                  id="initialCash"
                  type="number"
                  value={initialCashInput}
                  onChange={(e) => setInitialCashInput(e.target.value)}
                  className="col-span-3"
                  placeholder="Contoh: 500000"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Batal</Button>
              </DialogClose>
              <Button type="button" onClick={handleOpenPOSSession}>Mulai Sesi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Main POS interface
  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="Point of Sale" 
        description={`Sesi dimulai ${posSession.startTime.toLocaleDateString('id-ID')} pukul ${posSession.startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} dengan modal awal Rp ${posSession.initialCash.toLocaleString('id-ID')}`} 
      />
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6 flex-1 overflow-hidden">
        {/* Product Selection Area */}
        <Card className="lg:col-span-2 shadow-lg flex flex-col flex-1 min-h-0">
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
            <ScrollArea className="h-full p-2 md:p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleAddProductToCart(product)}
                  >
                    <div className="relative w-full aspect-[4/3] sm:aspect-square"> {/* Adjusted aspect ratio for consistency */}
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill={true}
                        style={{objectFit:"cover"}}
                        className="rounded-t-md"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        data-ai-hint={`${product.category} produk`} 
                      />
                    </div>
                    <CardContent className="p-2 sm:p-3">
                      <h3 className="font-semibold text-xs sm:text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">Rp {product.price.toLocaleString('id-ID')}</p>
                      <Button 
                        size="sm" 
                        className="w-full mt-2 text-xs"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); handleAddProductToCart(product); }} // Prevent card click if button is clicked
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

        {/* Order Summary & Payment Area */}
        <Card className="shadow-lg flex flex-col flex-1 min-h-0"> {/* Ensure this takes available space and scrolls */}
          <CardHeader>
            <CardTitle>Detail Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden"> {/* This enables scrolling for content */}
            <ScrollArea className="h-full pr-1 md:pr-2">
              {cartItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">Keranjang kosong.</p>
              ) : (
                <ul className="space-y-2 sm:space-y-3">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex-1 mr-2">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Rp {item.price.toLocaleString('id-ID')} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={() => handleUpdateQuantity(item.id, -1)}><MinusCircle className="h-3 w-3" /></Button>
                        <span className="w-5 text-center text-xs sm:text-sm">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6 sm:h-7 sm:w-7" onClick={() => handleUpdateQuantity(item.id, 1)}><PlusCircle className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 text-destructive" onClick={() => handleRemoveFromCart(item.id)}><Trash2 className="h-3 w-3" /></Button>
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
              <CardContent className="space-y-1 sm:space-y-2 pt-2 sm:pt-4 pb-2 sm:pb-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Pajak ({taxRate * 100}%)</span>
                  <span>Rp {tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-semibold text-sm sm:text-lg">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </CardContent>
            </>
          )}
          <CardFooter className="flex flex-col gap-2 sm:gap-3 pt-2 sm:pt-4 border-t">
             <Label className="text-xs sm:text-sm self-start">Metode Pembayaran</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                <Button variant="outline" size="sm"><DollarSignIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Tunai</span><span className="sm:hidden">Tunai</span></Button>
                <Button variant="outline" size="sm"><CreditCard className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Kartu</span><span className="sm:hidden">Kartu</span></Button>
                <Button variant="outline" size="sm"><QrCode className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> QRIS</Button>
            </div>
            <Button size="lg" className="w-full mt-2 text-sm sm:text-base" onClick={handlePayment} disabled={cartItems.length === 0}>
              <Printer className="mr-2 h-4 w-4" /> Bayar &amp; Cetak Struk
            </Button>
            <Button size="sm" variant="outline" className="w-full mt-1" onClick={() => {
              setPosSession(null);
              setCartItems([]); // Clear cart when closing session
              toast({title: "Sesi POS Ditutup", description: "Modal awal dan transaksi telah di-reset."})
            }}>
              Tutup Sesi POS
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
