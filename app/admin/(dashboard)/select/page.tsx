/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useGetArticlesQuery } from '@/lib/redux/api/openapi.generated';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

export default function SelectFeaturesPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data } = useGetArticlesQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    category: 'Select+',
    status: statusFilter === 'ALL' ? undefined : (statusFilter as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'),
    search: debouncedSearch || undefined,
  });

  const columns: ColumnDef<Record<string, any>>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Creative',
        cell: ({ row }) => {
          const subtitle = row.original.subtitle || '';
          const parts = subtitle.includes('|') ? subtitle.split('|').map((s: string) => s.trim()) : [row.original.title, ''];
          return (
            <div className="flex flex-col">
              <span className="font-medium">{parts[0]}</span>
              <span className="text-xs text-muted-foreground">{parts[1]}</span>
            </div>
          );
        },
      },
      {
        id: 'episode',
        header: 'Episode',
        cell: ({ row }) => {
          const epTag = row.original.tags?.find((t: string) => t.startsWith('EP:'));
          return epTag ? (
            <Badge variant="outline" className="text-[#1ecbe1] border-[#1ecbe1]/30">
              {epTag.replace('EP:', 'EP. ')}
            </Badge>
          ) : (
            <span className="text-zinc-500">-</span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'secondary';
          if (status === 'PUBLISHED') variant = 'default';
          else if (status === 'ARCHIVED') variant = 'outline';
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        accessorKey: 'featured',
        header: 'Featured',
        cell: ({ row }) =>
          row.original.featured ? (
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              Featured
            </Badge>
          ) : null,
      },
      {
        accessorKey: 'publishDate',
        header: 'Published',
        cell: ({ row }) =>
          row.original.publishDate
            ? format(new Date(row.original.publishDate), 'MMM d, yyyy')
            : '-',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/admin/select/${row.original.id}`}>Edit</Link>
          </Button>
        ),
      },
    ],
    []
  );

  const articles = (data as any)?.data?.items || (data as any)?.data || [];
  const total = (data as any)?.data?.meta?.total || (data as any)?.meta?.total || 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Select+ Features</h1>
          <p className="text-sm text-muted-foreground">
            Manage creative profiles for the Select+ program.
          </p>
        </div>
        <Button asChild className="text-black">
          <Link href="/admin/select/new">
            <Plus className="mr-2 h-4 w-4" /> Add Feature
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search creatives..."
            className="pl-9 bg-zinc-900 border-zinc-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select
          value={statusFilter || 'ALL'}
          onValueChange={(val) => setStatusFilter(val === 'ALL' ? undefined : val)}>
          <SelectTrigger className="w-full md:w-[180px] bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={articles}
        pageCount={Math.ceil(total / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
