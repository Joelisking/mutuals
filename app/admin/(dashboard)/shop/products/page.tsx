/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  useGetProductsQuery,
  usePutProductsByIdMutation,
} from "@/lib/redux/api/openapi.generated";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductVariantRow {
  id?: string;
  sku?: string;
  size?: string;
  color?: string;
  price?: number;
  stockQuantity?: number;
  stock?: number;
}

interface ProductRow {
  id: string;
  name: string;
  description?: string;
  category: string;
  basePrice: number;
  status: "ACTIVE" | "SOLD_OUT" | "ARCHIVED";
  variants?: ProductVariantRow[];
  images?: { id: string; imageUrl: string; isPrimary: boolean }[];
}

type VisibilityFilter = "ALL" | "ACTIVE" | "ARCHIVED";

function StockBadge({
  total,
  variants,
}: {
  total: number;
  variants: ProductVariantRow[];
}) {
  if (variants.length === 0)
    return <span className="text-muted-foreground text-xs">—</span>;
  if (total === 0)
    return <Badge variant="destructive">Out of stock</Badge>;
  if (total <= 5)
    return (
      <Badge
        variant="outline"
        className="text-yellow-600 border-yellow-600">
        {total} low
      </Badge>
    );
  return <span className="text-sm">{total}</span>;
}

function StockModal({
  product,
  open,
  onClose,
}: {
  product: ProductRow | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!product) return null;

  const primaryImage =
    product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
  const variants = product.variants ?? [];
  const totalStock = variants.reduce(
    (sum, v) => sum + (v.stockQuantity ?? v.stock ?? 0),
    0,
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4">
          <div className="w-28 h-28 shrink-0 rounded-md border bg-muted overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">
              {product.category}
            </p>
            <p className="font-medium">
              ${Number(product.basePrice).toFixed(2)}
            </p>
            <Badge
              variant={
                product.status === "ACTIVE" ? "default" : "secondary"
              }
              className="text-xs">
              {product.status === "ACTIVE"
                ? "Visible"
                : product.status === "SOLD_OUT"
                  ? "Sold Out"
                  : "Hidden"}
            </Badge>
            {product.description && (
              <p className="text-muted-foreground text-xs line-clamp-3 pt-1">
                {product.description}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Stock Breakdown</p>
            <span className="text-xs text-muted-foreground">
              {totalStock} total units
            </span>
          </div>

          {variants.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No variants configured.
            </p>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">
                      SKU
                    </th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">
                      Size
                    </th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">
                      Color
                    </th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-muted-foreground">
                      Price
                    </th>
                    <th className="text-right px-3 py-2 text-xs font-medium text-muted-foreground">
                      Stock
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {variants.map((v, i) => {
                    const qty = v.stockQuantity ?? v.stock ?? 0;
                    return (
                      <tr key={v.id ?? i}>
                        <td className="px-3 py-2 font-mono text-xs">
                          {v.sku || "—"}
                        </td>
                        <td className="px-3 py-2">{v.size || "—"}</td>
                        <td className="px-3 py-2">
                          {v.color || "—"}
                        </td>
                        <td className="px-3 py-2 text-right">
                          ${Number(v.price ?? 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {qty === 0 ? (
                            <span className="text-red-500 font-medium">
                              0
                            </span>
                          ) : qty <= 5 ? (
                            <span className="text-yellow-600 font-medium">
                              {qty}
                            </span>
                          ) : (
                            qty
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button asChild size="sm" className="text-black">
            <Link href={`/admin/shop/products/${product.id}`}>
              Edit Product
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminProductsPage() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>("ALL");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductRow | null>(null);

  const { data, refetch } = useGetProductsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(visibilityFilter !== "ALL"
      ? { status: visibilityFilter }
      : {}),
  } as any);
  const [updateProduct] = usePutProductsByIdMutation();

  const handleToggleVisibility = async (
    e: React.MouseEvent,
    id: string,
    currentStatus: string,
  ) => {
    e.stopPropagation();
    const newStatus =
      currentStatus === "ACTIVE" ? "ARCHIVED" : "ACTIVE";
    try {
      await updateProduct({
        id,
        body: { status: newStatus },
      } as any).unwrap();
      toast.success(
        newStatus === "ACTIVE"
          ? "Product set to Visible"
          : "Product set to Hidden",
      );
      refetch();
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const columns: ColumnDef<ProductRow>[] = useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "category", header: "Category" },
      {
        accessorKey: "basePrice",
        header: "Price",
        cell: ({ row }) =>
          `$${Number(row.original.basePrice).toFixed(2)}`,
      },
      {
        id: "stock",
        header: "Stock",
        cell: ({ row }) => {
          const variants = row.original.variants ?? [];
          const total = variants.reduce(
            (sum, v) => sum + (v.stockQuantity ?? v.stock ?? 0),
            0,
          );
          return <StockBadge total={total} variants={variants} />;
        },
      },
      {
        accessorKey: "status",
        header: "Visibility",
        cell: ({ row }) => {
          const s = row.original.status;
          return (
            <Badge variant={s === "ACTIVE" ? "default" : "secondary"}>
              {s === "ACTIVE"
                ? "Visible"
                : s === "SOLD_OUT"
                  ? "Sold Out"
                  : "Hidden"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const isVisible = row.original.status === "ACTIVE";
          return (
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) =>
                  handleToggleVisibility(
                    e,
                    row.original.id,
                    row.original.status,
                  )
                }
                className="text-muted-foreground hover:text-foreground">
                {isVisible ? (
                  <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                ) : (
                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                )}
                {isVisible ? "Hide" : "Show"}
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link
                  href={`/admin/shop/products/${row.original.id}`}>
                  Edit
                </Link>
              </Button>
            </div>
          );
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const products = (data as any)?.data ?? [];
  const total = (data as any)?.meta?.total ?? 0;

  const handleFilterChange = (f: VisibilityFilter) => {
    setVisibilityFilter(f);
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          Products
        </h1>
        <Button asChild className="text-black">
          <Link href="/admin/shop/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>
      <div className="flex gap-2">
        {(["ALL", "ACTIVE", "ARCHIVED"] as VisibilityFilter[]).map(
          (f) => (
            <Button
              key={f}
              variant={visibilityFilter === f ? "default" : "outline"}
              size="sm"
              onClick={() => handleFilterChange(f)}
              className={visibilityFilter === f ? "text-black" : ""}>
              {f === "ALL"
                ? "All"
                : f === "ACTIVE"
                  ? "Visible"
                  : "Hidden"}
            </Button>
          ),
        )}
      </div>
      <DataTable
        columns={columns}
        data={products}
        pageCount={Math.ceil(total / pagination.pageSize)}
        pagination={pagination}
        onPaginationChange={setPagination}
        onRowClick={(row) => setSelectedProduct(row)}
      />
      <StockModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
