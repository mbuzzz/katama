
"use client";

import type { Product as ProductType } from "@/types/product";
import type { RawMaterial } from "@/types/raw-material"; 
import * as React from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle, Trash2, Download, CreditCard, QrCode, DollarSignIcon, PlayCircle, Search, CheckCircle, Printer, Loader2, AlertTriangle } from "lucide-react";
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
import html2canvas from 'html2canvas';
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { getMockCompanies, getMockCompanyById } from "@/data/companies"; 

// localStorage keys
const LOGO_STORAGE_KEY = 'katama-pos-custom-logo';
const COMPANY_NAME_STORAGE_KEY = 'katama-pos-company-name';
const COMPANY_ADDRESS_STORAGE_KEY = 'katama-pos-company-address'; 
const COMPANY_CONTACT_STORAGE_KEY = 'katama-pos-company-contact'; 

const STRUK_HEADER_TEXT_KEY = 'katama-pos-struk-headerText';
const STRUK_FOOTER_TEXT_KEY = 'katama-pos-struk-footerText';
const STRUK_SHOW_LOGO_KEY = 'katama-pos-struk-showLogo';
const STRUK_SHOW_ADDRESS_KEY = 'katama-pos-struk-showAddress';
const STRUK_SHOW_CONTACT_KEY = 'katama-pos-struk-showContact';
const STRUK_PAPER_SIZE_KEY = 'katama-pos-struk-paperSize';

const POS_SESSION_KEY_PREFIX = 'katama-pos-active-session-'; 
const DEFAULT_COMPANY_NAME_FALLBACK = "KATAMA";
const SELECTED_COMPANY_ID_KEY = 'katama-pos-selectedCompanyId';


interface Product extends ProductType {
  // image field is already in ProductType if it's optional
}

interface CartItem extends Product {
  quantity: number;
}

interface POSSession {
  initialCash: number;
  startTime: Date;
  companyId: string; 
}

type PaymentMethod = "Tunai" | "Kartu" | "QRIS";


