/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DiscountForm } from '@/components/admin/DiscountForm';
import { useCreateDiscountMutation } from '@/lib/redux/api/shop.api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function NewDiscountPage() {
  const router = useRouter();
  const [createDiscount, { isLoading }] = useCreateDiscountMutation();

  const onSubmit = async (values: any) => {
    try {
      await createDiscount(values).unwrap();
      toast.success('Discount created');
      router.push('/admin/shop/discounts');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to create discount');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">New Discount</h3>
        <p className="text-sm text-muted-foreground">Create a new discount code.</p>
      </div>
      <DiscountForm onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
}
