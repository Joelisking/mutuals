/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Discount } from '@/lib/types/api';

const discountSchema = z.object({
  code: z.string().min(1, 'Code is required').toUpperCase(),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.coerce.number().min(0, 'Value must be non-negative'),
  minOrderAmount: z.coerce.number().min(0).optional(),
  maxUses: z.coerce.number().int().min(1).optional(),
  active: z.boolean().default(true),
  expiresAt: z.string().optional(),
});

type DiscountFormValues = z.infer<typeof discountSchema>;

interface DiscountFormProps {
  onSubmit: (values: DiscountFormValues) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<Discount>;
}

export function DiscountForm({ onSubmit, isLoading, defaultValues }: DiscountFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DiscountFormValues>({
    resolver: zodResolver(discountSchema) as any,
    defaultValues: {
      code: defaultValues?.code ?? '',
      description: defaultValues?.description ?? '',
      type: defaultValues?.type ?? 'PERCENTAGE',
      value: defaultValues?.value ?? 0,
      minOrderAmount: defaultValues?.minOrderAmount,
      maxUses: defaultValues?.maxUses,
      active: defaultValues?.active ?? true,
      expiresAt: defaultValues?.expiresAt
        ? new Date(defaultValues.expiresAt).toISOString().slice(0, 16)
        : '',
    },
  });

  const typeValue = watch('type');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code">Code *</Label>
          <Input
            id="code"
            {...register('code')}
            placeholder="SUMMER20"
            style={{ textTransform: 'uppercase' }}
          />
          {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type *</Label>
          <Select
            defaultValue={defaultValues?.type ?? 'PERCENTAGE'}
            onValueChange={(val) => setValue('type', val as 'PERCENTAGE' | 'FIXED_AMOUNT')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
              <SelectItem value="FIXED_AMOUNT">Fixed Amount ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">
            Value * {typeValue === 'PERCENTAGE' ? '(%)' : '($)'}
          </Label>
          <Input id="value" type="number" step="0.01" {...register('value')} />
          {errors.value && <p className="text-xs text-red-500">{errors.value.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="minOrderAmount">Min Order Amount ($)</Label>
          <Input id="minOrderAmount" type="number" step="0.01" {...register('minOrderAmount')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxUses">Max Uses</Label>
          <Input id="maxUses" type="number" {...register('maxUses')} placeholder="Unlimited" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expiresAt">Expires At</Label>
          <Input id="expiresAt" type="datetime-local" {...register('expiresAt')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} rows={2} placeholder="Optional description..." />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="active"
          defaultChecked={defaultValues?.active ?? true}
          onCheckedChange={(checked) => setValue('active', !!checked)}
        />
        <Label htmlFor="active">Active</Label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="text-black">
          {isLoading ? 'Saving...' : 'Save Discount'}
        </Button>
      </div>
    </form>
  );
}
