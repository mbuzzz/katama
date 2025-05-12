"use client";

import type { Product as ProductType, ProductIngredient } from "@/types/product";
import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle, Trash2, Printer, CreditCard, QrCode, DollarSignIcon, PlayCircle, AlertCircle } from "lucide-react";
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
import { getMockProducts } from "@/data/products"; 
import { handleProcessSaleAction } from "./actions";


interface Product extends ProductType {
  // image field is already in ProductType if it's optional
  // variants?: { name: string; price: number }[]; // Already in ProductType
}

interface CartItem extends Product {
  quantity: number;
}

interface POSSession {
  initialCash: number;
  startTime: Date;
}


export default function POSPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [posSession, setPosSession] = React.useState<POSSession | null>(null);
  const [showOpenPOSDialog, setShowOpenPOSDialog] = React.useState(false);
  const [initialCashInput, setInitialCashInput] = React.useState("");
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);

  React.useEffect(() => {
    // Fetch products from the centralized data source
    setProducts(getMockProducts());
  }, [cartItems]); // Re-fetch products if cartItems change, to reflect stock updates for display

  const handleAddProductToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: "Stok Habis",
        description: `Produk "${product.name}" sudah habis.`,
        variant: "destructive",
      });
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast({
            title: "Stok Tidak Cukup",
            description: `Jumlah "${product.name}" di keranjang melebihi stok yang tersedia (${product.stock}).`,
            variant: "destructive",
          });
          return prevItems;
        }
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
      const productInCart = prevItems.find((item) => item.id === productId);
      if (!productInCart) return prevItems;

      const productDetails = products.find(p => p.id === productId);
      if (!productDetails) return prevItems; // Should not happen

      const newQuantity = Math.max(0, productInCart.quantity + change);

      if (change > 0 && newQuantity > productDetails.stock) {
         toast({
            title: "Stok Tidak Cukup",
            description: `Jumlah "${productDetails.name}" di keranjang melebihi stok yang tersedia (${productDetails.stock}).`,
            variant: "destructive",
          });
        return prevItems.map(item => item.id === productId ? {...item, quantity: productDetails.stock} : item).filter(item => item.quantity > 0);
      }
      
      const updatedItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      );
      return updatedItems.filter(item => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    toast({ title: `Item dihapus dari keranjang.`, variant: "default" });
  };
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.1; 
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Silakan tambahkan produk ke keranjang terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }
    setIsProcessingPayment(true);
    const result = await handleProcessSaleAction(cartItems);
    setIsProcessingPayment(false);

    if (result.success) {
      toast({
        title: "Pembayaran Berhasil",
        description: `Total Rp ${total.toLocaleString('id-ID')} telah dibayar. Stok diperbarui.`,
      });
      setCartItems([]); 
      // Re-fetch products to update stock display in POS product list
      setProducts(getMockProducts()); 
    } else {
      toast({
        title: "Pembayaran Gagal",
        description: result.message || "Terjadi kesalahan saat memproses penjualan.",
        variant: "destructive",
      });
    }
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
      description: `Modal awal Rp ${cashAmount.toLocaleString('id-ID')} telah dicatat.`,
    });
  };

  if (!posSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] p-4"> {/* Adjusted height */}
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

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,88px))]"> {/* Adjust for header height */}
      <PageHeader 
        title="Point of Sale" 
        description={`Sesi dimulai ${posSession.startTime.toLocaleDateString('id-ID')} ${posSession.startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} | Modal: Rp ${posSession.initialCash.toLocaleString('id-ID')}`} 
      />
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 lg:gap-6 flex-1 overflow-hidden">
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
          <CardContent className="flex-1 overflow-hidden p-0 min-h-0">
            <ScrollArea className="h-full p-2 md:p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => product.stock > 0 && handleAddProductToCart(product)}
                  >
                    <div className="relative w-full aspect-[4/3]">
                       <Image 
                        src={product.image || "https://picsum.photos/150/150?random=0"} 
                        alt={product.name} 
                        fill={true}
                        style={{objectFit:"cover"}}
                        className="rounded-t-md"
                        sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 20vw"
                        data-ai-hint={`${product.category} produk`} 
                      />
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-md">
                          <span className="text-white font-bold text-sm">STOK HABIS</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-2 sm:p-3">
                      <h3 className="font-semibold text-xs sm:text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">Rp {product.price.toLocaleString('id-ID')}</p>
                      <p className="text-xs text-muted-foreground">Stok: {product.stock.toLocaleString('id-ID')}</p>
                      <Button 
                        size="sm" 
                        className="w-full mt-2 text-xs"
                        variant="outline"
                        onClick={(e) => { e.stopPropagation(); product.stock > 0 && handleAddProductToCart(product); }}
                        disabled={product.stock === 0}
                      >
                        {product.stock > 0 ? 'Tambah' : 'Stok Habis'}
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

        <Card className="shadow-lg flex flex-col flex-1 min-h-0">
          <CardHeader>
            <CardTitle>Detail Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden min-h-0">
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
            <div className="grid grid-cols-3 gap-2 w-full">
                <Button variant="outline" size="sm"><DollarSignIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Tunai</span><span className="sm:hidden">Tunai</span></Button>
                <Button variant="outline" size="sm"><CreditCard className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Kartu</span><span className="sm:hidden">Kartu</span></Button>
                <Button variant="outline" size="sm"><QrCode className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> QRIS</Button>
            </div>
            <Button 
              size="lg" 
              className="w-full mt-2 text-sm sm:text-base" 
              onClick={handlePayment} 
              disabled={cartItems.length === 0 || isProcessingPayment}
            >
              {isProcessingPayment ? (
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : <Printer className="mr-2 h-4 w-4" />}
              {isProcessingPayment ? "Memproses..." : "Bayar & Cetak Struk"}
            </Button>
            <Button size="sm" variant="outline" className="w-full mt-1" onClick={() => {
              setPosSession(null);
              setCartItems([]); 
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

