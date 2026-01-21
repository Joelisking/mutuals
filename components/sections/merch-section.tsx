'use client';

import { merchItems } from '@/lib/data/merch-data';
import { useGetProductsQuery } from '@/lib/redux/api/openapi.generated';
import { Loader2 } from 'lucide-react';
import { Product, ApiResponse } from '@/lib/types/api';

export default function MerchSection() {
  const { data, isLoading } = useGetProductsQuery({
    limit: 8,
    status: 'ACTIVE',
  });

  // Handle response structure - cast to proper type
  const response = data as ApiResponse<Product[]> | undefined;
  const apiProducts: Product[] = response?.data || [];

  // Map static data to Product format for fallback
  const fallbackProducts: Product[] = merchItems.map((item, index) => ({
    id: `static-${index}`,
    name: item.name,
    slug: item.name.toLowerCase().replace(/\s+/g, '-'),
    price: parseFloat(item.price.replace('$', '')),
    category: item.tag,
    status: 'ACTIVE' as const,
    images: [{ id: `img-${index}`, productId: `static-${index}`, imageUrl: item.image, order: 0 }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  // Use API data if available, otherwise fall back to static data
  const products = apiProducts.length > 0 ? apiProducts : fallbackProducts;
  return (
    <section className="bg-[#0a0a0f] py-16 md:py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute bg-[#1ecbe1] blur-[200px] left-0 opacity-[0.06] rounded-full w-[500px] h-[500px] top-1/4" />
      <div className="absolute bg-[#ff6b35] blur-[220px] right-[10%] opacity-[0.06] rounded-full w-[600px] h-[600px] top-[30%]" />

      <div className="max-w-screen-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-3">
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-white tracking-[-0.02em] font-medium mb-1">
            Shop
          </h2>
          <p className="text-base md:text-base text-white/50 font-light max-w-2xl">
            Limited-run merchandise. Wear the culture.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-white/50" />
          </div>
        )}

        {/* Merch - Horizontal scroll on mobile, grid on desktop */}
        {!isLoading && products.length > 0 && (
          <>
            {/* Mobile: Horizontal Scrollable with peek */}
            <div className="block sm:hidden mb-16">
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-3 pb-4">
                  {products.map((product) => (
                    <div key={product.id} className="shrink-0 w-[85%]">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop: Grid layout */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}

        {/* New Drop CTA */}
        <div className="bg-linear-to-r from-[#1ecbe1]/10 via-[#e91e8c]/10 to-[#ff6b35]/10 border border-white/8 rounded-none md:rounded px-8 md:px-12 py-12 md:py-16 text-center">
          <div className="bg-white/5 border border-white/10 rounded-sm px-4 py-2 inline-flex items-center gap-2 mb-6">
            <span className="text-xs text-white uppercase tracking-[0.12em] font-medium">
              Exclusive Access
            </span>
          </div>
          <h3 className="text-3xl md:text-4xl lg:text-4xl text-white tracking-[-0.02em] font-medium mb-4">
            New Drop Every Month
          </h3>
          <p className="text-base md:text-base text-white/70 max-w-xl mx-auto mb-8 font-light">
            Subscribe to get early access to limited-run merchandise
            and exclusive collaborations
          </p>
          <button className="bg-white hover:bg-white/90 transition-colors rounded-sm px-10 py-4 text-sm text-[#050507] uppercase tracking-[0.12em] font-medium">
            Join the Waitlist
          </button>
        </div>
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.imageUrl || '/assets/featured-afrobeats.png';
  const price = typeof product.price === 'number' ? `$${product.price}` : product.price;

  return (
    <button className="group block text-left w-full">
      <div className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-[2px] mb-4">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Tag badge */}
          <div className="absolute top-3 left-3">
            <span className="text-xs text-white uppercase tracking-[0.15em] font-semibold bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-sm">
              {product.category}
            </span>
          </div>

          {/* Add to Cart button - appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white hover:bg-white/95 transition-colors rounded-sm px-5 py-2.5 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
                <circle cx="6" cy="13" r="1" stroke="#050507" strokeWidth="1.5" />
                <circle cx="13" cy="13" r="1" stroke="#050507" strokeWidth="1.5" />
                <path
                  d="M1 1h2l2.68 7.39a1 1 0 00.95.68h6.74a1 1 0 00.95-.68L16 4H4"
                  stroke="#050507"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-xs text-[#050507] uppercase tracking-[0.12em] font-medium">
                Add to Cart
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1">
          <h4 className="text-lg md:text-xl text-white tracking-[-0.01em] font-medium mb-2 leading-tight group-hover:text-[#1ecbe1] transition-colors">
            {product.name}
          </h4>
          <p className="text-base text-white/70 font-light">{price}</p>
        </div>
      </div>
    </button>
  );
}
