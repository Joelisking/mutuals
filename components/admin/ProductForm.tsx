/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Plus, Upload, X, Loader2 } from 'lucide-react';
import { usePostMediaUploadMutation } from '@/lib/redux/api/openapi.generated';
import { useGetShopProductCategoriesQuery } from '@/lib/redux/api/settings.api';
import { toast } from 'sonner';

const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  sku: z.string().min(1, 'SKU is required'),
  price: z.coerce.number().min(0, 'Price must be non-negative'),
  stockQuantity: z.coerce.number().int().min(0, 'Stock must be non-negative'),
});

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  materials: z.string().optional(),
  sizeGuide: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  basePrice: z.coerce.number().min(0, 'Price must be non-negative'),
  status: z.enum(['ACTIVE', 'ARCHIVED']),
  variants: z.array(variantSchema).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export interface ExistingImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
}

interface ProductFormProps {
  onSubmit: (values: ProductFormValues, imageUrls: string[]) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<ProductFormValues & { slug?: string }>;
  existingImages?: ExistingImage[];
  onDeleteImage?: (imageId: string) => Promise<void>;
}

export function ProductForm({ onSubmit, isLoading, defaultValues, existingImages = [], onDeleteImage }: ProductFormProps) {
  const { data: shopCategoriesData } = useGetShopProductCategoriesQuery();
  const shopCategories: string[] = (shopCategoriesData as any)?.data ?? ['T-Shirts', 'Hoodies', 'Accessories', 'Other'];
  const [uploadMedia, { isLoading: isUploading }] = usePostMediaUploadMutation();
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    for (const file of files) {
      if (!file.type.startsWith('image/')) { toast.error('Please upload image files only'); continue; }
      if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} exceeds 10MB`); continue; }
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'products');
        formData.append('type', 'IMAGE');
        const result = await uploadMedia({ body: formData as any }).unwrap();
        const url = (result as any)?.data?.filePath || (result as any)?.data?.url;
        if (url) setPendingImages((prev) => [...prev, url]);
        else toast.error('Upload succeeded but no URL returned');
      } catch (err: any) {
        toast.error(err?.data?.message || `Failed to upload ${file.name}`);
      }
    }
    e.target.value = '';
  };

  const handleDeleteExisting = async (imageId: string) => {
    if (!onDeleteImage) return;
    setDeletingImageId(imageId);
    try {
      await onDeleteImage(imageId);
    } finally {
      setDeletingImageId(null);
    }
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      description: '',
      materials: '',
      sizeGuide: '',
      category: '',
      basePrice: 0,
      status: 'ACTIVE',
      variants: [],
      ...defaultValues,
    },
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
    control,
    name: 'variants',
  });

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, pendingImages))} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register('name')} placeholder="Product name" />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select
            defaultValue={defaultValues?.category}
            onValueChange={(val) => setValue('category', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {shopCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-xs text-red-500">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="basePrice">Base Price *</Label>
          <Input id="basePrice" type="number" step="0.01" {...register('basePrice')} />
          {errors.basePrice && <p className="text-xs text-red-500">{errors.basePrice.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Visibility *</Label>
          <Select
            defaultValue={defaultValues?.status === 'ARCHIVED' ? 'ARCHIVED' : 'ACTIVE'}
            onValueChange={(val) => setValue('status', val as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Visible</SelectItem>
              <SelectItem value="ARCHIVED">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} rows={4} placeholder="Product description..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="materials">Materials &amp; Care</Label>
        <Textarea id="materials" {...register('materials')} rows={3} placeholder="e.g. 100% organic cotton. Machine wash cold, tumble dry low." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sizeGuide">Size Guide</Label>
        <Textarea id="sizeGuide" {...register('sizeGuide')} rows={3} placeholder="e.g. This style runs true to size. Model is wearing a Medium." />
      </div>

      {/* Images */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Images</Label>

        {(existingImages.length > 0 || pendingImages.length > 0) && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className="relative group aspect-square">
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover rounded-md border" />
                {img.isPrimary && (
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">Primary</span>
                )}
                {onDeleteImage && (
                  <button
                    type="button"
                    onClick={() => handleDeleteExisting(img.id)}
                    disabled={deletingImageId === img.id}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    {deletingImageId === img.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                  </button>
                )}
              </div>
            ))}
            {pendingImages.map((url, i) => (
              <div key={url} className="relative group aspect-square">
                <img src={url} alt="" className="w-full h-full object-cover rounded-md border" />
                <span className="absolute bottom-1 left-1 bg-blue-600/80 text-white text-[10px] px-1.5 py-0.5 rounded">New</span>
                <button
                  type="button"
                  onClick={() => setPendingImages((prev) => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <label className={`flex items-center gap-2 w-fit cursor-pointer px-3 py-2 rounded-md border border-dashed text-sm text-muted-foreground hover:text-foreground hover:border-foreground transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {isUploading ? 'Uploading...' : 'Upload images'}
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={isUploading} />
        </label>
        <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB each. First image becomes the primary.</p>
      </div>

      {/* Variants */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Variants</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendVariant({ sku: '', size: '', color: '', price: 0, stockQuantity: 0 })}>
            <Plus className="mr-1 h-3 w-3" /> Add Variant
          </Button>
        </div>

        {variantFields.length === 0 && (
          <p className="text-sm text-muted-foreground">No variants added yet.</p>
        )}

        {variantFields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-2 md:grid-cols-6 gap-2 p-3 border rounded-md">
            <div className="col-span-2 md:col-span-1">
              <Label className="text-xs">SKU *</Label>
              <Input {...register(`variants.${index}.sku`)} placeholder="SKU-001" className="h-8 text-xs" />
              {errors.variants?.[index]?.sku && (
                <p className="text-xs text-red-500">{errors.variants[index].sku?.message}</p>
              )}
            </div>
            <div>
              <Label className="text-xs">Size</Label>
              <Input {...register(`variants.${index}.size`)} placeholder="S/M/L/XL" className="h-8 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Color</Label>
              <Input {...register(`variants.${index}.color`)} placeholder="Black" className="h-8 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Price *</Label>
              <Input type="number" step="0.01" {...register(`variants.${index}.price`)} className="h-8 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Stock *</Label>
              <Input type="number" {...register(`variants.${index}.stockQuantity`)} className="h-8 text-xs" />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeVariant(index)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="text-black">
          {isLoading ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
}
