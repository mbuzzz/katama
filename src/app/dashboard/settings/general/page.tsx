
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
const DEFAULT_LOGO_PLACEHOLDER = "https://picsum.photos/150/150?random=logo-placeholder";

export default function GeneralSettingsPage() {
  const [companyName, setCompanyName] = useState("KATAMA Jaya");
  const [companyAddress, setCompanyAddress] = useState("Jl. Es Teh Indonesia No. 1, Kota Segar");
  const [companyContact, setCompanyContact] = useState("0812-1234-5678");
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedLogo = localStorage.getItem(LOGO_STORAGE_KEY);
    if (storedLogo) {
      setCustomLogo(storedLogo);
    }
  }, []);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCustomLogo(result);
        try {
          localStorage.setItem(LOGO_STORAGE_KEY, result);
          toast({ title: "Logo Diperbarui", description: "Logo berhasil diunggah dan akan tampil setelah refresh halaman." });
          // Optionally trigger a custom event to inform other components like sidebar
           window.dispatchEvent(new CustomEvent('logoChanged', { detail: result }));
        } catch (error) {
            console.error("Error saving logo to localStorage:", error);
            toast({ title: "Gagal Menyimpan Logo", description: "Ukuran logo mungkin terlalu besar untuk disimpan.", variant: "destructive" });
            // Potentially revert customLogo state if localStorage fails and it's critical
            // For now, we'll leave the preview and let the user know it might not persist fully.
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveChanges = () => {
    // Save other settings (name, address, contact) if needed
    // For logo, it's already saved on change due to localStorage interaction
    // If customLogo is null and there was a stored one, this means "remove custom logo"
    // but current UI doesn't have a remove button. User can only replace.
    // If they want to revert to default, they'd need to clear it or we add a "reset logo" button.

    // For demo, we just toast.
    toast({
      title: "Pengaturan Disimpan",
      description: "Informasi perusahaan telah diperbarui.",
    });
     // Force refresh other components if needed, e.g. sidebar to reflect logo change
     // This is a bit of a hack, better to use context or a global state manager.
     window.dispatchEvent(new Event('storage')); // This will trigger the listener in AppSidebar
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
                className="rounded-md border object-contain bg-muted" // Added bg-muted for placeholder visibility
                data-ai-hint={!customLogo ? "generic placeholder" : undefined} // AI hint only for placeholder
                key={customLogo || DEFAULT_LOGO_PLACEHOLDER} // Force re-render on src change
              />
              <Input id="companyLogo" type="file" accept="image/*" onChange={handleLogoChange} />
              <p className="text-xs text-muted-foreground">Format: JPG, PNG, WEBP. Maks: 1MB. Rekomendasi rasio aspek 4:1 (mis. 120x30px).</p>
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
