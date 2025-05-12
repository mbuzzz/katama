
"use client";

import type { Product, ProductIngredient } from "@/types/product";
import type { RawMaterial } from "@/data/raw-materials";
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
import { Textarea } // Assuming you might want a description field later
from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Trash2, PlusCircle, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation"; // For redirecting after save

const productIngredientSchema = z.object({
  rawMaterialId: z.string().min(1, "Bahan baku harus dipilih"),
  quantity: z.coerce.number().min(0.001, "Jumlah harus lebih dari 0"), // use coerce for input type number
});

const productFormSchema = z.object({
  name: z.string().min(1, "Nama produk harus diisi"),
  category: z.string().min(1, "Kategori produk harus dipilih"),
  hpp: z.coerce.number().min(0, "HPP tidak boleh negatif").optional(),
  price: z.coerce.number().min(0, "Harga jual tidak boleh negatif"),
  stock: z.coerce.number().min(0, "Stok tidak boleh negatif").int("Stok harus angka bulat"),
  image: z.string().url("URL gambar tidak valid").optional().or(z.literal("")),
  ingredients: z.array(productIngredientSchema).optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initialData?: Product;
  rawMaterials: RawMaterial[];
  categories: string[];
  onSave: (data: ProductFormData) => Promise<void>;
}

export default function ProductForm({
  initialData,
  rawMaterials,
  categories,
  onSave,
}: ProductFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      category: initialData?.category || "",
      hpp: initialData?.hpp || 0,
      price: initialData?.price || 0,
      stock: initialData?.stock || 0,
      image: initialData?.image || "",
      ingredients: initialData?.ingredients || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      await onSave(data);
      toast({
        title: "Produk Disimpan",
        description: `${data.name} telah berhasil disimpan.`,
      });
      router.push("/dashboard/products"); // Redirect to product list
    } catch (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Terjadi kesalahan saat menyimpan produk.",
        variant: "destructive",
      });
      console.error("Save error:", error);
    }
  };

  const getRawMaterialUnit = (id: string) => {
    return rawMaterials.find(rm => rm.id === id)?.unit || '';
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Details Section */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Detail Produk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Produk</Label>
              <Input id="name" {...form.register("name")} />
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
              <Label htmlFor="image">URL Gambar Produk (Opsional)</Label>
              <Input id="image" type="url" placeholder="https://example.com/image.jpg" {...form.register("image")} />
              {form.formState.errors.image && (
                <p className="text-sm text-destructive mt-1">{form.formState.errors.image.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Stock Section */}
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

      {/* Ingredients Section */}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger id={`ingredients.${index}.rawMaterialId`}>
                        <SelectValue placeholder="Pilih bahan baku" />
                      </SelectTrigger>
                      <SelectContent>
                        {rawMaterials.map((material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name} ({material.stock} {material.unit})
                          </SelectItem>
                        ))}
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
                      {getRawMaterialUnit(form.watch(`ingredients.${index}.rawMaterialId`))}
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
                className="text-destructive hover:bg-destructive/10 self-end mb-0.5" // Adjusted for alignment
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
          {form.formState.isSubmitting ? "Menyimpan..." : (initialData ? "Simpan Perubahan" : "Simpan Produk")}
        </Button>
      </div>
    </form>
  );
}

