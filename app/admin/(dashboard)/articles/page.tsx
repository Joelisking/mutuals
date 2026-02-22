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

// Simple debounce hook implementation
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function ArticlesPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [statusFilter, setStatusFilter] = useState<
    string | undefined
  >(undefined);
  const [categoryFilter, setCategoryFilter] = useState<
    string | undefined
  >(undefined);
  const [featuredFilter, setFeaturedFilter] = useState<
    string | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useDebounce(searchTerm, 500);

  const isAllStatuses = !statusFilter;

  // Shared filter params (everything except status)
  const sharedParams = {
    category: categoryFilter === 'ALL' ? undefined : categoryFilter,
    excludeCategory: 'Select+',
    featured:
      !featuredFilter || featuredFilter === 'ALL'
        ? undefined
        : featuredFilter === 'true',
    search: debouncedSearch || undefined,
  };

  // When a specific status is selected, use a single server-paginated query.
  const { data: filteredData } = useGetArticlesQuery(
    {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      status: statusFilter as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
      ...sharedParams,
    },
    { skip: isAllStatuses }
  );

  // When "All Statuses" is selected the API defaults to PUBLISHED only when no
  // status param is sent, so we run three parallel queries and merge client-side.
  const ALL_LIMIT = 100;
  const { data: draftData } = useGetArticlesQuery(
    { page: 1, limit: ALL_LIMIT, status: 'DRAFT', ...sharedParams },
    { skip: !isAllStatuses }
  );
  const { data: publishedData } = useGetArticlesQuery(
    { page: 1, limit: ALL_LIMIT, status: 'PUBLISHED', ...sharedParams },
    { skip: !isAllStatuses }
  );
  const { data: archivedData } = useGetArticlesQuery(
    { page: 1, limit: ALL_LIMIT, status: 'ARCHIVED', ...sharedParams },
    { skip: !isAllStatuses }
  );

  const columns: ColumnDef<Record<string, any>>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.title}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.slug}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="capitalize text-zinc-400">
            {row.original.category}
          </Badge>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          let variant:
            | 'default'
            | 'secondary'
            | 'destructive'
            | 'outline' = 'secondary';

          if (status === 'PUBLISHED') variant = 'default';
          else if (status === 'ARCHIVED') variant = 'outline';
          else if (status === 'DRAFT') variant = 'secondary';

          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        accessorKey: 'featured',
        header: 'Featured',
        cell: ({ row }) =>
          row.original.featured ? (
            <Badge
              variant="outline"
              className="text-blue-400 border-blue-400">
              Featured
            </Badge>
          ) : null,
      },
      {
        accessorKey: 'publishDate',
        header: 'Published',
        cell: ({ row }) => {
          return row.original.publishDate
            ? format(
                new Date(row.original.publishDate),
                'MMM d, yyyy'
              )
            : '-';
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          return (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/articles/${row.original.id}`}>
                Edit
              </Link>
            </Button>
          );
        },
      },
    ],
    []
  );

  const articles = useMemo(() => {
    if (isAllStatuses) {
      const drafts = (draftData as any)?.data?.items ?? [];
      const published = (publishedData as any)?.data?.items ?? [];
      const archived = (archivedData as any)?.data?.items ?? [];
      const merged = [...drafts, ...published, ...archived].sort(
        (a, b) =>
          new Date(b.publishDate ?? b.createdAt ?? 0).getTime() -
          new Date(a.publishDate ?? a.createdAt ?? 0).getTime()
      );
      const start = pagination.pageIndex * pagination.pageSize;
      return merged.slice(start, start + pagination.pageSize);
    }
    return (filteredData as any)?.data?.items ?? (filteredData as any)?.data ?? [];
  }, [isAllStatuses, draftData, publishedData, archivedData, filteredData, pagination]);

  const total = useMemo(() => {
    if (isAllStatuses) {
      return (
        ((draftData as any)?.data?.meta?.total ?? 0) +
        ((publishedData as any)?.data?.meta?.total ?? 0) +
        ((archivedData as any)?.data?.meta?.total ?? 0)
      );
    }
    return (
      (filteredData as any)?.data?.meta?.total ??
      (filteredData as any)?.meta?.total ??
      0
    );
  }, [isAllStatuses, draftData, publishedData, archivedData, filteredData]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          Articles
        </h1>
        <Button asChild className="text-black">
          <Link href="/admin/articles/new">
            <Plus className="mr-2 h-4 w-4" /> Add Article
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-9 bg-zinc-900 border-zinc-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select
          value={statusFilter || 'ALL'}
          onValueChange={(val) => {
            setStatusFilter(val === 'ALL' ? undefined : val);
            setPagination((p) => ({ ...p, pageIndex: 0 }));
          }}>
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

        <Select
          value={categoryFilter || 'ALL'}
          onValueChange={(val) =>
            setCategoryFilter(val === 'ALL' ? undefined : val)
          }>
          <SelectTrigger className="w-full md:w-[180px] bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Categories</SelectItem>
            <SelectItem value="music">Music</SelectItem>
            <SelectItem value="culture">Culture</SelectItem>
            <SelectItem value="lifestyle">Lifestyle</SelectItem>
            <SelectItem value="events">Events</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={featuredFilter || 'ALL'}
          onValueChange={(val) =>
            setFeaturedFilter(val === 'ALL' ? undefined : val)
          }>
          <SelectTrigger className="w-full md:w-[140px] bg-zinc-900 border-zinc-800">
            <SelectValue placeholder="Featured" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="true">Featured</SelectItem>
            <SelectItem value="false">Not Featured</SelectItem>
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
