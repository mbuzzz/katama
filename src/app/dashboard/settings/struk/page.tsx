
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Printer, Bluetooth, Loader2, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface MockPrinter {
  id: string;
  name: string;
}

const mockPrinters: MockPrinter[] = [
  { id: "printer1", name: "Printer Thermal MPT-II" },
  { id: "printer2", name: "Bluetooth Printer P58" },
  { id: "printer3", name: "Generic BT Printer" },
];

export default function StrukSettingsPage() {
  const [paperSize, setPaperSize] = useState("58mm");
  const [headerText, setHeaderText] = useState("Terima Kasih Atas Kunjungan Anda!");
  const [footerText, setFooterText] = useState("Barang yang sudah dibeli tidak dapat dikembalikan.");
  const [showLogo, setShowLogo] = useState(true);
  const [showAddress, setShowAddress] = useState(true);
  const [showContact, setShowContact] = useState(true);

  const [showPrinterDialog, setShowPrinterDialog] = useState(false);
  const [isSearchingPrinters, setIsSearchingPrinters] = useState(false);
  const [isConnectingPrinter, setIsConnectingPrinter] = useState(false); // New state for connecting
  const [foundPrinters, setFoundPrinters] = useState<MockPrinter[]>([]);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string | null>(null);
  const [connectedPrinterName, setConnectedPrinterName] = useState<string | null>(null);
  const { toast } = useToast();

  // This useEffect is in the original code, can be removed if not used for other purposes.
  useEffect(() => {
  }, []);

  const handleSearchPrinters = async () => {
    setIsSearchingPrinters(true);
    setFoundPrinters([]);
    setSelectedPrinterId(null); 
    // Simulate searching for printers
    await new Promise(resolve => setTimeout(resolve, 2000));
    setFoundPrinters(mockPrinters);
    setIsSearchingPrinters(false);
  };

  const handleConnectPrinter = async () => {
    if (!selectedPrinterId) {
      toast({
        title: "Pilih Printer",
        description: "Silakan pilih salah satu printer dari daftar.",
        variant: "destructive",
      });
      return;
    }
    if (isConnectingPrinter) return;

    setIsConnectingPrinter(true);
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 700)); 

    const printerToConnect = foundPrinters.find(p => p.id === selectedPrinterId);
    if (printerToConnect) {
      setConnectedPrinterName(printerToConnect.name);
      toast({
        title: "Printer Terhubung (Simulasi)",
        description: `${printerToConnect.name} berhasil terhubung. Ini adalah simulasi.`,
      });
      setShowPrinterDialog(false);
    } else {
        toast({
            title: "Error",
            description: "Printer yang dipilih tidak ditemukan. Silakan coba lagi.",
            variant: "destructive",
        });
    }
    setIsConnectingPrinter(false);
    setSelectedPrinterId(null); // Clear selection after attempting connection
  };

  const openPrinterSearchDialog = () => {
    setShowPrinterDialog(true);
    if (!connectedPrinterName) { // Only auto-search if not already connected
        handleSearchPrinters(); 
    } else {
        // If already connected, still show list but don't auto-search unless "Cari Ulang"
        setFoundPrinters(mockPrinters); // Show current list if re-opening to change
        setIsSearchingPrinters(false);
    }
  }

  return (
    <div>
      <PageHeader title="Pengaturan Struk" description="Kustomisasi tampilan dan informasi pada struk belanja." />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Konfigurasi Struk</CardTitle>
          <CardDescription>Atur koneksi printer (simulasi), ukuran kertas, dan konten struk.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium px-1">Koneksi Printer (Simulasi)</legend>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Bluetooth className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="bluetoothPrinter">Printer Bluetooth Thermal</Label>
              </div>
              {connectedPrinterName ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-700">Terhubung ke: <strong>{connectedPrinterName}</strong> (Simulasi)</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={openPrinterSearchDialog}>
                    Ganti Printer
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={openPrinterSearchDialog}>
                  <Printer className="mr-2 h-4 w-4" /> Cari & Hubungkan Printer (Simulasi)
                </Button>
              )}
              <p className="text-xs text-muted-foreground">Simulasi pencarian dan koneksi printer Bluetooth. Tidak ada interaksi hardware.</p>
            </div>
          </fieldset>

          <div className="grid md:grid-cols-3 gap-4 items-center">
            <Label htmlFor="paperSize" className="md:text-right">Ukuran Kertas Struk</Label>
            <Select value={paperSize} onValueChange={setPaperSize}>
              <SelectTrigger id="paperSize" className="md:col-span-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="58mm">58mm (Standar)</SelectItem>
                <SelectItem value="80mm">80mm (Lebar)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-3 gap-4 items-start">
            <Label htmlFor="headerText" className="md:text-right pt-2">Teks Header Struk</Label>
            <Textarea 
              id="headerText" 
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              className="md:col-span-2" 
              placeholder="Contoh: Terima kasih telah berbelanja!"
              rows={2}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4 items-start">
            <Label htmlFor="footerText" className="md:text-right pt-2">Teks Footer Struk</Label>
            <Textarea 
              id="footerText" 
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="md:col-span-2" 
              placeholder="Contoh: Ikuti kami @tokolitepos"
              rows={2}
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <Label className="md:text-right">Tampilkan Logo di Struk</Label>
            <Switch
              id="showLogo"
              checked={showLogo}
              onCheckedChange={setShowLogo}
              className="md:col-span-2 justify-self-start"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <Label className="md:text-right">Tampilkan Alamat di Struk</Label>
            <Switch
              id="showAddress"
              checked={showAddress}
              onCheckedChange={setShowAddress}
              className="md:col-span-2 justify-self-start"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <Label className="md:text-right">Tampilkan Kontak di Struk</Label>
            <Switch
              id="showContact"
              checked={showContact}
              onCheckedChange={setShowContact}
              className="md:col-span-2 justify-self-start"
            />
          </div>

        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button>
            <Save className="mr-2 h-4 w-4" /> Simpan Pengaturan Struk
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showPrinterDialog} onOpenChange={(isOpen) => {
        setShowPrinterDialog(isOpen);
        if (!isOpen) {
            // setSelectedPrinterId(null); // Optionally reset selection when dialog is closed by other means
            setIsConnectingPrinter(false); // Ensure connecting state is reset
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Printer Bluetooth (Simulasi)</DialogTitle>
            <DialogDescription>
              Pilih printer thermal yang ingin Anda gunakan dari daftar di bawah ini. Ini adalah simulasi.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {isSearchingPrinters && (
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Mencari printer...</span>
              </div>
            )}
            {!isSearchingPrinters && foundPrinters.length === 0 && (
              <p className="text-center text-muted-foreground">Tidak ada printer simulasi yang ditemukan. Klik "Cari Ulang" untuk memulai simulasi pencarian.</p>
            )}
            {!isSearchingPrinters && foundPrinters.length > 0 && (
              <RadioGroup value={selectedPrinterId || ""} onValueChange={setSelectedPrinterId}>
                {foundPrinters.map((printer) => (
                  <div key={printer.id} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-accent/70">
                    <RadioGroupItem value={printer.id} id={printer.id} />
                    <Label htmlFor={printer.id} className="flex-1 cursor-pointer">{printer.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={handleSearchPrinters} disabled={isSearchingPrinters || isConnectingPrinter}>
              {isSearchingPrinters ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Cari Ulang
            </Button>
            <div className="flex space-x-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={isConnectingPrinter}>Batal</Button>
              </DialogClose>
              <Button type="button" onClick={handleConnectPrinter} disabled={!selectedPrinterId || isSearchingPrinters || isConnectingPrinter}>
                {isConnectingPrinter && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isConnectingPrinter ? "Menghubungkan..." : "Hubungkan"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

