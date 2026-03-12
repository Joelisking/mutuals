/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ProductForm } from '@/components/admin/ProductForm';
import {
  useGetProductsByIdQuery,
  usePutProductsByIdMutation,
  usePostProductsByProductIdImagesMutation,
  useDeleteProductsImagesByImageIdMutation,
} from '@/lib/redux/api/openapi.generated';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading: isFetching, refetch } = useGetProductsByIdQuery({ id });
  const [updateProduct, { isLoading }] = usePutProductsByIdMutation();
  const [addImage] = usePostProductsByProductIdImagesMutation();
  const [deleteImage] = useDeleteProductsImagesByImageIdMutation();

  const product = (data as any)?.data;

  const onSubmit = async (values: any, imageUrls: string[]) => {
    try {
      await updateProduct({ id, body: values }).unwrap();

      if (imageUrls.length) {
        const existingCount = product?.images?.length ?? 0;
        await Promise.all(
          imageUrls.map((imageUrl, i) =>
            addImage({
              productId: id,
              body: { imageUrl, isPrimary: existingCount === 0 && i === 0, order: existingCount + i },
            } as any).unwrap()
          )
        );
      }

      toast.success('Product updated successfully');
      router.push('/admin/shop/products');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update product');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImage({ imageId } as any).unwrap();
      toast.success('Image removed');
      refetch();
    } catch {
      toast.error('Failed to remove image');
    }
  };

  if (isFetching) return <div className="p-4 text-muted-foreground">Loading...</div>;
  if (!product) return <div className="p-4 text-muted-foreground">Product not found</div>;

  const existingImages = [...(product.images ?? [])]
    .sort((a: any, b: any) => a.order - b.order)
    .map((img: any) => ({ id: img.id, imageUrl: img.imageUrl, isPrimary: img.isPrimary }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Edit Product</h3>
        <p className="text-sm text-muted-foreground">Update product details.</p>
      </div>
      <ProductForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        existingImages={existingImages}
        onDeleteImage={handleDeleteImage}
        defaultValues={{
          name: product.name,
          description: product.description,
          materials: product.materials,
          sizeGuide: product.sizeGuide,
          category: product.category,
          basePrice: Number(product.basePrice),
          status: product.status,
          variants: product.variants?.map((v: any) => ({
            id: v.id,
            sku: v.sku,
            size: v.size ?? '',
            color: v.color ?? '',
            price: Number(v.price),
            stockQuantity: v.stockQuantity,
          })),
        }}
      />
    </div>
  );
}
