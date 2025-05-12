
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Printer, Bluetooth, Loader2, CheckCircle, AlertTriangle } from "lucide-react"; // Added AlertTriangle
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert components

interface WebBluetoothDevice {
  id: string;
  name?: string;
}

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
  }, []);

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
        acceptAllDevices: true, // For broader compatibility in demo, be more specific in production
        // filters: [{ services: ['00001800-0000-1000-8000-00805f9b34fb'] }], // Example: Generic Access service
        optionalServices: ['00001101-0000-1000-8000-00805f9b34fb'] // Serial Port Profile
      });
      if (device) {
        setFoundPrinters(prev => [...prev, { id: device.id, name: device.name || `Printer ${device.id.substring(0,6)}` }]);
        if (foundPrinters.length === 0) { // if it was the first one found
             toast({ title: "Printer Ditemukan", description: `Printer "${device.name || device.id}" ditemukan.`});
        }
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

    // Note: Actual connection and communication with a thermal printer via Web Bluetooth
    // is complex and involves GATT services, characteristics, and printer-specific commands (ESC/POS).
    // This is a simplified connection attempt for demonstration.
    try {
      // In a real app, you'd use the selectedPrinterId to get the BluetoothDevice object
      // (which you should store when found) and then device.gatt.connect()
      const printerToConnect = foundPrinters.find(p => p.id === selectedPrinterId);
      if (!printerToConnect) {
        throw new Error("Printer tidak ditemukan di daftar.");
      }
      
      // This is a placeholder for actual connection logic
      // For example:
      // const device = await navigator.bluetooth.requestDevice({ filters: [{ deviceId: selectedPrinterId }] }); // This is not how you reconnect, store the device object
      // const server = await device.gatt.connect();
      // console.log("Terhubung ke server GATT:", server);

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate connection
      
      setConnectedPrinterName(printerToConnect.name || `Printer ${printerToConnect.id.substring(0,6)}`);
      toast({ title: "Printer Terhubung (Simulasi)", description: `${printerToConnect.name} berhasil terhubung.` });
      setShowPrinterDialog(false);
    } catch (error: any) {
      console.error("Gagal menghubungkan ke printer:", error);
      const errorMessage = "Gagal terhubung ke printer. Coba lagi.";
      setBluetoothError(errorMessage);
      toast({ title: "Koneksi Gagal", description: errorMessage, variant: "destructive" });
    } finally {
      setIsConnectingPrinter(false);
    }
  };

  const openPrinterSearchDialog = () => {
    if (typeof navigator.bluetooth === 'undefined') {
      setBluetoothError("Web Bluetooth API tidak didukung di browser ini. Fitur koneksi printer tidak akan berfungsi.");
      toast({ title: "Error", description: "Web Bluetooth tidak didukung.", variant: "destructive" });
      setShowPrinterDialog(false); // Don't even open if not supported
      return;
    }
    setShowPrinterDialog(true);
    setBluetoothError(null);
    // Don't auto-search if already connected, let user initiate if they want to change
    if (!connectedPrinterName) {
      setFoundPrinters([]); // Clear previous list for a fresh search
      // handleSearchPrinters(); // User should click search button in dialog
    } else {
        // If already connected, can pre-fill or let user search again
    }
  }

  return (
    <div>
      <PageHeader title="Pengaturan Struk" description="Kustomisasi tampilan dan informasi pada struk belanja." />
      
      {bluetoothError && (
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
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-green-700">Terhubung ke: <strong>{connectedPrinterName}</strong></span>
                  </div>
                  <Button variant="outline" size="sm" onClick={openPrinterSearchDialog} disabled={!!bluetoothError}>
                    Ganti Printer
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={openPrinterSearchDialog} disabled={!!bluetoothError}>
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
              Klik "Cari Printer" untuk menemukan perangkat. Pilih printer thermal dari daftar di bawah ini.
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
              <p className="text-center text-muted-foreground">Tidak ada printer yang ditemukan. Klik "Cari Printer" untuk memulai pencarian.</p>
            )}
            {!isSearchingPrinters && foundPrinters.length > 0 && (
              <RadioGroup value={selectedPrinterId || ""} onValueChange={setSelectedPrinterId}>
                {foundPrinters.map((printer) => (
                  <div key={printer.id} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-accent/50 has-[input:checked]:bg-accent/70">
                    <RadioGroupItem value={printer.id} id={`printer-${printer.id}`} />
                    <Label htmlFor={`printer-${printer.id}`} className="flex-1 cursor-pointer">{printer.name || `Printer Tidak Dikenal (${printer.id.substring(0,6)})`}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
          <DialogFooter className="sm:justify-between items-center flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={handleSearchPrinters} disabled={isSearchingPrinters || isConnectingPrinter}>
              {isSearchingPrinters ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Cari Printer
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
