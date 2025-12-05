'use client';

import Link from 'next/link';
import { useCart } from '@/lib/context/cart-context';
import ShopSubNav from '@/components/shop/shop-subnav';

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <>
        <ShopSubNav />
        <div className="min-h-screen bg-[#050507] pt-32 md:pt-36">
          <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
            <h1 className="text-5xl md:text-6xl text-white tracking-[-0.03em] font-medium mb-8">
              Your Cart
            </h1>
            <div className="bg-[#0a0a0f] border border-white/8 rounded p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-6 text-white/30"
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
              <h2 className="text-2xl text-white font-medium mb-3">
                Your cart is empty
              </h2>
              <p className="text-base text-white/60 mb-8 font-light">
                Discover our latest drops and exclusive pieces
              </p>
              <Link
                href="/shop"
                className="inline-block bg-white hover:bg-white/90 transition-colors rounded-sm px-8 py-4 text-sm text-[#050507] uppercase tracking-[0.12em] font-medium">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ShopSubNav />
      <div className="min-h-screen bg-[#050507] pt-32 md:pt-36">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 py-16 md:py-24">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-5xl md:text-6xl text-white tracking-[-0.03em] font-medium">
              Your Cart
            </h1>
            <button
              onClick={clearCart}
              className="text-sm text-white/50 hover:text-red-500 transition-colors uppercase tracking-[0.12em] font-medium">
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="bg-[#0a0a0f] border border-[rgba(255,255,255,0.08)] rounded-[4px] p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <Link
                      href={`/shop/${item.product.slug}`}
                      className="shrink-0 w-32 h-32 rounded-[4px] overflow-hidden border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] transition-all">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/shop/${item.product.slug}`}
                          className="text-[18px] md:text-[20px] text-white font-medium hover:text-[#1ecbe1] transition-colors mb-2 block">
                          {item.product.name}
                        </Link>
                        <div className="flex items-center gap-4 text-[13px] text-[rgba(255,255,255,0.5)] uppercase tracking-[0.12em] font-medium">
                          <span>Size: {item.size}</span>
                          <span>•</span>
                          <span>${item.product.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-[rgba(255,255,255,0.15)] rounded-sm overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="px-4 py-2 text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                            -
                          </button>
                          <span className="px-6 py-2 text-white border-x border-[rgba(255,255,255,0.15)]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.quantity + 1
                              )
                            }
                            className="px-4 py-2 text-white hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.size)
                          }
                          className="text-[13px] text-[rgba(255,255,255,0.5)] hover:text-red-500 transition-colors uppercase tracking-[0.12em] font-medium">
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-[20px] md:text-[24px] text-white font-medium">
                        $
                        {(item.product.price * item.quantity).toFixed(
                          2
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#0a0a0f] border border-[rgba(255,255,255,0.08)] rounded-[4px] p-6 sticky top-24">
                <h2 className="text-[20px] text-white font-medium mb-6 pb-4 border-b border-[rgba(255,255,255,0.08)]">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[15px]">
                    <span className="text-[rgba(255,255,255,0.6)] font-light">
                      Items ({totalItems})
                    </span>
                    <span className="text-white font-medium">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[15px]">
                    <span className="text-[rgba(255,255,255,0.6)] font-light">
                      Shipping
                    </span>
                    <span className="text-white font-medium">
                      {totalPrice >= 100 ? 'FREE' : '$10.00'}
                    </span>
                  </div>
                  {totalPrice < 100 && (
                    <div className="bg-[#1ecbe1]/10 border border-[#1ecbe1]/30 rounded-sm px-3 py-2">
                      <p className="text-[12px] text-[#1ecbe1] font-light">
                        Spend ${(100 - totalPrice).toFixed(2)} more
                        for free shipping
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-[rgba(255,255,255,0.08)] pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[18px] text-white font-medium uppercase tracking-[0.08em]">
                      Total
                    </span>
                    <span className="text-[24px] text-white font-medium">
                      $
                      {(
                        totalPrice + (totalPrice >= 100 ? 0 : 10)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <a
                  href="https://shop.mutuals.com/checkout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-white hover:bg-[rgba(255,255,255,0.9)] transition-colors rounded-sm px-8 py-4 text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium text-center mb-3">
                  Proceed to Checkout
                </a>

                <Link
                  href="/shop"
                  className="block w-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.08)] transition-colors rounded-sm px-8 py-4 text-[13px] text-white uppercase tracking-[0.12em] font-medium text-center">
                  Continue Shopping
                </Link>

                <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.08)] space-y-3 text-[12px] text-[rgba(255,255,255,0.5)] font-light">
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 16 16">
                      <path
                        d="M8 1L10.5 6L16 6.75L12 10.5L13 16L8 13.25L3 16L4 10.5L0 6.75L5.5 6L8 1Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Free shipping on orders over $100</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 16 16">
                      <path
                        d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M8 2L8 8L12 8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Easy returns within 30 days</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg
                      className="w-4 h-4 shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 16 16">
                      <circle
                        cx="8"
                        cy="8"
                        r="6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M5 8L7 10L11 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Secure checkout via Shopify</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
