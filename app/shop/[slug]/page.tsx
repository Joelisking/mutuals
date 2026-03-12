'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/lib/context/cart-context';
import ShopSubNav from '@/components/shop/shop-subnav';
import { useGetSettingByKeyQuery } from '@/lib/redux/api/settings.api';
import { useGetSitewideDiscountQuery } from '@/lib/redux/api/shop.api';
import { useGetProductsSlugBySlugQuery } from '@/lib/redux/api/openapi.generated';

function applyDiscount(price: number, discount: { type: string; value: number } | null): number | null {
  if (!discount) return null;
  if (discount.type === 'PERCENTAGE') return Math.max(0, price * (1 - discount.value / 100));
  return Math.max(0, price - discount.value);
}

const DEFAULT_SHIPPING_TEXT =
  'Free standard shipping on orders over $100. Easy returns within 30 days of delivery. Items must be unworn and in original packaging with tags attached.';

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();

  const { data: productData, isLoading } = useGetProductsSlugBySlugQuery({ slug: params.slug as string });
  const { data: shippingSettingData } = useGetSettingByKeyQuery({ key: 'shop_shipping_returns' });
  const { data: sitewideData } = useGetSitewideDiscountQuery();

  const product = (productData as any)?.data;
  const shippingText = (shippingSettingData as any)?.data?.parsedValue as string | undefined;
  const sitewideDiscount = (sitewideData as any)?.data ?? null;

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ShopSubNav />
        <div className="pt-32 md:pt-36 px-4 md:px-8 lg:px-16">
          <div className="max-w-screen-2xl mx-auto py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              <div className="aspect-square bg-gray-100 animate-pulse rounded-sm" />
              <div className="space-y-6">
                <div className="h-10 bg-gray-100 animate-pulse rounded w-2/3" />
                <div className="h-6 bg-gray-100 animate-pulse rounded w-1/4" />
                <div className="h-24 bg-gray-100 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[32px] text-[#050507] font-medium mb-4">Product Not Found</h1>
          <Link href="/shop" className="text-[#1ecbe1] hover:text-[#050507] transition-colors">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Normalise API data
  const images: string[] = [...(product.images ?? [])]
    .sort((a: any, b: any) => a.order - b.order)
    .map((img: any) => img.imageUrl);
  const variants: any[] = product.variants ?? [];
  const sizes = [...new Set(variants.map((v: any) => v.size).filter(Boolean))] as string[];
  const totalStock = variants.reduce((sum: number, v: any) => sum + (v.stockQuantity ?? 0), 0);
  const isSoldOut = product.status === 'SOLD_OUT' || totalStock === 0;
  const isLowStock = !isSoldOut && totalStock <= 5;
  const price = Number(product.basePrice);
  const discounted = applyDiscount(price, sitewideDiscount);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    const variant = variants.find((v: any) => v.size === selectedSize);
    addToCart(
      { id: product.id, name: product.name, slug: product.slug, price, images },
      selectedSize,
      quantity,
      variant?.id,
    );
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      <ShopSubNav />
      <div className="pt-32 md:pt-36 px-4 md:px-8 lg:px-16">
        <div className="max-w-screen-2xl mx-auto py-12 md:py-16">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-[13px] text-[rgba(0,0,0,0.4)]">
            <Link href="/" className="hover:text-[#050507] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-[#050507] transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-[#050507]">{product.name}</span>
          </div>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
            {/* Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-[4px] overflow-hidden border border-[rgba(0,0,0,0.08)] bg-[#f8f8f8]">
                {images[selectedImage] ? (
                  <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
                {(isSoldOut || isLowStock) && (
                  <div className="absolute top-6 right-6">
                    <div className={`${isSoldOut ? 'bg-red-600' : 'bg-[#ff6b35]'} px-4 py-2 rounded-sm`}>
                      <span className="text-[12px] text-white uppercase tracking-[0.12em] font-medium">
                        {isSoldOut ? 'Sold Out' : 'Low Stock'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-[4px] overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-[#050507]'
                          : 'border-[rgba(0,0,0,0.12)] hover:border-[rgba(0,0,0,0.3)]'
                      }`}>
                      <img src={image} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Title & Price */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-[36px] md:text-[44px] text-[#050507] tracking-[-0.02em] font-medium leading-tight">
                    {product.name}
                  </h1>
                  <div className="text-right">
                    {discounted !== null ? (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[18px] text-[rgba(0,0,0,0.35)] line-through font-normal">${price.toFixed(2)}</span>
                        <span className="text-[32px] md:text-[40px] text-[#050507] font-medium">${discounted.toFixed(2)}</span>
                      </div>
                    ) : (
                      <p className="text-[32px] md:text-[40px] text-[#050507] font-medium">${price.toFixed(2)}</p>
                    )}
                  </div>
                </div>
                <p className="text-[14px] text-[rgba(0,0,0,0.4)] uppercase tracking-[0.12em] font-medium">
                  {product.category}
                </p>
              </div>

              {/* Description */}
              {product.description && (
                <div className="border-t border-[rgba(0,0,0,0.08)] pt-6">
                  <p className="text-[15px] md:text-[16px] text-[rgba(0,0,0,0.6)] leading-relaxed font-light">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Size Selector */}
              {sizes.length > 0 && (
                <div className="border-t border-[rgba(0,0,0,0.08)] pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium">
                      Select Size
                    </label>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={isSoldOut}
                        className={`py-3 rounded-sm text-[14px] uppercase tracking-[0.12em] font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-[#050507] text-white'
                            : !isSoldOut
                              ? 'bg-white border border-[rgba(0,0,0,0.12)] text-[#050507] hover:bg-[rgba(0,0,0,0.04)]'
                              : 'bg-[rgba(0,0,0,0.02)] border border-[rgba(0,0,0,0.05)] text-[rgba(0,0,0,0.25)] cursor-not-allowed'
                        }`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="border-t border-[rgba(0,0,0,0.08)] pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium">
                    Quantity
                  </label>
                  <div className="flex items-center border border-[rgba(0,0,0,0.12)] rounded-sm overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-[#050507] hover:bg-[rgba(0,0,0,0.04)] transition-colors">-</button>
                    <span className="px-6 py-2 text-[#050507] border-x border-[rgba(0,0,0,0.12)]">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-[#050507] hover:bg-[rgba(0,0,0,0.04)] transition-colors">+</button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isSoldOut}
                  className={`w-full py-4 rounded-sm text-[13px] uppercase tracking-[0.12em] font-medium transition-all ${
                    !isSoldOut
                      ? 'bg-[#050507] text-white hover:bg-[#050507]/90'
                      : 'bg-[rgba(0,0,0,0.04)] border border-[rgba(0,0,0,0.1)] text-[rgba(0,0,0,0.25)] cursor-not-allowed'
                  }`}>
                  {addedToCart ? '✓ Added to Cart' : isSoldOut ? 'Sold Out' : !selectedSize ? 'Select a Size' : 'Add to Cart'}
                </button>

                {addedToCart && (
                  <div className="bg-[#1ecbe1]/10 border border-[#1ecbe1]/30 rounded-sm px-4 py-3 text-center">
                    <p className="text-[13px] text-[#1ecbe1] font-medium">
                      Added to cart!{' '}
                      <Link href="/shop/cart" className="underline">View Cart</Link>
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion */}
              <div className="border-t border-[rgba(0,0,0,0.08)] pt-6 space-y-4">
                {product.materials && (
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium py-3">
                      Materials &amp; Care
                      <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 20 20">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </summary>
                    <p className="text-[14px] text-[rgba(0,0,0,0.6)] leading-relaxed font-light pb-4">{product.materials}</p>
                  </details>
                )}

                {product.sizeGuide && (
                  <details className={`group ${product.materials ? 'border-t border-[rgba(0,0,0,0.08)]' : ''}`}>
                    <summary className="flex items-center justify-between cursor-pointer text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium py-3">
                      Size Guide
                      <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 20 20">
                        <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </summary>
                    <p className="text-[14px] text-[rgba(0,0,0,0.6)] leading-relaxed font-light pb-4">{product.sizeGuide}</p>
                  </details>
                )}

                <details className={`group ${product.materials || product.sizeGuide ? 'border-t border-[rgba(0,0,0,0.08)]' : ''}`}>
                  <summary className="flex items-center justify-between cursor-pointer text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium py-3">
                    Shipping &amp; Returns
                    <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 20 20">
                      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <p className="text-[14px] text-[rgba(0,0,0,0.6)] leading-relaxed font-light pb-4">
                    {shippingText || DEFAULT_SHIPPING_TEXT}
                  </p>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
