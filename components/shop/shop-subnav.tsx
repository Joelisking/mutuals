"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

      {/* Right side actions - Currency & Support */}
      <div className="absolute right-4 md:right-8 lg:right-16 top-0 bottom-0 flex items-center gap-6 bg-[#000000] pl-8">
        <button className="text-[11px] md:text-[12px] text-[rgba(255,255,255,0.7)] hover:text-white uppercase tracking-[0.15em] font-medium transition-colors">
          $ USD
        </button>
        <button className="text-[11px] md:text-[12px] text-[rgba(255,255,255,0.7)] hover:text-white uppercase tracking-[0.15em] font-medium transition-colors">
          SUPPORT
        </button>
        <Link
          href="/shop/cart"
          className="text-[11px] md:text-[12px] text-[rgba(255,255,255,0.7)] hover:text-white uppercase tracking-[0.15em] font-medium transition-colors"
        >
          BASKET
        </Link>
      </div>
    </div>
  );
}
