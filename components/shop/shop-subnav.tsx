"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/context/cart-context';

interface ShopSubNavProps {
  categories?: string[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export default function ShopSubNav({
  categories = ['ALL', 'NEW IN', 'T-SHIRTS & TOPS', 'HOODIES', 'ACCESSORIES', 'ICON TEES', 'SALE', 'COLLECTIONS'],
  selectedCategory = 'ALL',
  onCategoryChange
}: ShopSubNavProps) {
  const pathname = usePathname();
  const isShopRoot = pathname === '/shop';
  const { totalItems } = useCart();

  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-[#000000] border-b border-[rgba(255,255,255,0.08)]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide py-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange?.(category)}
              className={`whitespace-nowrap text-[11px] md:text-[12px] uppercase tracking-[0.15em] font-medium transition-colors ${
                selectedCategory === category
                  ? 'text-white'
                  : 'text-[rgba(255,255,255,0.5)] hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Right side actions - Currency, Support & Cart */}
      <div className="absolute right-4 md:right-8 lg:right-16 top-0 bottom-0 flex items-center gap-4 md:gap-6 bg-[#000000] pl-8">
        <button className="text-[11px] md:text-[12px] text-[rgba(255,255,255,0.7)] hover:text-white uppercase tracking-[0.15em] font-medium transition-colors">
          $ USD
        </button>
        <button className="text-[11px] md:text-[12px] text-[rgba(255,255,255,0.7)] hover:text-white uppercase tracking-[0.15em] font-medium transition-colors">
          SUPPORT
        </button>
        <Link
          href="/shop/cart"
          className="relative flex items-center gap-2 text-[rgba(255,255,255,0.7)] hover:text-white transition-colors group"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#1ecbe1] text-[#050507] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className="hidden md:inline text-[11px] md:text-[12px] uppercase tracking-[0.15em] font-medium">
            BASKET
          </span>
        </Link>
      </div>
    </div>
  );
}
