
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
  const [isConnectingPrinter, setIsConnectingPrinter] = useState(false);
  const [foundPrinters, setFoundPrinters] = useState<MockPrinter[]>([]);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string | null>(null);
  const [connectedPrinterName, setConnectedPrinterName] = useState<string | null>(null);
  const { toast } = useToast();

  // This useEffect can be used for any initial setup if needed.
  useEffect(() => {
  }, []);

  const handleSearchPrinters = async () => {
    setIsSearchingPrinters(true);
    setFoundPrinters([]);
    setSelectedPrinterId(null); 
    // Simulate searching for printers - in a real app, this would interact with browser Bluetooth APIs
    await new Promise(resolve => setTimeout(resolve, 2000));
    // For demo purposes, we use mock printers. A real implementation would get this list from the Bluetooth API.
    setFoundPrinters(mockPrinters); 
    setIsSearchingPrinters(false);
    if (mockPrinters.length === 0) {
        toast({
            title: "Tidak Ada Printer Ditemukan",
            description: "Pastikan printer Bluetooth Anda aktif dan dalam jangkauan.",
            variant: "default"
        })
    }
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
    // Simulate connection delay - in a real app, this would be the actual connection process
    await new Promise(resolve => setTimeout(resolve, 1500)); 

    const printerToConnect = foundPrinters.find(p => p.id === selectedPrinterId);
    if (printerToConnect) {
      // In a real app, you'd store the connection status/object.
      setConnectedPrinterName(printerToConnect.name);
      toast({
        title: "Printer Terhubung",
        description: `${printerToConnect.name} berhasil terhubung.`,
      });
      setShowPrinterDialog(false);
    } else {
        toast({
            title: "Koneksi Gagal",
            description: "Gagal terhubung ke printer yang dipilih. Silakan coba lagi.",
            variant: "destructive",
        });
    }
    setIsConnectingPrinter(false);
    // Do not clear selectedPrinterId here if you want it to persist on reopen until successful connection
  };

  const openPrinterSearchDialog = () => {
    setShowPrinterDialog(true);
    // Reset states for a fresh search/connection attempt if dialog is re-opened
    // and no printer is currently "connected" in our state.
    if (!connectedPrinterName) {
        setFoundPrinters([]); // Clear previous list to show loading/search state
        handleSearchPrinters(); 
    } else {
        // If a printer is already "connected", show the list with the current one potentially pre-selected
        // or just show the list of previously found printers for a change.
        setFoundPrinters(mockPrinters); // Or fetch again if desired
        setIsSearchingPrinters(false);
    }
  }

  return (
    <div>
      <PageHeader title="Pengaturan Struk" description="Kustomisasi tampilan dan informasi pada struk belanja." />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Konfigurasi Struk</CardTitle>
          <CardDescription>Atur koneksi printer, ukuran kertas, dan konten struk.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <fieldset className="border p-4 rounded-md">
            <legend className="text-sm font-medium px-1">Koneksi Printer</legend>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Bluetooth className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="bluetoothPrinter">Printer Bluetooth Thermal</Label>
              </div>
              {connectedPrinterName ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-700">Terhubung ke: <strong>{connectedPrinterName}</strong></span>
                  </div>
                  <Button variant="outline" size="sm" onClick={openPrinterSearchDialog}>
                    Ganti Printer
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={openPrinterSearchDialog}>
                  <Printer className="mr-2 h-4 w-4" /> Cari & Hubungkan Printer
                </Button>
              )}
              <p className="text-xs text-muted-foreground">Hubungkan ke printer Bluetooth thermal untuk mencetak struk.</p>
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
            setIsConnectingPrinter(false); 
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Printer Bluetooth</DialogTitle>
            <DialogDescription>
              Pilih printer thermal yang ingin Anda gunakan dari daftar di bawah ini.
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
              <p className="text-center text-muted-foreground">Tidak ada printer yang ditemukan. Klik "Cari Ulang" untuk mencoba lagi.</p>
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

