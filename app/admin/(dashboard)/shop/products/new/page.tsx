/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ProductForm } from '@/components/admin/ProductForm';
import {
  usePostProductsMutation,
  usePostProductsByProductIdImagesMutation,
} from '@/lib/redux/api/openapi.generated';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NewProductPage() {
  const router = useRouter();
  const [createProduct, { isLoading }] = usePostProductsMutation();
  const [addImage] = usePostProductsByProductIdImagesMutation();

  const onSubmit = async (values: any, imageUrls: string[]) => {
    try {
      const result = await createProduct({ body: values }).unwrap() as any;
      const productId = result?.data?.id;

      if (productId && imageUrls.length) {
        await Promise.all(
          imageUrls.map((imageUrl, i) =>
            addImage({ productId, body: { imageUrl, isPrimary: i === 0, order: i } } as any).unwrap()
          )
        );
      }

      toast.success('Product created successfully');
      router.push('/admin/shop/products');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">New Product</h3>
        <p className="text-sm text-muted-foreground">Add a new product to the shop.</p>
      </div>
      <ProductForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
}
