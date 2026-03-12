"use client";

import { useState } from "react";
import Link from "next/link";
import ShopSubNav from "@/components/shop/shop-subnav";
import Image from "next/image";
import { useGetProductsQuery } from "@/lib/redux/api/openapi.generated";
import { useGetSitewideDiscountQuery } from "@/lib/redux/api/shop.api";

function applyDiscount(price: number, discount: { type: string; value: number } | null): number | null {
  if (!discount) return null;
  if (discount.type === "PERCENTAGE") return Math.max(0, price * (1 - discount.value / 100));
  return Math.max(0, price - discount.value);
}

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const { data: sitewideData } = useGetSitewideDiscountQuery();
  const sitewideDiscount = (sitewideData as any)?.data ?? null;

  const { data, isLoading } = useGetProductsQuery({ limit: 100 });

  const allProducts: any[] = (data as any)?.data ?? [];

  const shopCategories = [
    "ALL",
    ...Array.from(new Set(allProducts.map((p: any) => p.category).filter(Boolean))).sort(),
  ];

  const products =
    selectedCategory === "ALL"
      ? allProducts
      : allProducts.filter((p: any) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <ShopSubNav
        categories={shopCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="pt-32 md:pt-36 px-4 md:px-8 lg:px-16">
        <div className="max-w-screen-2xl mx-auto py-10 md:py-16">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-3">
                  <div className="aspect-square bg-gray-100 animate-pulse" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-3/4 mx-auto" />
                  <div className="h-3 bg-gray-100 animate-pulse rounded w-1/4 mx-auto" />
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
                {products.map((product) => {
                  const primaryImage =
                    product.images?.find((img: any) => img.isPrimary)?.imageUrl ??
                    product.images?.[0]?.imageUrl;
                  const sizes = product.variants
                    ?.map((v: any) => v.size)
                    .filter(Boolean) as string[];
                  const totalStock = product.variants?.reduce(
                    (sum: number, v: any) => sum + (v.stockQuantity ?? 0),
                    0
                  ) ?? 0;
                  const isSoldOut = product.status === "SOLD_OUT" || totalStock === 0;
                  const isLowStock = !isSoldOut && totalStock <= 5;
                  const price = Number(product.basePrice);
                  const discounted = applyDiscount(price, sitewideDiscount);

                  return (
                    <Link
                      key={product.id}
                      href={`/shop/${product.slug}`}
                      className="group block">
                      <div className="flex flex-col">
                        <div className="relative aspect-square overflow-hidden mb-4">
                          {primaryImage ? (
                            <Image
                              src={primaryImage}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              width={800}
                              height={800}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}

                          {(isSoldOut || isLowStock) && (
                            <div className="absolute top-3 right-3">
                              <span className={`text-xs text-white uppercase tracking-[0.15em] font-semibold px-2.5 py-1 ${isSoldOut ? "bg-black" : "bg-gray-700"}`}>
                                {isSoldOut ? "Sold Out" : "Low Stock"}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="text-center">
                          <h3 className="text-sm font-medium text-black tracking-wide mb-1 leading-snug">
                            {product.name}
                          </h3>
                          {discounted !== null ? (
                            <p className="text-sm mb-2 flex items-center justify-center gap-2">
                              <span className="line-through text-gray-400">${price.toFixed(2)}</span>
                              <span className="text-black font-medium">${discounted.toFixed(2)}</span>
                            </p>
                          ) : (
                            <p className="text-sm text-black mb-2">${price.toFixed(2)}</p>
                          )}
                          {sizes.length > 0 && (
                            <p className="text-xs text-gray-500 tracking-wide">
                              {[...new Set(sizes)].join(" ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {products.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-sm text-gray-400 uppercase tracking-widest">
                    No products found in this category.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
