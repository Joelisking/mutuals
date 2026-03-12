/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  useGetPlaylistsQuery,
  useDeletePlaylistsByIdMutation,
} from '@/lib/redux/api/openapi.generated';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { ApiResponse, Playlist } from '@/lib/types/api';

export default function PlaylistsAdminPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [searchTerm, setSearchTerm] = useState('');

  const { data, refetch } = useGetPlaylistsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: searchTerm || undefined,
  });

  const [deletePlaylist] = useDeletePlaylistsByIdMutation();

  const response = data as ApiResponse<Playlist[]> | undefined;
  const playlists = response?.data ?? [];
  const total = response?.meta?.total ?? 0;

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this playlist?')) return;
    try {
      await deletePlaylist({ id }).unwrap();
      toast.success('Playlist deleted');
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete');
    }
  };

  const columns: ColumnDef<Record<string, any>>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="font-medium">{row.original.title}</span>
            <span className="text-xs text-muted-foreground">{row.original.curatorName}</span>
          </div>
        ),
      },
      {
        accessorKey: 'order',
        header: 'Order',
        cell: ({ row }) => row.original.order ?? '—',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/playlists/${row.original.id}`}>Edit</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300"
              onClick={() => handleDelete(row.original.id)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Playlists</h1>
        <Button asChild className="text-black">
          <Link href="/admin/playlists/new">
            <Plus className="mr-2 h-4 w-4" /> Add Playlist
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search playlists..."
            className="pl-9 bg-zinc-900 border-zinc-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

      </div>

      <DataTable
        columns={columns}
        data={playlists}
        pageCount={Math.ceil(total / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
