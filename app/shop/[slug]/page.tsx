'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getProductBySlug,
  getRelatedProducts,
} from '@/lib/data/products-data';
import { useCart } from '@/lib/context/cart-context';
import ShopSubNav from '@/components/shop/shop-subnav';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const product = getProductBySlug(params.slug as string);

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <>
        <div className="min-h-screen bg-[#050507] pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-[32px] text-white font-medium mb-4">
              Product Not Found
            </h1>
            <Link
              href="/shop"
              className="text-[#1ecbe1] hover:text-white transition-colors">
              Return to Shop
            </Link>
          </div>
        </div>
      </>
    );
  }

  const relatedProducts = product.relatedProducts
    ? getRelatedProducts(product.relatedProducts)
    : [];

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }

    addToCart(product, selectedSize, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050507]">
      <ShopSubNav />
      <div className="pt-32 md:pt-36 px-4 md:px-8 lg:px-16">
        <div className="max-w-screen-2xl mx-auto py-12 md:py-16">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-[13px] text-[rgba(255,255,255,0.5)]">
            <Link
              href="/"
              className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/shop"
              className="hover:text-white transition-colors">
              Shop
            </Link>
            <span>/</span>
            <span className="text-white">{product.name}</span>
          </div>

          {/* Product Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
            {/* Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-[4px] overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[#0a0a0f]">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Stock Badge */}
                {product.stockLevel !== 'in-stock' && (
                  <div className="absolute top-6 right-6">
                    <div
                      className={`${
                        product.stockLevel === 'sold-out'
                          ? 'bg-red-600'
                          : 'bg-[#ff6b35]'
                      } px-4 py-2 rounded-sm`}>
                      <span className="text-[12px] text-white uppercase tracking-[0.12em] font-medium">
                        {product.stockLevel === 'sold-out'
                          ? 'Sold Out'
                          : 'Low Stock'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-[4px] overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-white'
                          : 'border-[rgba(255,255,255,0.15)] hover:border-[rgba(255,255,255,0.3)]'
                      }`}>
                      <img
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
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
                  <h1 className="text-[36px] md:text-[44px] text-white tracking-[-0.02em] font-medium leading-tight">
                    {product.name}
                  </h1>
                  <div className="text-right">
                    <p className="text-[32px] md:text-[40px] text-white font-medium">
                      ${product.price}
                    </p>
                  </div>
                </div>
                <p className="text-[14px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.12em] font-medium">
                  {product.category}
                </p>

                {/* Tags */}
                {product.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] px-3 py-1 rounded-sm text-[11px] text-[rgba(255,255,255,0.7)] uppercase tracking-[0.12em] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="border-t border-[rgba(255,255,255,0.08)] pt-6">
                <p className="text-[15px] md:text-[16px] text-[rgba(255,255,255,0.7)] leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Size Selector */}
              <div className="border-t border-[rgba(255,255,255,0.08)] pt-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-[13px] text-white uppercase tracking-[0.12em] font-medium">
                    Select Size
                  </label>
                  <button className="text-[13px] text-[#1ecbe1] hover:text-white transition-colors uppercase tracking-[0.12em] font-medium">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      disabled={!product.inStock}
                      className={`py-3 rounded-sm text-[14px] uppercase tracking-[0.12em] font-medium transition-all ${
                        selectedSize === size
                          ? 'bg-white text-[#050507]'
                          : product.inStock
                            ? 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] text-white hover:bg-[rgba(255,255,255,0.08)]'
                            : 'bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.3)] cursor-not-allowed'
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="border-t border-[rgba(255,255,255,0.08)] pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-[13px] text-white uppercase tracking-[0.12em] font-medium">
                    Quantity
                  </label>
                  <div className="flex items-center border border-[rgba(255,255,255,0.15)] rounded-sm overflow-hidden">
                    <button
                      onClick={() =>
                        setQuantity(Math.max(1, quantity - 1))
                      }
                      className="px-4 py-2 text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                      -
                    </button>
                    <span className="px-6 py-2 text-white border-x border-[rgba(255,255,255,0.15)]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`w-full py-4 rounded-sm text-[13px] uppercase tracking-[0.12em] font-medium transition-all ${
                    product.inStock
                      ? 'bg-white text-[#050507] hover:bg-[rgba(255,255,255,0.9)]'
                      : 'bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] text-[rgba(255,255,255,0.3)] cursor-not-allowed'
                  }`}>
                  {addedToCart
                    ? '✓ Added to Cart'
                    : product.inStock
                      ? 'Add to Cart'
                      : 'Sold Out'}
                </button>

                {addedToCart && (
                  <div className="bg-[#1ecbe1]/10 border border-[#1ecbe1]/30 rounded-sm px-4 py-3 text-center">
                    <p className="text-[13px] text-[#1ecbe1] font-medium">
                      Added to cart!{' '}
                      <Link href="/shop/cart" className="underline">
                        View Cart
                      </Link>
                    </p>
                  </div>
                )}
              </div>

              {/* Product Details Accordion */}
              <div className="border-t border-[rgba(255,255,255,0.08)] pt-6 space-y-4">
                <details className="group">
                  <summary className="flex items-center justify-between cursor-pointer text-[13px] text-white uppercase tracking-[0.12em] font-medium py-3">
                    Materials & Care
                    <svg
                      className="w-5 h-5 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 20 20">
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <p className="text-[14px] text-[rgba(255,255,255,0.7)] leading-relaxed font-light pb-4">
                    {product.materials}
                  </p>
                </details>

                <details className="group border-t border-[rgba(255,255,255,0.08)]">
                  <summary className="flex items-center justify-between cursor-pointer text-[13px] text-white uppercase tracking-[0.12em] font-medium py-3">
                    Size Guide
                    <svg
                      className="w-5 h-5 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 20 20">
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <p className="text-[14px] text-[rgba(255,255,255,0.7)] leading-relaxed font-light pb-4">
                    {product.sizeGuide}
                  </p>
                </details>

                <details className="group border-t border-[rgba(255,255,255,0.08)]">
                  <summary className="flex items-center justify-between cursor-pointer text-[13px] text-white uppercase tracking-[0.12em] font-medium py-3">
                    Shipping & Returns
                    <svg
                      className="w-5 h-5 transition-transform group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 20 20">
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </summary>
                  <p className="text-[14px] text-[rgba(255,255,255,0.7)] leading-relaxed font-light pb-4">
                    Free standard shipping on orders over $100. Easy
                    returns within 30 days of delivery. Items must be
                    unworn and in original packaging with tags
                    attached.
                  </p>
                </details>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-[rgba(255,255,255,0.08)] pt-16">
              <h2 className="text-[28px] md:text-[36px] text-white tracking-[-0.02em] font-medium mb-10">
                You May Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/shop/${relatedProduct.slug}`}
                    className="group">
                    <div className="bg-[#0a0a0f] rounded-[4px] overflow-hidden border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all">
                      <div className="relative overflow-hidden aspect-square">
                        <img
                          src={relatedProduct.images[0]}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-[16px] text-white font-medium mb-1">
                          {relatedProduct.name}
                        </h3>
                        <p className="text-[15px] text-[rgba(255,255,255,0.5)] font-light">
                          ${relatedProduct.price}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