export default function POSPage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [posSession, setPosSession] = React.useState<POSSession | null>(null);
  const [showOpenPOSDialog, setShowOpenPOSDialog] = React.useState(false);
  const [initialCashInput, setInitialCashInput] = React.useState("");
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = React.useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<PaymentMethod>("Tunai");
  const [isLoadingSession, setIsLoadingSession] = React.useState(true);
  const [activeCompanyId, setActiveCompanyId] = React.useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = React.useState(false);
  const [noCompanyAvailable, setNoCompanyAvailable] = React.useState(false);


  const [companyName, setCompanyName] = React.useState<string>(DEFAULT_COMPANY_NAME_FALLBACK);
  const [companyAddress, setCompanyAddress] = React.useState<string>("Alamat Perusahaan Anda");
  const [companyContact, setCompanyContact] = React.useState<string>("Kontak Perusahaan Anda");
  const [customLogoUrl, setCustomLogoUrl] = React.useState<string | null>(null);
  const [strukHeaderText, setStrukHeaderText] = React.useState<string>("Terima Kasih Atas Kunjungan Anda!");
  const [strukFooterText, setStrukFooterText] = React.useState<string>("Barang yang sudah dibeli tidak dapat dikembalikan.");
  const [strukShowLogo, setStrukShowLogo] = React.useState<boolean>(true);
  const [strukShowAddress, setStrukShowAddress] = React.useState<boolean>(true);
  const [strukShowContact, setStrukShowContact] = React.useState<boolean>(true);
  const [posSessionDisplayTime, setPosSessionDisplayTime] = React.useState<string | null>(null);
  const [strukPaperSize, setStrukPaperSize] = React.useState<string>("58mm");

  const [showPostPaymentDialog, setShowPostPaymentDialog] = React.useState(false);
  const [lastTransactionReceiptHtml, setLastTransactionReceiptHtml] = React.useState<string | null>(null);
  const [lastTransactionId, setLastTransactionId] = React.useState<string>("");


  React.useEffect(() => {
    const currentIsSuperAdmin = localStorage.getItem('isSuperAdmin') === 'true';
    setIsSuperAdmin(currentIsSuperAdmin);
    let companyIdForSession = localStorage.getItem(SELECTED_COMPANY_ID_KEY);

    if (!currentIsSuperAdmin && !companyIdForSession) {
      const allCompanies = getMockCompanies();
      if (allCompanies.length > 0) {
        companyIdForSession = allCompanies[0].id;
        localStorage.setItem(SELECTED_COMPANY_ID_KEY, companyIdForSession);
        const companyDetails = getMockCompanyById(companyIdForSession);
        if (companyDetails) {
            window.dispatchEvent(new CustomEvent('companySwitched', {
                detail: { companyId: companyDetails.id, companyName: companyDetails.name }
            }));
        }
      } else {
        setNoCompanyAvailable(true);
        setIsLoadingSession(false);
        setActiveCompanyId(null);
        setProducts([]);
        setPosSession(null);
        return;
      }
    }
    
    setActiveCompanyId(companyIdForSession); 
    setNoCompanyAvailable(false);

    if (companyIdForSession) {
      setProducts(getMockProducts(companyIdForSession)); 
      const POS_SESSION_STORAGE_KEY = POS_SESSION_KEY_PREFIX + companyIdForSession;
      const storedSession = localStorage.getItem(POS_SESSION_STORAGE_KEY);
      if (storedSession) {
        try {
          const potentialSessionData = JSON.parse(storedSession);
          if (typeof potentialSessionData === 'object' && 
              potentialSessionData !== null && 
              'startTime' in potentialSessionData && 
              'companyId' in potentialSessionData &&
              typeof potentialSessionData.startTime === 'string') { 
            const validSessionData = potentialSessionData as Omit<POSSession, 'startTime'> & { startTime: string };
            const sessionStartTime = new Date(validSessionData.startTime);
            if (sessionStartTime && !isNaN(sessionStartTime.getTime()) && validSessionData.companyId === companyIdForSession) {
              setPosSession({ ...validSessionData, startTime: sessionStartTime });
            } else {
              localStorage.removeItem(POS_SESSION_STORAGE_KEY); 
            }
          } else {
            console.error("Format data sesi POS di localStorage tidak valid:", potentialSessionData);
            localStorage.removeItem(POS_SESSION_STORAGE_KEY);
          }
        } catch (error) {
          console.error("Gagal memuat sesi POS dari localStorage:", error);
          localStorage.removeItem(POS_SESSION_STORAGE_KEY); 
        }
      }
    } else {
      setProducts([]); 
      setPosSession(null); 
    }
    setIsLoadingSession(false);

    // Load struk settings
    if (typeof window !== 'undefined') {
      const activeCompanyDetails = companyIdForSession ? getMockCompanyById(companyIdForSession) : null;
      setCompanyName(localStorage.getItem(COMPANY_NAME_STORAGE_KEY) || activeCompanyDetails?.name || DEFAULT_COMPANY_NAME_FALLBACK);
      setCompanyAddress(localStorage.getItem(COMPANY_ADDRESS_STORAGE_KEY) || "Jl. Contoh No. 123, Kota Contoh");
      setCompanyContact(localStorage.getItem(COMPANY_CONTACT_STORAGE_KEY) || "0812-3456-7890");
      setCustomLogoUrl(localStorage.getItem(LOGO_STORAGE_KEY));
      
      setStrukHeaderText(localStorage.getItem(STRUK_HEADER_TEXT_KEY) || "Terima Kasih Atas Kunjungan Anda!");
      setStrukFooterText(localStorage.getItem(STRUK_FOOTER_TEXT_KEY) || "Barang yang sudah dibeli tidak dapat dikembalikan.");
      setStrukShowLogo(localStorage.getItem(STRUK_SHOW_LOGO_KEY) === 'true');
      setStrukShowAddress(localStorage.getItem(STRUK_SHOW_ADDRESS_KEY) === 'true');
      setStrukShowContact(localStorage.getItem(STRUK_SHOW_CONTACT_KEY) === 'true');
      setStrukPaperSize(localStorage.getItem(STRUK_PAPER_SIZE_KEY) || "58mm");
    }
  }, [activeCompanyId]);

  React.useEffect(() => {
    const handleCompanySwitch = () => {
        setIsLoadingSession(true); 
        const newCompanyId = localStorage.getItem(SELECTED_COMPANY_ID_KEY);
        setActiveCompanyId(newCompanyId); 
    };

    window.addEventListener('companySwitched', handleCompanySwitch);
    return () => {
        window.removeEventListener('companySwitched', handleCompanySwitch);
    };
  }, []);


  React.useEffect(() => {
    if (posSession) {
      const formattedTime = `${posSession.startTime.toLocaleDateString('id-ID')} ${posSession.startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`;
      setPosSessionDisplayTime(formattedTime);
    } else {
      setPosSessionDisplayTime(null);
    }
  }, [posSession]);


  const handleAddProductToCart = (product: Product) => {
    if (!activeCompanyId) {
        toast({ title: "Perusahaan tidak dipilih.", description: "Pilih perusahaan aktif terlebih dahulu.", variant: "destructive"});
        return;
    }
    if (product.companyId !== activeCompanyId) {
        toast({ title: "Produk tidak valid.", description: "Produk ini bukan milik perusahaan yang aktif.", variant: "destructive"});
        return;
    }

    const currentProductDetails = products.find(p => p.id === product.id && p.companyId === activeCompanyId);
    if (!currentProductDetails) {
        toast({ title: "Produk tidak ditemukan untuk perusahaan ini.", variant: "destructive"});
        return;
    }

    if (currentProductDetails.stock <= 0) {
      toast({
        title: "Stok Habis",
        description: `Produk "${currentProductDetails.name}" sudah habis.`,
        variant: "destructive",
      });
      return;
    }

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === currentProductDetails.id);
      if (existingItem) {
        if (existingItem.quantity >= currentProductDetails.stock) {
          toast({
            title: "Stok Tidak Cukup",
            description: `Jumlah "${currentProductDetails.name}" di keranjang melebihi stok yang tersedia (${currentProductDetails.stock}).`,
            variant: "destructive",
          });
          return prevItems;
        }
        return prevItems.map((item) =>
          item.id === currentProductDetails.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...currentProductDetails, quantity: 1 }];
    });
    toast({ title: `${currentProductDetails.name} ditambahkan ke keranjang.` });
  };

  const handleUpdateQuantity = (productId: string, change: number) => {
    setCartItems((prevItems) => {
      const productInCart = prevItems.find((item) => item.id === productId);
      if (!productInCart) return prevItems;

      const productDetailsFromState = products.find(p => p.id === productId && p.companyId === activeCompanyId);
      if (!productDetailsFromState) {
          toast({ title: "Detail produk tidak ditemukan untuk pembaruan kuantitas.", variant: "destructive"});
          return prevItems;
      }

      const newQuantity = Math.max(0, productInCart.quantity + change);

      if (change > 0 && newQuantity > productDetailsFromState.stock) {
         toast({
            title: "Stok Tidak Cukup",
            description: `Jumlah "${productDetailsFromState.name}" di keranjang melebihi stok yang tersedia (${productDetailsFromState.stock}).`,
            variant: "destructive",
          });
        return prevItems.map(item => item.id === productId ? {...item, quantity: productDetailsFromState.stock} : item).filter(item => item.quantity > 0);
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
    product.companyId === activeCompanyId && 
    (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; 

  const getReceiptHtmlContent = React.useCallback((): {html: string, transactionId: string} => {
    let htmlContent = '';
    const transactionDate = new Date();
    const receiptId = `TXN-${Date.now().toString().slice(-6)}`;
    
    const currentCompanyDetails = activeCompanyId ? getMockCompanyById(activeCompanyId) : null;
    const receiptCompanyName = localStorage.getItem(COMPANY_NAME_STORAGE_KEY) || currentCompanyDetails?.name || DEFAULT_COMPANY_NAME_FALLBACK;
    const receiptCompanyAddress = localStorage.getItem(COMPANY_ADDRESS_STORAGE_KEY) || "Alamat Perusahaan";
    const receiptCompanyContact = localStorage.getItem(COMPANY_CONTACT_STORAGE_KEY) || "Kontak Perusahaan";
    const receiptCustomLogoUrl = localStorage.getItem(LOGO_STORAGE_KEY);


    if (strukShowLogo && receiptCustomLogoUrl && receiptCustomLogoUrl.startsWith("data:image/")) {
        htmlContent += `<div style="text-align: center; margin-bottom: 10px;"><img src="${receiptCustomLogoUrl}" style="max-width: 100px; max-height: 50px; display: inline-block;" alt="logo"/></div>`;
    }

    htmlContent += `<div style="text-align: center; font-size: ${strukPaperSize === '58mm' ? '14px' : '16px'}; font-weight: bold; margin-bottom: 3px;">${receiptCompanyName}</div>`;
    if (strukShowAddress && receiptCompanyAddress) {
        htmlContent += `<div style="text-align: center; font-size: ${strukPaperSize === '58mm' ? '10px' : '11px'}; margin-bottom: 3px;">${receiptCompanyAddress}</div>`;
    }
    if (strukShowContact && receiptCompanyContact) {
        htmlContent += `<div style="text-align: center; font-size: ${strukPaperSize === '58mm' ? '10px' : '11px'}; margin-bottom: 8px;">${receiptCompanyContact}</div>`;
    }
    htmlContent += `<div style="border-top: 1px dashed #555; margin: 8px 0;"></div>`;

    htmlContent += `<div style="display: flex; justify-content: space-between; font-size: ${strukPaperSize === '58mm' ? '10px' : '11px'}; margin-bottom: 3px;"><span>No: ${receiptId}</span><span>${format(transactionDate, "dd/MM/yy HH:mm", { locale: idLocale })}</span></div>`;
    htmlContent += `<div style="font-size: ${strukPaperSize === '58mm' ? '10px' : '11px'}; margin-bottom: 8px;">Kasir: POS Kasir</div>`; 
    htmlContent += `<div style="border-top: 1px dashed #555; margin: 8px 0;"></div>`;

    htmlContent += '<table><thead><tr><th style="text-align: left; padding-right: 5px;">Item</th><th style="text-align: right; padding-right: 5px;">Qty</th><th style="text-align: right; padding-right: 5px;">Harga</th><th style="text-align: right;">Total</th></tr></thead><tbody>';
    cartItems.forEach(item => {
        htmlContent += `
            <tr style="font-size: ${strukPaperSize === '58mm' ? '11px' : '12px'};">
                <td style="text-align: left; padding-right: 5px; vertical-align: top;">${item.name}</td>
                <td style="text-align: right; padding-right: 5px; vertical-align: top;">${item.quantity}</td>
                <td style="text-align: right; padding-right: 5px; vertical-align: top;">${item.price.toLocaleString('id-ID')}</td>
                <td style="text-align: right; vertical-align: top;">${(item.price * item.quantity).toLocaleString('id-ID')}</td>
            </tr>`;
    });
    htmlContent += '</tbody></table>';
    htmlContent += `<div style="border-top: 1px dashed #555; margin: 8px 0;"></div>`;

    htmlContent += `<div style="display: flex; justify-content: space-between; font-size: ${strukPaperSize === '58mm' ? '11px' : '12px'}; margin-bottom: 3px;"><span>Subtotal:</span><span>Rp ${subtotal.toLocaleString('id-ID')}</span></div>`;
    htmlContent += `<div style="display: flex; justify-content: space-between; font-weight: bold; font-size: ${strukPaperSize === '58mm' ? '13px' : '14px'}; margin-bottom: 5px;"><span>TOTAL:</span><span>Rp ${total.toLocaleString('id-ID')}</span></div>`;
    htmlContent += `<div style="display: flex; justify-content: space-between; font-size: ${strukPaperSize === '58mm' ? '10px' : '11px'}; margin-bottom: 8px;"><span>Pembayaran:</span><span>${selectedPaymentMethod}</span></div>`;
    htmlContent += `<div style="border-top: 1px dashed #555; margin: 8px 0;"></div>`;

    if (strukHeaderText) {
        htmlContent += `<div style="text-align: center; font-size: ${strukPaperSize === '58mm' ? '11px' : '12px'}; margin-top: 10px;">${strukHeaderText}</div>`;
    }
    if (strukFooterText) {
        htmlContent += `<div style="text-align: center; font-size: ${strukPaperSize === '58mm' ? '10px' : '11px'}; margin-top: 5px;">${strukFooterText}</div>`;
    }
    return { html: htmlContent, transactionId: receiptId };
  }, [cartItems, activeCompanyId, selectedPaymentMethod, strukFooterText, strukHeaderText, strukPaperSize, strukShowAddress, strukShowContact, strukShowLogo, subtotal, total]);


  const generateReceiptImage = async (htmlContent: string, transactionId: string) => {
    const receiptElement = document.createElement('div');
    receiptElement.id = 'receipt-render-area';
    receiptElement.style.width = strukPaperSize === '58mm' ? '280px' : '380px';
    receiptElement.style.padding = '15px';
    receiptElement.style.fontFamily = '"Courier New", Courier, monospace';
    receiptElement.style.fontSize = strukPaperSize === '58mm' ? '11px' : '12px';
    receiptElement.style.color = '#000000';
    receiptElement.style.backgroundColor = '#ffffff';
    receiptElement.style.border = '1px solid #ccc';
    receiptElement.style.boxSizing = 'border-box';
    receiptElement.innerHTML = htmlContent;
    
    receiptElement.style.position = 'absolute';
    receiptElement.style.left = '-9999px';
    document.body.appendChild(receiptElement);

    try {
      const canvas = await html2canvas(receiptElement, { scale: 2, useCORS: true, logging: false });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Struk_${transactionId}_${format(new Date(), "yyyyMMddHHmmss")}.png`;
      link.click();
      toast({ title: "Struk Diunduh", description: "Gambar struk berhasil diunduh." });
    } catch (error) {
        console.error("Gagal membuat gambar struk:", error);
        toast({
            title: "Gagal Mengunduh Struk",
            description: "Terjadi kesalahan saat membuat gambar struk.",
            variant: "destructive",
        });
    } finally {
        document.body.removeChild(receiptElement);
    }
  };

  const printReceiptHtml = (htmlContent: string) => {
    const printWindow = window.open('', '_blank', 'height=600,width=400'); 
    if (printWindow) {
        printWindow.document.write('<html><head><title>Struk Pembayaran</title>');
        printWindow.document.write(
            `<style>
                body { 
                    font-family: "Courier New", Courier, monospace; 
                    font-size: ${strukPaperSize === '58mm' ? '10px' : '12px'}; 
                    margin: 0; 
                    padding: 5px; 
                    width: ${strukPaperSize === '58mm' ? '270px' : '370px'}; 
                }
                table { width: 100%; border-collapse: collapse; font-size: inherit; }
                th, td { font-size: inherit; padding: 1px 0; }
                img { max-width: 100px; max-height: 50px; display: block; margin-left: auto; margin-right: auto; }
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 5px; }
                }
            </style>`
        );
        printWindow.document.write('</head><body>');
        printWindow.document.write(htmlContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close(); 

        setTimeout(() => {
            printWindow.focus();
            printWindow.print();
        }, 250);
        toast({ title: "Siap Mencetak", description: "Jendela cetak struk telah dibuka." });
    } else {
        toast({
            title: "Gagal Membuka Jendela Cetak",
            description: "Pastikan browser Anda mengizinkan pop-up.",
            variant: "destructive",
        });
    }
  };


  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "Keranjang Kosong",
        description: "Silakan tambahkan produk ke keranjang terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }
    if (!activeCompanyId) {
        toast({ title: "Perusahaan Tidak Dipilih", description: "Pilih perusahaan aktif untuk melanjutkan pembayaran.", variant: "destructive" });
        return;
    }

    console.log("POSPage: handlePayment activeCompanyId:", activeCompanyId); // DEBUG
    const initialProductStocks: Record<string, number> = {};
     products.forEach(p => { initialProductStocks[p.id] = p.stock; });
    console.log("POSPage: Initial product stocks before sale:", initialProductStocks); // DEBUG


    setIsProcessingPayment(true);
    const result = await handleProcessSaleAction(cartItems, activeCompanyId);
    
    if (result.success) {
      const {html, transactionId} = getReceiptHtmlContent();
      setLastTransactionReceiptHtml(html);
      setLastTransactionId(transactionId);

      toast({
        title: "Pembayaran Berhasil",
        description: `Total Rp ${total.toLocaleString('id-ID')} telah dibayar. Stok diperbarui.`,
      });
      setCartItems([]); 
      
      console.log("POSPage: Sale successful. Refreshing products for companyId:", activeCompanyId); // DEBUG
      const updatedProducts = getMockProducts(activeCompanyId);
      setProducts(updatedProducts); 
      const finalProductStocks: Record<string, number> = {};
      updatedProducts.forEach(p => { finalProductStocks[p.id] = p.stock; });
      console.log("POSPage: Product stocks after sale & refresh:", finalProductStocks); // DEBUG
      
      setShowPostPaymentDialog(true); 
    } else {
      toast({
        title: "Pembayaran Gagal",
        description: result.message || "Terjadi kesalahan saat memproses penjualan.",
        variant: "destructive",
      });
      console.log("POSPage: Sale failed. Refreshing products for companyId:", activeCompanyId); // DEBUG
      setProducts(getMockProducts(activeCompanyId)); 
    }
    setIsProcessingPayment(false);
  }

  const handleDownloadReceiptImage = async () => {
    if (lastTransactionReceiptHtml && lastTransactionId) {
        await generateReceiptImage(lastTransactionReceiptHtml, lastTransactionId);
    }
    setShowPostPaymentDialog(false); 
  };

  const handleDirectPrintReceipt = () => {
      if (lastTransactionReceiptHtml) {
          printReceiptHtml(lastTransactionReceiptHtml);
      }
      setShowPostPaymentDialog(false); 
  };


  const handleOpenPOSSession = () => {
    if (!activeCompanyId) {
        toast({ title: "Perusahaan Tidak Dipilih", description: "Pilih perusahaan aktif untuk memulai sesi POS.", variant: "destructive" });
        return;
    }
    const cashAmount = parseFloat(initialCashInput);
    if (isNaN(cashAmount) || cashAmount < 0) {
      toast({
        title: "Input Tidak Valid",
        description: "Masukkan jumlah modal awal yang valid.",
        variant: "destructive",
      });
      return;
    }
    const newSession: POSSession = { initialCash: cashAmount, startTime: new Date(), companyId: activeCompanyId };
    setPosSession(newSession);
    localStorage.setItem(POS_SESSION_KEY_PREFIX + activeCompanyId, JSON.stringify(newSession));
    setShowOpenPOSDialog(false);
    setInitialCashInput("");
    toast({
      title: "Sesi POS Dibuka",
      description: `Modal awal Rp ${cashAmount.toLocaleString('id-ID')} telah dicatat untuk perusahaan ini.`,
    });
  };

  const handleClosePOSSession = () => {
    if (activeCompanyId) {
      localStorage.removeItem(POS_SESSION_KEY_PREFIX + activeCompanyId);
    }
    setPosSession(null);
    setCartItems([]); 
    toast({ title: "Sesi POS Ditutup", description: "Modal awal dan transaksi telah di-reset." });
  };

  if (isLoadingSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Memuat sesi POS...</p>
      </div>
    );
  }

  if (noCompanyAvailable) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl flex items-center justify-center"><AlertTriangle className="mr-2 h-7 w-7 text-destructive"/> Tidak Ada Perusahaan</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground pt-4">
            Tidak ada perusahaan yang terdaftar di sistem. Silakan hubungi Superadmin untuk menambahkan perusahaan.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuperAdmin && !activeCompanyId) { 
    return (
       <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Pilih Perusahaan (Superadmin)</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground pt-4">
            Anda adalah Superadmin. Silakan pilih perusahaan aktif dari menu dropdown di header untuk menggunakan Point of Sale.
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!posSession && activeCompanyId) { 
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Buka Sesi POS</CardTitle>
            <CardContent className="text-center text-muted-foreground pt-4">
              Anda perlu membuka sesi Point of Sale dan memasukkan modal awal kasir sebelum dapat melakukan transaksi untuk perusahaan ini.
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
    <div className="flex flex-col h-full">
      <PageHeader 
        title="Point of Sale" 
        description={posSessionDisplayTime ? `Sesi dimulai ${posSessionDisplayTime} | Modal: Rp ${posSession?.initialCash.toLocaleString('id-ID')}` : "Memuat info sesi..."}
        className="py-3 md:py-4" 
      />
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 flex-1 overflow-hidden">
        <Card className="lg:col-span-2 shadow-lg flex flex-col flex-1 min-h-0">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-lg sm:text-xl">Pilih Produk</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Cari produk atau kategori..." 
                className="pl-8 h-9 sm:h-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden min-h-0 p-2 sm:p-3 md:p-4">
            <ScrollArea className="h-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
                {filteredProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className={`overflow-hidden hover:shadow-md transition-shadow cursor-pointer group border-border hover:border-primary ${product.stock === 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={() => product.stock > 0 && handleAddProductToCart(product)}
                  >
                    <div className="relative w-full aspect-[4/3] bg-muted">
                       <Image 
                        src={product.image || "https://placehold.co/200x150.png"} 
                        alt={product.name} 
                        fill={true}
                        style={{objectFit:"cover"}}
                        className="rounded-t-md group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 639px) 50vw, (max-width: 767px) 33vw, (max-width: 1023px) 33vw, (max-width: 1279px) 25vw, 20vw"
                        data-ai-hint={product.dataAiHint || `${product.category} product`}
                      />
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-t-md">
                          <span className="text-white font-bold text-xs sm:text-sm p-1 text-center">STOK HABIS</span>
                        </div>
                      )}
                       <div className="absolute top-1 right-1 bg-background/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full text-xs text-foreground">
                        Stok: {product.stock}
                      </div>
                    </div>
                    <CardContent className="p-2 sm:p-3 space-y-1">
                      <h3 className="font-semibold text-xs sm:text-sm leading-tight truncate group-hover:text-primary">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">Rp {product.price.toLocaleString('id-ID')}</p>
                      <Button 
                        size="sm" 
                        className="w-full mt-1 text-xs h-8 sm:h-9"
                        variant={product.stock > 0 ? "outline" : "secondary"}
                        onClick={(e) => { e.stopPropagation(); product.stock > 0 && handleAddProductToCart(product); }}
                        disabled={product.stock === 0}
                      >
                        {product.stock > 0 ? 'Tambah' : 'Stok Habis'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {activeCompanyId && filteredProducts.length === 0 && (
                <p className="text-muted-foreground text-center py-10 text-sm sm:text-base">Produk tidak ditemukan atau belum ada produk untuk perusahaan ini.</p>
              )}
               {!activeCompanyId && !isSuperAdmin && ( 
                 <p className="text-destructive text-center py-10 text-sm sm:text-base">Perusahaan aktif tidak ditemukan. Silakan hubungi administrator.</p>
               )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="shadow-lg flex flex-col flex-1 min-h-0 lg:max-h-[calc(100vh-var(--header-height,88px)-var(--pageheader-height,80px)-2rem)]">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-lg sm:text-xl">Detail Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden min-h-0 p-2 sm:p-3 pr-1 md:pr-2">
            <ScrollArea className="h-full">
              {cartItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-10 text-sm sm:text-base">Keranjang kosong.</p>
              ) : (
                <ul className="space-y-2 sm:space-y-3">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-accent/50 transition-colors">
                      <div className="flex items-center flex-1 mr-2 min-w-0">
                        <Image src={item.image || "https://placehold.co/40x40.png"} alt={item.name} width={32} height={32} className="rounded mr-2 aspect-square object-cover" data-ai-hint={item.dataAiHint || "cart item"} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Rp {item.price.toLocaleString('id-ID')} x {item.quantity}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="outline" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" onClick={() => handleUpdateQuantity(item.id, -1)}><MinusCircle className="h-3 w-3" /></Button>
                        <span className="w-5 text-center text-xs sm:text-sm tabular-nums">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 shrink-0" onClick={() => handleUpdateQuantity(item.id, 1)}><PlusCircle className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-7 sm:w-7 text-destructive shrink-0" onClick={() => handleRemoveFromCart(item.id)}><Trash2 className="h-3 w-3" /></Button>
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
              <CardContent className="space-y-1 sm:space-y-2 p-3 sm:p-4">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between font-semibold text-sm sm:text-base">
                  <span>Total</span>
                  <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </CardContent>
            </>
          )}
          <CardFooter className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-4 border-t">
             <Label className="text-xs sm:text-sm self-start font-medium">Metode Pembayaran</Label>
            <div className="grid grid-cols-3 gap-2 w-full">
                <Button variant={selectedPaymentMethod === "Tunai" ? "default" : "outline"} size="sm" className="h-9 text-xs px-2" onClick={() => setSelectedPaymentMethod("Tunai")}>
                    {selectedPaymentMethod === "Tunai" && <CheckCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />}
                    <DollarSignIcon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Tunai</span><span className="sm:hidden">Tunai</span>
                </Button>
                <Button variant={selectedPaymentMethod === "Kartu" ? "default" : "outline"} size="sm" className="h-9 text-xs px-2" onClick={() => setSelectedPaymentMethod("Kartu")}>
                    {selectedPaymentMethod === "Kartu" && <CheckCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />}
                    <CreditCard className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Kartu</span><span className="sm:hidden">Kartu</span>
                </Button>
                <Button variant={selectedPaymentMethod === "QRIS" ? "default" : "outline"} size="sm" className="h-9 text-xs px-2" onClick={() => setSelectedPaymentMethod("QRIS")}>
                     {selectedPaymentMethod === "QRIS" && <CheckCircle className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />}
                    <QrCode className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> QRIS
                </Button>
            </div>
            <Button 
              size="lg" 
              className="w-full mt-2 text-sm sm:text-base h-10 sm:h-11" 
              onClick={handlePayment} 
              disabled={cartItems.length === 0 || isProcessingPayment || !activeCompanyId}
            >
              {isProcessingPayment ? (
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : <CreditCard className="mr-2 h-4 w-4" />}
              {isProcessingPayment ? "Memproses..." : "Proses Pembayaran"}
            </Button>
            <Button size="sm" variant="ghost" className="w-full mt-1 h-9 text-destructive hover:text-destructive/90 hover:bg-destructive/10" onClick={handleClosePOSSession} disabled={!activeCompanyId}>
              Tutup Sesi POS
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showPostPaymentDialog} onOpenChange={setShowPostPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pembayaran Berhasil!</DialogTitle>
            <DialogDescription>
              Pilih tindakan selanjutnya untuk struk Anda.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col space-y-3 py-4">
            <Button onClick={handleDownloadReceiptImage}>
              <Download className="mr-2 h-4 w-4" /> Unduh Struk (Gambar)
            </Button>
            <Button onClick={handleDirectPrintReceipt} variant="outline">
              <Printer className="mr-2 h-4 w-4" /> Cetak Struk Langsung
            </Button>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
    
