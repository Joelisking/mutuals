/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useGetOrdersQuery } from '@/lib/redux/api/shop.api';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Order, OrderStatus } from '@/lib/types/api';

const statusVariant: Record<OrderStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  PENDING: 'outline',
  PAID: 'default',
  PROCESSING: 'secondary',
  SHIPPED: 'secondary',
  DELIVERED: 'default',
  CANCELLED: 'destructive',
  REFUNDED: 'outline',
};

export default function AdminOrdersPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });

  const { data } = useGetOrdersQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const columns: ColumnDef<Order>[] = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'Order ID',
        cell: ({ row }) => (
          <span className="font-mono text-xs">{row.original.id.slice(0, 8)}...</span>
        ),
      },
      { accessorKey: 'customerEmail', header: 'Email' },
      {
        id: 'items',
        header: 'Items',
        cell: ({ row }) => {
          const qty = row.original.items?.reduce((sum: number, item: any) => sum + (item.quantity ?? 1), 0) ?? 0;
          return `${qty} item(s)`;
        },
      },
      {
        accessorKey: 'total',
        header: 'Total',
        cell: ({ row }) => `$${Number(row.original.total).toFixed(2)}`,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={statusVariant[row.original.status] ?? 'outline'}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) =>
          row.original.createdAt ? format(new Date(row.original.createdAt), 'MMM d, yyyy') : '-',
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/shop/orders/${row.original.id}`}>View</Link>
          </Button>
        ),
      },
    ],
    []
  );

  const orders = (data as any)?.data ?? [];
  const total = (data as any)?.meta?.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">Orders</h1>
      <DataTable
        columns={columns}
        data={orders}
        pageCount={Math.ceil(total / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
