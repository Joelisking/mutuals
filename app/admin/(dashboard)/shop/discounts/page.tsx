/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  useGetDiscountsQuery,
  useDeleteDiscountMutation,
  useSetSitewideDiscountMutation,
  useClearSitewideDiscountMutation,
} from '@/lib/redux/api/shop.api';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Globe } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Discount } from '@/lib/types/api';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function AdminDiscountsPage() {
  const { data } = useGetDiscountsQuery();
  const [deleteDiscount] = useDeleteDiscountMutation();
  const [setSitewide] = useSetSitewideDiscountMutation();
  const [clearSitewide] = useClearSitewideDiscountMutation();

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this discount?')) return;
    try {
      await deleteDiscount(id).unwrap();
      toast.success('Discount deleted');
    } catch {
      toast.error('Failed to delete discount');
    }
  };

  const handleSetSitewide = async (id: string) => {
    try {
      await setSitewide(id).unwrap();
      toast.success('Sitewide discount set — customers will see this applied automatically');
    } catch {
      toast.error('Failed to set sitewide discount');
    }
  };

  const handleClearSitewide = async () => {
    try {
      await clearSitewide().unwrap();
      toast.success('Sitewide discount removed');
    } catch {
      toast.error('Failed to clear sitewide discount');
    }
  };

  const discounts: Discount[] = (data as any)?.data ?? [];
  const sitewideDiscount = discounts.find((d) => d.isSitewide);

  const columns: ColumnDef<Discount>[] = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold">{row.original.code}</span>
            {row.original.isSitewide && (
              <Badge className="gap-1 bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/15">
                <Globe className="h-3 w-3" /> Sitewide
              </Badge>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.type === 'PERCENTAGE' ? '%' : '$'}</Badge>
        ),
      },
      {
        accessorKey: 'value',
        header: 'Value',
        cell: ({ row }) =>
          row.original.type === 'PERCENTAGE'
            ? `${row.original.value}%`
            : `$${Number(row.original.value).toFixed(2)}`,
      },
      {
        id: 'uses',
        header: 'Uses',
        cell: ({ row }) =>
          `${row.original.usedCount}${row.original.maxUses ? ` / ${row.original.maxUses}` : ''}`,
      },
      {
        accessorKey: 'active',
        header: 'Active',
        cell: ({ row }) => (
          <Badge variant={row.original.active ? 'default' : 'secondary'}>
            {row.original.active ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
      {
        accessorKey: 'expiresAt',
        header: 'Expires',
        cell: ({ row }) =>
          row.original.expiresAt ? format(new Date(row.original.expiresAt), 'MMM d, yyyy') : 'Never',
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/shop/discounts/${row.original.id}`}>Edit</Link>
            </Button>
            {row.original.isSitewide ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSitewide}
                className="text-emerald-600 hover:text-emerald-800">
                Remove Sitewide
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSetSitewide(row.original.id)}
                className="text-muted-foreground hover:text-foreground">
                Set Sitewide
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(row.original.id)}
              className="text-red-500 hover:text-red-700">
              Delete
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [discounts]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Discounts</h1>
          {sitewideDiscount && (
            <p className="text-sm text-muted-foreground mt-0.5">
              Sitewide discount active:{' '}
              <span className="font-mono font-medium text-emerald-600">{sitewideDiscount.code}</span>
              {' '}— applied automatically at checkout, no code needed.
            </p>
          )}
        </div>
        <Button asChild className="text-black">
          <Link href="/admin/shop/discounts/new">
            <Plus className="mr-2 h-4 w-4" /> Add Discount
          </Link>
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={discounts}
        pageCount={1}
        pagination={{ pageIndex: 0, pageSize: 100 }}
        onPaginationChange={() => {}}
      />
    </div>
  );
}
