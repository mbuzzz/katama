
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Not used directly now, but keep for potential future use
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Printer, Bluetooth, Loader2, CheckCircle, AlertTriangle } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface WebBluetoothDevice {
  id: string;
  name?: string;
}

// localStorage keys
const STRUK_PAPER_SIZE_KEY = 'katama-pos-struk-paperSize';
const STRUK_HEADER_TEXT_KEY = 'katama-pos-struk-headerText';
const STRUK_FOOTER_TEXT_KEY = 'katama-pos-struk-footerText';
const STRUK_SHOW_LOGO_KEY = 'katama-pos-struk-showLogo';
const STRUK_SHOW_ADDRESS_KEY = 'katama-pos-struk-showAddress';
const STRUK_SHOW_CONTACT_KEY = 'katama-pos-struk-showContact';
const CONNECTED_PRINTER_NAME_KEY = 'katama-pos-connectedPrinterName';
const CONNECTED_PRINTER_ID_KEY = 'katama-pos-connectedPrinterId';


export default function StrukSettingsPage() {
  const [paperSize, setPaperSize] = useState("58mm");
  const [headerText, setHeaderText] = useState("Terima Kasih Atas Kunjungan Anda!");
  const [footerText, setFooterText] = useState("Barang yang sudah dibeli tidak dapat dikembalikan. Ikuti kami @katamapos");
  const [showLogo, setShowLogo] = useState(true);
  const [showAddress, setShowAddress] = useState(true);
  const [showContact, setShowContact] = useState(true);

  const [showPrinterDialog, setShowPrinterDialog] = useState(false);
  const [isSearchingPrinters, setIsSearchingPrinters] = useState(false);
  const [isConnectingPrinter, setIsConnectingPrinter] = useState(false);
  const [foundPrinters, setFoundPrinters] = useState<WebBluetoothDevice[]>([]);
  const [selectedPrinterId, setSelectedPrinterId] = useState<string | null>(null);
  const [connectedPrinterName, setConnectedPrinterName] = useState<string | null>(null);
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (typeof navigator.bluetooth === 'undefined') {
      setBluetoothError("Web Bluetooth API tidak didukung di browser ini. Fitur koneksi printer tidak akan berfungsi.");
    }

    // Load settings from localStorage
    const storedPaperSize = localStorage.getItem(STRUK_PAPER_SIZE_KEY);
    if (storedPaperSize) setPaperSize(storedPaperSize);

    const storedHeaderText = localStorage.getItem(STRUK_HEADER_TEXT_KEY);
    if (storedHeaderText) setHeaderText(storedHeaderText);

    const storedFooterText = localStorage.getItem(STRUK_FOOTER_TEXT_KEY);
    if (storedFooterText) setFooterText(storedFooterText);

    const storedShowLogo = localStorage.getItem(STRUK_SHOW_LOGO_KEY);
    setShowLogo(storedShowLogo === 'true'); // Default to false if not found or not 'true'

    const storedShowAddress = localStorage.getItem(STRUK_SHOW_ADDRESS_KEY);
    setShowAddress(storedShowAddress === 'true');

    const storedShowContact = localStorage.getItem(STRUK_SHOW_CONTACT_KEY);
    setShowContact(storedShowContact === 'true');
    
    const storedConnectedPrinterName = localStorage.getItem(CONNECTED_PRINTER_NAME_KEY);
    if (storedConnectedPrinterName) setConnectedPrinterName(storedConnectedPrinterName);
    const storedConnectedPrinterId = localStorage.getItem(CONNECTED_PRINTER_ID_KEY);
    if (storedConnectedPrinterId) setSelectedPrinterId(storedConnectedPrinterId);


  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem(STRUK_PAPER_SIZE_KEY, paperSize);
    localStorage.setItem(STRUK_HEADER_TEXT_KEY, headerText);
    localStorage.setItem(STRUK_FOOTER_TEXT_KEY, footerText);
    localStorage.setItem(STRUK_SHOW_LOGO_KEY, String(showLogo));
    localStorage.setItem(STRUK_SHOW_ADDRESS_KEY, String(showAddress));
    localStorage.setItem(STRUK_SHOW_CONTACT_KEY, String(showContact));
    
    if (connectedPrinterName && selectedPrinterId) {
        localStorage.setItem(CONNECTED_PRINTER_NAME_KEY, connectedPrinterName);
        localStorage.setItem(CONNECTED_PRINTER_ID_KEY, selectedPrinterId);
    } else {
        localStorage.removeItem(CONNECTED_PRINTER_NAME_KEY);
        localStorage.removeItem(CONNECTED_PRINTER_ID_KEY);
    }

    toast({ title: "Pengaturan Disimpan", description: "Konfigurasi struk telah berhasil disimpan." });
  };


  const handleSearchPrinters = async () => {
    if (typeof navigator.bluetooth === 'undefined') {
      setBluetoothError("Web Bluetooth API tidak didukung. Tidak dapat mencari printer.");
      toast({ title: "Error", description: "Web Bluetooth tidak didukung.", variant: "destructive" });
      return;
    }
    setBluetoothError(null);
    setIsSearchingPrinters(true);
    setFoundPrinters([]);
    setSelectedPrinterId(null);

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true, 
        optionalServices: ['00001101-0000-1000-8000-00805f9b34fb'] 
      });
      if (device) {
        setFoundPrinters(prev => [...prev, { id: device.id, name: device.name || `Printer (${device.id.substring(0,6)}...)` }]);
        toast({ title: "Printer Ditemukan", description: `Printer "${device.name || device.id}" ditemukan.`});
      }
    } catch (error: any) {
      console.error("Error mencari printer Bluetooth:", error);
      let errorMessage = "Gagal mencari printer. Pastikan Bluetooth aktif dan izin diberikan.";
      if (error.name === 'NotFoundError') {
        errorMessage = "Tidak ada perangkat Bluetooth yang dipilih atau ditemukan.";
      } else if (error.name === 'SecurityError') {
        errorMessage = "Akses ke Bluetooth diblokir. Pastikan halaman ini aman (HTTPS) dan diizinkan.";
      }
      setBluetoothError(errorMessage);
      toast({ title: "Pencarian Gagal", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSearchingPrinters(false);
    }
  };

  const handleConnectPrinter = async () => {
    if (!selectedPrinterId) {
      toast({ title: "Pilih Printer", description: "Silakan pilih printer dari daftar.", variant: "destructive" });
      return;
    }
    if (isConnectingPrinter) return;
    setBluetoothError(null);
    setIsConnectingPrinter(true);

    const printerToConnect = foundPrinters.find(p => p.id === selectedPrinterId);
    if (!printerToConnect) {
      setIsConnectingPrinter(false);
      toast({ title: "Error", description: "Printer yang dipilih tidak ditemukan.", variant: "destructive" });
      return;
    }
    
    // Actual connection logic would go here. For now, we just set it as connected.
    // This part remains a placeholder because Web Bluetooth API for printing is complex.
    // navigator.bluetooth.requestDevice({ filters: [{ deviceId: selectedPrinterId }]}) // This isn't correct for reconnecting, store the device object
    // .then(device => device.gatt.connect())
    // .then(server => { ... })
    
    // Simulate successful connection for UI update
    setConnectedPrinterName(printerToConnect.name || `Printer ${printerToConnect.id.substring(0,6)}...`);
    localStorage.setItem(CONNECTED_PRINTER_NAME_KEY, printerToConnect.name || `Printer ${printerToConnect.id.substring(0,6)}...`);
    localStorage.setItem(CONNECTED_PRINTER_ID_KEY, selectedPrinterId);
    toast({ title: "Printer Terhubung", description: `Printer "${printerToConnect.name}" berhasil terhubung (simulasi).` });
    setShowPrinterDialog(false);
    setIsConnectingPrinter(false);
  };

  const openPrinterSearchDialog = () => {
    if (typeof navigator.bluetooth === 'undefined') {
      setBluetoothError("Web Bluetooth API tidak didukung di browser ini. Fitur koneksi printer tidak akan berfungsi.");
      toast({ title: "Error", description: "Web Bluetooth tidak didukung.", variant: "destructive" });
      return;
    }
    setShowPrinterDialog(true);
    setBluetoothError(null);
    setFoundPrinters([]); 
  }

  return (
    <div>
      <PageHeader title="Pengaturan Struk" description="Kustomisasi tampilan dan informasi pada struk belanja." />
      
      {bluetoothError && !showPrinterDialog && ( // Only show global error if dialog isn't open
         <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Masalah Bluetooth</AlertTitle>
          <AlertDescription>{bluetoothError}</AlertDescription>
        </Alert>
      )}

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
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md dark:bg-green-900/30 dark:border-green-700">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <span className="text-sm text-green-700 dark:text-green-300">Terhubung ke: <strong>{connectedPrinterName}</strong></span>
                  </div>
                  <Button variant="outline" size="sm" onClick={openPrinterSearchDialog} disabled={!!bluetoothError && typeof navigator.bluetooth === 'undefined'}>
                    Ganti Printer
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={openPrinterSearchDialog} disabled={!!bluetoothError && typeof navigator.bluetooth === 'undefined'}>
                  <Printer className="mr-2 h-4 w-4" /> Cari & Hubungkan Printer
                </Button>
              )}
              <p className="text-xs text-muted-foreground">Hubungkan ke printer Bluetooth thermal untuk mencetak struk. Membutuhkan browser dengan dukungan Web Bluetooth (mis. Chrome, Edge di Desktop/Android).</p>
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
              placeholder="Contoh: Ikuti kami @katamapos"
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
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" /> Simpan Pengaturan Struk
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showPrinterDialog} onOpenChange={(isOpen) => {
        setShowPrinterDialog(isOpen);
        if (!isOpen) {
            setIsConnectingPrinter(false); 
            setBluetoothError(null); // Clear dialog-specific error when closing
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pilih Printer Bluetooth</DialogTitle>
            <DialogDescription>
              Klik "Cari Printer" untuk menemukan perangkat. Pilih printer thermal dari daftar di bawah ini.
            </DialogDescription>
          </DialogHeader>
           {bluetoothError && (
            <Alert variant="destructive" className="my-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Bluetooth</AlertTitle>
              <AlertDescription>{bluetoothError}</AlertDescription>
            </Alert>
           )}
          <div className="py-4 space-y-4">
            {isSearchingPrinters && (
              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Mencari printer...</span>
              </div>
            )}
            {!isSearchingPrinters && foundPrinters.length === 0 && (
              <p className="text-center text-muted-foreground">Tidak ada printer yang ditemukan. Klik "Cari Printer" untuk memulai pencarian.</p>
            )}
            {!isSearchingPrinters && foundPrinters.length > 0 && (
              <RadioGroup value={selectedPrinterId || ""} onValueChange={setSelectedPrinterId}>
                {foundPrinters.map((printer) => (
                  <div key={printer.id} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-accent/70 dark:hover:bg-accent/30 dark:has-[input:checked]:bg-accent/50">
                    <RadioGroupItem value={printer.id} id={`printer-${printer.id}`} />
                    <Label htmlFor={`printer-${printer.id}`} className="flex-1 cursor-pointer">{printer.name || `Printer Tidak Dikenal (${printer.id.substring(0,6)}...)`}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
          <DialogFooter className="sm:justify-between items-center flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={handleSearchPrinters} disabled={isSearchingPrinters || isConnectingPrinter || (!!bluetoothError && typeof navigator.bluetooth === 'undefined')}>
              {isSearchingPrinters ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Cari Printer
            </Button>
            <div className="flex space-x-2">
              <DialogClose asChild>
                <Button type="button" variant="ghost" disabled={isConnectingPrinter}>Batal</Button>
              </DialogClose>
              <Button type="button" onClick={handleConnectPrinter} disabled={!selectedPrinterId || isSearchingPrinters || isConnectingPrinter || (!!bluetoothError && typeof navigator.bluetooth === 'undefined')}>
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
