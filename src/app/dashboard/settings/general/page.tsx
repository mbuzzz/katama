
"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const LOGO_STORAGE_KEY = 'katama-pos-custom-logo';
const COMPANY_NAME_STORAGE_KEY = 'katama-pos-company-name';
const COMPANY_ADDRESS_STORAGE_KEY = 'katama-pos-company-address';
const COMPANY_CONTACT_STORAGE_KEY = 'katama-pos-company-contact';
const DEFAULT_LOGO_PLACEHOLDER = "https://picsum.photos/100/100?random=logo-placeholder"; // smaller placeholder

export default function GeneralSettingsPage() {
  const [companyName, setCompanyName] = useState(""); // Initial empty, load from LS
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyContact, setCompanyContact] = useState("");
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load settings from localStorage on component mount
    const storedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
    if (storedLogo) {
      setCustomLogo(storedLogo);
    }
    setCompanyName(localStorage.getItem(COMPANY_NAME_STORAGE_KEY) || "KATAMA Es Teh");
    setCompanyAddress(localStorage.getItem(COMPANY_ADDRESS_STORAGE_KEY) || "Jl. Kesegaran No. 1, Kota Sejuk");
    setCompanyContact(localStorage.getItem(COMPANY_CONTACT_STORAGE_KEY) || "0812-0000-3333");
  }, []);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 1 * 1024 * 1024) { // 1MB size limit
        toast({ title: "Ukuran Logo Terlalu Besar", description: "Pilih file logo dengan ukuran maksimal 1MB.", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomLogo(result);
        // Save logo directly for immediate feedback in sidebar
        try {
          localStorage.setItem(LOGO_STORAGE_KEY, result);
          window.dispatchEvent(new CustomEvent('logoChanged', { detail: result }));
          toast({ title: "Logo Diperbarui", description: "Pratinjau logo diperbarui. Simpan perubahan untuk menerapkan." });
        } catch (error) {
            console.error("Error saving logo to localStorage:", error);
            toast({ title: "Gagal Menyimpan Logo", description: "Ukuran logo mungkin terlalu besar untuk penyimpanan lokal.", variant: "destructive" });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveChanges = () => {
    // Save all settings to localStorage
    localStorage.setItem(COMPANY_NAME_STORAGE_KEY, companyName);
    localStorage.setItem(COMPANY_ADDRESS_STORAGE_KEY, companyAddress);
    localStorage.setItem(COMPANY_CONTACT_STORAGE_KEY, companyContact);
    if (customLogo) {
      localStorage.setItem(LOGO_STORAGE_KEY, customLogo);
      window.dispatchEvent(new CustomEvent('logoChanged', { detail: customLogo }));
    } else {
      localStorage.removeItem(LOGO_STORAGE_KEY); // If customLogo is null/cleared
      window.dispatchEvent(new CustomEvent('logoChanged', { detail: null }));
    }
    
    window.dispatchEvent(new CustomEvent('companyNameChanged', { detail: companyName }));
    
    toast({
      title: "Pengaturan Disimpan",
      description: "Informasi perusahaan telah diperbarui.",
    });
  };


  return (
    <div>
      <PageHeader title="Pengaturan Umum" description="Kelola informasi umum perusahaan Anda." />
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Informasi Perusahaan</CardTitle>
          <CardDescription>Perbarui nama, alamat, kontak, dan logo perusahaan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4 items-center">
            <Label htmlFor="companyName" className="md:text-right">Nama Perusahaan</Label>
            <Input 
              id="companyName" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="md:col-span-2" 
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4 items-start">
            <Label htmlFor="companyAddress" className="md:text-right pt-2">Alamat Perusahaan</Label>
            <Textarea 
              id="companyAddress" 
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="md:col-span-2" 
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4 items-center">
            <Label htmlFor="companyContact" className="md:text-right">Kontak</Label>
            <Input 
              id="companyContact" 
              value={companyContact}
              onChange={(e) => setCompanyContact(e.target.value)}
              className="md:col-span-2" 
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 items-start">
            <Label htmlFor="companyLogo" className="md:text-right pt-2">Logo Perusahaan</Label>
            <div className="md:col-span-2 space-y-2">
              <Image 
                src={customLogo || DEFAULT_LOGO_PLACEHOLDER} 
                alt="Pratinjau Logo" 
                width={100} 
                height={100} 
                className="rounded-md border object-contain bg-muted aspect-square"
                data-ai-hint={!customLogo ? "generic placeholder" : "company logo"}
                key={customLogo || DEFAULT_LOGO_PLACEHOLDER} 
              />
              <Input id="companyLogo" type="file" accept="image/png, image/jpeg, image/webp" onChange={handleLogoChange} />
              <p className="text-xs text-muted-foreground">Format: JPG, PNG, WEBP. Maks: 1MB. Rekomendasi rasio aspek 1:1 (persegi) atau 4:1 (melebar) untuk sidebar.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={handleSaveChanges}>
            <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
