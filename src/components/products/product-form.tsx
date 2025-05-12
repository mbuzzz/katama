
"use client";

import type { Product, ProductIngredient } from "@/types/product";
import type { RawMaterial } from "@/types/raw-material"; // Changed from data/raw-materials to types/raw-material
import type { Unit } from "@/types/unit"; // Import Unit type
import React from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea"; // Assuming you might want a description field later
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Removed CardFooter for now, submit is outside
import { Trash2, PlusCircle, Save, UploadCloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; 
import Image from "next/image";
// import { mockCategoryNames } from "@/data/categories"; // This should come from props

// Get units from a central place, or pass as props
import { getMockUnits } from "@/data/units"; // For getting unit abbreviation

const productIngredientSchema = z.object({
  rawMaterialId: z.string().min(1, "Bahan baku harus dipilih"),
  quantity: z.coerce.number().min(0.001, "Jumlah harus lebih dari 0"), 
});

const productFormSchema = z.object({
  name: z.string().min(1, "Nama produk harus diisi"),
  category: z.string().min(1, "Kategori produk harus dipilih"),
  hpp: z.coerce.number().min(0, "HPP tidak boleh negatif").optional(),
  price: z.coerce.number().min(0, "Harga jual tidak boleh negatif"),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif").int("Stok harus angka bulat"),
  image: z.string().optional(), 
  ingredients: z.array(productIngredientSchema).optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initialData?: Product;
  rawMaterials: RawMaterial[]; // These are all available raw materials
  categories: string[]; 
  onSave: (data: ProductFormData) => Promise<void>;
  isEditing?: boolean; // Added to differentiate between add/edit
}

export default function ProductForm({
  initialData,
  rawMaterials,
  categories, 
  onSave,
  isEditing = false,
}: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [imagePreview, setImagePreview] = React.useState<string | null>(initialData?.image || null);
  const allUnits = React.useMemo(() => getMockUnits(), []); // Memoize unit fetching
  
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
      hpp: initialData?.hpp || 0,
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      image: initialData?.image || "", // Store the initial image URL here
      ingredients: initialData?.ingredients || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  React.useEffect(() => {
    const currentPreview = imagePreview;
    if (currentPreview && currentPreview.startsWith("blob:")) {
      return () => {
        URL.revokeObjectURL(currentPreview);
      };
    }
  }, [imagePreview]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("image", reader.result as string); 
        setImagePreview(reader.result as string); // Update preview with Data URI directly
      };
      reader.readAsDataURL(file);
    } else {
      const initialImageValue = initialData?.image || "";
      form.setValue("image", initialImageValue);
      setImagePreview(initialImageValue || null);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      await onSave(data);
      toast({
        title: isEditing ? "Produk Diperbarui" : "Produk Ditambahkan",
        description: `${data.name} telah berhasil ${isEditing ? 'diperbarui' : 'ditambahkan'}.`,
      });
      router.push("/dashboard/products"); 
      router.refresh();
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan produk.",
        variant: "destructive",
      });
      console.error("Kesalahan penyimpanan:", error);
    }
  };

  const getRawMaterialUnitAbbreviation = (rawMaterialId: string) => {
    const material = rawMaterials.find(rm => rm.id === rawMaterialId);
    if (material) {
      const unit = allUnits.find(u => u.id === material.unitId);
      return unit?.abbreviation || '';
    }
    return '';
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Detail Produk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Produk</Label>
              <Input id="name" {...form.register("name")} placeholder="Contoh: Kopi Susu Enak"/>
              {form.formState.errors.name && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Kategori</Label>
              <Controller
                name="category"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {form.formState.errors.category && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.category.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="productImage">Gambar Produk (Opsional)</Label>
              <div className="mt-1 flex items-center gap-4">
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Pratinjau Gambar Produk"
                    width={80}
                    height={80}
                    className="rounded-md object-cover aspect-square border"
                    data-ai-hint="product preview"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-md border flex items-center justify-center bg-muted">
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <Input
                  id="productImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange} // Only call this, form value is set inside
                  className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>
              {form.formState.errors.image && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.image.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Harga & Stok</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hpp">HPP (Harga Pokok Penjualan) (Opsional)</Label>
              <Input id="hpp" type="number" placeholder="Contoh: 5000" {...form.register("hpp")} />
               {form.formState.errors.hpp && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.hpp.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Harga Jual</Label>
              <Input id="price" type="number" placeholder="Contoh: 15000" {...form.register("price")} />
              {form.formState.errors.price && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="stock">Stok Produk Jadi</Label>
              <Input id="stock" type="number" placeholder="Contoh: 100" {...form.register("stock")} />
              {form.formState.errors.stock && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.stock.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bahan Baku / Resep (Opsional)</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ rawMaterialId: "", quantity: 0 })}
          >
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Bahan
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.length === 0 && (
            <p className="text-sm text-muted-foreground">Belum ada bahan baku yang ditambahkan untuk produk ini.</p>
          )}
          {fields.map((item, index) => (
            <div key={item.id} className="grid grid-cols-1 md:grid-cols-[2fr_1fr_auto_auto] gap-2 items-end p-3 border rounded-md">
              <div>
                <Label htmlFor={`ingredients.${index}.rawMaterialId`}>Bahan Baku</Label>
                <Controller
                  name={`ingredients.${index}.rawMaterialId`}
                  control={form.control}
                  render={({ field }) => (
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Potentially trigger re-render or update related fields if needed
                      }} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger id={`ingredients.${index}.rawMaterialId`}>
                        <SelectValue placeholder="Pilih bahan baku" />
                      </SelectTrigger>
                      <SelectContent>
                        {rawMaterials.map((material) => {
                           const unit = allUnits.find(u => u.id === material.unitId);
                           return (
                            <SelectItem key={material.id} value={material.id}>
                              {material.name} (Stok: {material.stock} {unit?.abbreviation || ''})
                            </SelectItem>
                           );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.ingredients?.[index]?.rawMaterialId && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.ingredients[index]?.rawMaterialId?.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor={`ingredients.${index}.quantity`}>Jumlah</Label>
                <div className="flex items-center">
                   <Input
                    id={`ingredients.${index}.quantity`}
                    type="number"
                    step="any"
                    placeholder="Jumlah"
                    {...form.register(`ingredients.${index}.quantity`)}
                    className="rounded-r-none"
                  />
                  {form.watch(`ingredients.${index}.rawMaterialId`) && (
                    <span className="px-3 py-2 border border-l-0 rounded-r-md bg-muted text-sm text-muted-foreground">
                      {getRawMaterialUnitAbbreviation(form.watch(`ingredients.${index}.rawMaterialId`))}
                    </span>
                  )}
                </div>
                 {form.formState.errors.ingredients?.[index]?.quantity && (
                    <p className="text-sm text-destructive mt-1">{form.formState.errors.ingredients[index]?.quantity?.message}</p>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 self-end mb-0.5" 
                onClick={() => remove(index)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Hapus Bahan</span>
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          {form.formState.isSubmitting ? "Menyimpan..." : (isEditing ? "Simpan Perubahan" : "Simpan Produk")}
        </Button>
      </div>
    </form>
  );
}
