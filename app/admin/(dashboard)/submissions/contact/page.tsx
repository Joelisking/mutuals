
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetSubmissionsContactQuery } from "@/lib/redux/api/openapi.generated";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  submissionType: string;
  status: string;
  createdAt: string;
}

export default function ContactSubmissionsPage() {
  const router = useRouter();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data, isLoading } = useGetSubmissionsContactQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    status: statusFilter === "ALL" ? undefined : statusFilter as any,
  });

  const columns: ColumnDef<ContactSubmission>[] = useMemo(() => [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
          <div className="flex flex-col">
              <span className="font-medium">{row.original.name}</span>
              <span className="text-xs text-muted-foreground">{row.original.email}</span>
          </div>
      )
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => <Badge variant="outline" className="capitalize text-zinc-400">{row.original.submissionType}</Badge>
    },
    {
      accessorKey: "submitted",
      header: "Submitted",
       cell: ({ row }) => {
        return row.original.createdAt ? format(new Date(row.original.createdAt), "MMM d, yyyy") : "-";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";

        if (status === "NEW") variant = "secondary";
        else if (status === "REVIEWED") variant = "default";
        else if (status === "ARCHIVED") variant = "outline";

        return (
          <Badge variant={variant}>
            {status}
          </Badge>
        );
      },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/admin/submissions/contact/${row.original.id}`)}
                >
                    View Details
                </Button>
            )
        }
    }
  ], [router]);

  const submissions = (data as any)?.data ?? [];
  const total = (data as any)?.meta?.total ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Contact Submissions</h1>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <Select
            value={statusFilter || "ALL"}
            onValueChange={(val) => setStatusFilter(val === "ALL" ? undefined : val)}
        >
            <SelectTrigger className="w-full md:w-[180px] bg-zinc-900 border-zinc-800">
                <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="NEW">New</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={submissions}
        pageCount={Math.ceil(total / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={setPagination}
      />
    </div>
  );
}
