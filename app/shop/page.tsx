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
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group">
                <div className="bg-[#0a0a0f] rounded-[4px] overflow-hidden border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all">
                  {/* Product Image */}
                  <div className="relative overflow-hidden aspect-square">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      width={800}
                      height={800}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0f] via-transparent to-transparent opacity-40" />

                    {/* Stock Badge */}
                    {product.stockLevel !== 'in-stock' && (
                      <div className="absolute top-4 right-4">
                        <div
                          className={`${
                            product.stockLevel === 'sold-out'
                              ? 'bg-red-600'
                              : 'bg-[#ff6b35]'
                          } px-3 py-1.5 rounded-sm`}>
                          <span className="text-[11px] text-white uppercase tracking-[0.12em] font-medium">
                            {product.stockLevel === 'sold-out'
                              ? 'Sold Out'
                              : 'Low Stock'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {product.tags.length > 0 &&
                      product.stockLevel === 'in-stock' && (
                        <div className="absolute top-4 left-4">
                          <div className="bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.2)] px-3 py-1 rounded-sm">
                            <span className="text-[11px] text-white uppercase tracking-[0.12em] font-medium">
                              {product.tags[0]}
                            </span>
                          </div>
                        </div>
                      )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-[#1ecbe1]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white hover:bg-[rgba(255,255,255,0.95)] transition-colors rounded-sm px-6 py-3">
                        <span className="text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-[16px] md:text-[18px] text-white tracking-[-0.01em] font-medium leading-tight">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[15px] text-[rgba(255,255,255,0.5)] font-light">
                        {product.category}
                      </p>
                      <p className="text-[18px] text-white font-medium">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-[18px] text-[rgba(255,255,255,0.5)] font-light">
                No products found in this category.
              </p>
            </div>
          )}

          {/* Info Banner */}
          <div className="mt-20 bg-linear-to-r from-[#1ecbe1]/10 via-[#e91e8c]/10 to-[#ff6b35]/10 border border-[rgba(255,255,255,0.08)] rounded-[4px] px-8 md:px-12 py-10 md:py-12">
            <div className="max-w-[800px] mx-auto text-center">
              <h3 className="text-[24px] md:text-[28px] text-white tracking-[-0.02em] font-medium mb-4">
                Limited Quantities Available
              </h3>
              <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.7)] mb-6 font-light">
                Each piece is produced in small batches to ensure
                quality and exclusivity. Once they&apos;re gone,
                they&apos;re gone.
              </p>
              <div className="flex flex-wrap gap-3 justify-center text-[13px] text-[rgba(255,255,255,0.5)] font-light">
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
