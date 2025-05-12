"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Save, Printer, Bluetooth } from "lucide-react";
import { useState } from "react";

export default function StrukSettingsPage() {
  const [paperSize, setPaperSize] = useState("58mm");
  const [headerText, setHeaderText] = useState("Terima Kasih Atas Kunjungan Anda!");
  const [footerText, setFooterText] = useState("Barang yang sudah dibeli tidak dapat dikembalikan.");
  const [showLogo, setShowLogo] = useState(true);
  const [showAddress, setShowAddress] = useState(true);
  const [showContact, setShowContact] = useState(true);

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
              <Button variant="outline">
                <Printer className="mr-2 h-4 w-4" /> Cari & Hubungkan Printer
              </Button>
              <p className="text-xs text-muted-foreground">Pastikan Bluetooth aktif dan printer dalam jangkauan.</p>
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
    </div>
  );
}
