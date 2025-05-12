"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function GeneralSettingsPage() {
  const [companyName, setCompanyName] = useState("TokoLite Jaya");
  const [companyAddress, setCompanyAddress] = useState("Jl. Merdeka No. 123, Kota Bahagia");
  const [companyContact, setCompanyContact] = useState("0812-3456-7890");
  const [logoPreview, setLogoPreview] = useState<string | null>("https://picsum.photos/150/150?random=logo");

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
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
              {logoPreview && (
                <Image 
                  src={logoPreview} 
                  alt="Pratinjau Logo" 
                  width={100} 
                  height={100} 
                  className="rounded-md border object-contain"
                  data-ai-hint="company logo"
                />
              )}
              <Input id="companyLogo" type="file" accept="image/*" onChange={handleLogoChange} />
              <p className="text-xs text-muted-foreground">Format: JPG, PNG. Maks: 1MB. Rekomendasi: 150x150px.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button>
            <Save className="mr-2 h-4 w-4" /> Simpan Perubahan
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
