/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useGetOrderByIdQuery, useUpdateOrderStatusMutation } from '@/lib/redux/api/shop.api';
import { useGetProductsByIdQuery } from '@/lib/redux/api/openapi.generated';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { OrderStatus } from '@/lib/types/api';

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
];

function OrderItemRow({ item }: { item: any }) {
  const { data } = useGetProductsByIdQuery({ id: item.productId }, { skip: !item.productId });
  const product = (data as any)?.data;
  const imageUrl = product?.images?.find((img: any) => img.isPrimary)?.imageUrl
    ?? product?.images?.[0]?.imageUrl;

  return (
    <div className="flex items-center gap-4 py-2">
      <div className="w-40 h-40 rounded-md border bg-muted shrink-0 overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={item.productName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.productName}</p>
        {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
      </div>
      <p className="text-sm font-medium shrink-0">${Number(item.totalPrice).toFixed(2)}</p>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetOrderByIdQuery(id);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();
  const order = (data as any)?.data;
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('');

  useEffect(() => {
    if (order?.status) setSelectedStatus(order.status as OrderStatus);
  }, [order?.status]);

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    try {
      await updateStatus({ id, status: selectedStatus }).unwrap();
      toast.success('Order status updated');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update status');
    }
  };

  if (isLoading) return <div className="p-4 text-muted-foreground">Loading...</div>;
  if (!order) return <div className="p-4 text-muted-foreground">Order not found</div>;

  const addr = order.shippingAddress;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Order Detail</h1>
          <p className="text-sm text-muted-foreground font-mono">{order.id}</p>
        </div>
        <Badge>{order.status}</Badge>
      </div>

      {/* Customer Info */}
      <div className="border rounded-lg p-4 space-y-2">
        <h2 className="font-semibold text-sm uppercase text-muted-foreground">Customer</h2>
        <p className="text-sm">{order.customerName || '—'}</p>
        <p className="text-sm">{order.customerEmail}</p>
        {addr && (
          <p className="text-sm text-muted-foreground">
            {[addr.line1, addr.line2, addr.city, addr.state, addr.postal_code, addr.country]
              .filter(Boolean)
              .join(', ')}
          </p>
        )}
      </div>

      {/* Order Items */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold text-sm uppercase text-muted-foreground mb-2">Items</h2>
        <div className="divide-y">
          {order.items?.map((item: any) => (
            <OrderItemRow key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="border rounded-lg p-4 space-y-2 text-sm">
        <h2 className="font-semibold text-sm uppercase text-muted-foreground mb-2">Totals</h2>
        <div className="flex justify-between"><span>Subtotal</span><span>${Number(order.subtotal).toFixed(2)}</span></div>
        {Number(order.discountAmount) > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount {order.discount ? `(${order.discount.code})` : ''}</span>
            <span>-${Number(order.discountAmount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between"><span>Shipping</span><span>${Number(order.shippingAmount).toFixed(2)}</span></div>
        <div className="flex justify-between font-semibold border-t pt-2">
          <span>Total</span><span>${Number(order.total).toFixed(2)}</span>
        </div>
      </div>

      {/* Update Status */}
      <div className="border rounded-lg p-4 space-y-3">
        <h2 className="font-semibold text-sm uppercase text-muted-foreground">Update Status</h2>
        <div className="flex gap-3 items-center">
          <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as OrderStatus)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {ORDER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleStatusUpdate} disabled={!selectedStatus || isUpdating} className="text-black">
            Update
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Ordered: {order.createdAt ? format(new Date(order.createdAt), 'PPpp') : '—'}
        </p>
      </div>
    </div>
  );
}
