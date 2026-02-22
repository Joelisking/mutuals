'use client'
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetSubmissionsArtistQuery } from "@/lib/redux/api/openapi.generated";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

// Simple debounce hook implementation inline to avoid dependency issues if file missing
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

interface ArtistSubmission {
  id: string;
  name: string;
  email: string;
  role: string; // artist, dj, designer
  status: string; // NEW, REVIEWED, ARCHIVED
  createdAt: string;
  portfolioLinks?: any; // JSON
}

export default function ArtistSubmissionsPage() {
  const router = useRouter();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data } = useGetSubmissionsArtistQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    status: statusFilter === "ALL" ? undefined : statusFilter as any,
    search: debouncedSearch || undefined,
  });

  const columns: ColumnDef<ArtistSubmission>[] = useMemo(() => [
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
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge variant="outline" className="capitalize text-zinc-400">{row.original.role}</Badge>
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
        
        if (status === "NEW") variant = "secondary"; // Changed from destructive to secondary (gray/white)
        else if (status === "REVIEWED") variant = "default"; // Primary/Brand color usually
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
                  onClick={() => router.push(`/admin/submissions/artist/${row.original.id}`)}
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
        <h1 className="text-lg font-semibold md:text-2xl">Artist Submissions</h1>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or email..."
              className="pl-9 bg-zinc-900 border-zinc-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
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
