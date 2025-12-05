'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getProductsByCategory } from '@/lib/data/products-data';
import ShopSubNav from '@/components/shop/shop-subnav';
import Image from 'next/image';

const shopCategories = [
  'ALL',
  'NEW IN',
  'T-SHIRTS & TOPS',
  'HOODIES',
  'ACCESSORIES',
  'ICON TEES',
  'SALE',
  'COLLECTIONS',
];

const categoryMapping: Record<string, string> = {
  ALL: 'All',
  'NEW IN': 'All',
  'T-SHIRTS & TOPS': 'T-Shirts',
  HOODIES: 'Hoodies',
  ACCESSORIES: 'Accessories',
  'ICON TEES': 'T-Shirts',
  SALE: 'All',
  COLLECTIONS: 'All',
};

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const mappedCategory = categoryMapping[selectedCategory] || 'All';
  const filteredProducts = getProductsByCategory(mappedCategory);

  return (
    <div className="min-h-screen bg-[#050507]">
      <ShopSubNav
        categories={shopCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="pt-32 md:pt-36">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
          {/* Products Grid - Matching carousel card style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 gap-y-12">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group block">
                <div className="flex flex-col h-full">
                  {/* Product Image - Reduced visual weight */}
                  <div className="relative aspect-square overflow-hidden rounded-[2px] mb-4">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      width={800}
                      height={800}
                    />

                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Stock Badge - Top right */}
                    {product.stockLevel !== 'in-stock' && (
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-xs text-white uppercase tracking-[0.15em] font-semibold px-2.5 py-1 rounded-sm ${
                            product.stockLevel === 'sold-out'
                              ? 'bg-red-600'
                              : 'bg-[#ff6b35]'
                          }`}>
                          {product.stockLevel === 'sold-out'
                            ? 'Sold Out'
                            : 'Low Stock'}
                        </span>
                      </div>
                    )}

                    {/* Tag badge - minimal styling */}
                    {product.tags.length > 0 &&
                      product.stockLevel === 'in-stock' && (
                        <div className="absolute top-3 left-3">
                          <span className="text-xs text-white uppercase tracking-[0.15em] font-semibold bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-sm">
                            {product.tags[0]}
                          </span>
                        </div>
                      )}

                    {/* Hover Overlay - View Details */}
                    {/* <div className="absolute inset-0 bg-[#1ecbe1]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white hover:bg-white/95 transition-colors rounded-sm px-6 py-3">
                        <span className="text-sm text-[#050507] uppercase tracking-[0.12em] font-medium">
                          View Details
                        </span>
                      </div>
                    </div> */}
                  </div>

                  {/* Product Info - Typography-led structure */}
                  <div className="flex flex-col flex-1">
                    {/* Product Name */}
                    <h3 className="text-lg md:text-xl text-white tracking-[-0.01em] font-medium mb-2 leading-tight line-clamp-1 group-hover:text-[#1ecbe1] transition-colors">
                      {product.name}
                    </h3>

                    {/* Category and Price */}
                    <div className="flex items-center justify-between border-t border-white/6">
                      <span className="text-xs text-white/50 font-light uppercase tracking-[0.15em]">
                        {product.category}
                      </span>
                      <span className="text-base text-white font-medium">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-white/50 font-light">
                No products found in this category.
              </p>
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-20 bg-linear-to-r from-[#1ecbe1]/10 via-[#e91e8c]/10 to-[#ff6b35]/10 border border-white/8 rounded px-8 md:px-12 py-10 md:py-12">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl text-white tracking-[-0.02em] font-medium mb-4">
                Limited Quantities Available
              </h3>
              <p className="text-base md:text-base text-white/70 mb-6 font-light">
                Each piece is produced in small batches to ensure
                quality and exclusivity. Once they&apos;re gone,
                they&apos;re gone.
              </p>
              <div className="flex flex-wrap gap-3 justify-center text-sm text-white/50 font-light">
                <span>Free shipping over $100</span>
                <span>•</span>
                <span>Easy returns within 30 days</span>
                <span>•</span>
                <span>Worldwide delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
