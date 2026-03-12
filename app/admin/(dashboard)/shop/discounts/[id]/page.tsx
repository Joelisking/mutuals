/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DiscountForm } from '@/components/admin/DiscountForm';
import { useGetDiscountsQuery, useUpdateDiscountMutation } from '@/lib/redux/api/shop.api';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';

export default function EditDiscountPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading: isFetching } = useGetDiscountsQuery();
  const [updateDiscount, { isLoading }] = useUpdateDiscountMutation();

  const discounts = (data as any)?.data ?? [];
  const discount = discounts.find((d: any) => d.id === id);

  const onSubmit = async (values: any) => {
    try {
      await updateDiscount({ id, ...values }).unwrap();
      toast.success('Discount updated');
      router.push('/admin/shop/discounts');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update discount');
    }
  };

  if (isFetching) return <div className="p-4 text-muted-foreground">Loading...</div>;
  if (!discount) return <div className="p-4 text-muted-foreground">Discount not found</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Edit Discount</h3>
        <p className="text-sm text-muted-foreground">Update discount code details.</p>
      </div>
      <DiscountForm onSubmit={onSubmit} isLoading={isLoading} defaultValues={discount} />
    </div>
  );
}
