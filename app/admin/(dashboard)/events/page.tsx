/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useGetEventsQuery } from '@/lib/redux/api/openapi.generated';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Event {
  id: string;
  title: string;
  eventDate: string;
  venue: string;
  city: string;
  status: 'UPCOMING' | 'PAST';
  ticketStatus?: string;
  featured: boolean;
}

export default function EventsPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data } = useGetEventsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const columns: ColumnDef<Event>[] = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',
      },
      {
        accessorKey: 'eventDate',
        header: 'Date',
        cell: ({ row }) => {
          return row.original.eventDate
            ? format(
                new Date(row.original.eventDate),
                'MMM d, yyyy h:mm a'
              )
            : '-';
        },
      },
      {
        accessorKey: 'venue',
        header: 'Venue',
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span>{row.original.venue}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.city}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <Badge
              variant={
                status === 'UPCOMING' ? 'default' : 'secondary'
              }>
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'ticketStatus',
        header: 'Tickets',
        cell: ({ row }) =>
          row.original.ticketStatus ? (
            <Badge variant="outline">
              {row.original.ticketStatus}
            </Badge>
          ) : (
            '-'
          ),
      },
      {
        accessorKey: 'featured',
        header: 'Featured',
        cell: ({ row }) =>
          row.original.featured ? (
            <Badge variant="outline">Featured</Badge>
          ) : null,
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/events/${row.original.id}`}>
                  Edit
                </Link>
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  const events =
    (data as any)?.data?.items || (data as any)?.data || [];
  const total =
    (data as any)?.data?.meta?.total ||
    (data as any)?.meta?.total ||
    0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Events</h1>
        <Button asChild className="text-black">
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" /> Create Event
          </Link>
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={events}
        pageCount={Math.ceil(total / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
