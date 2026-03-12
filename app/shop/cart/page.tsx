"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/context/cart-context";
import ShopSubNav from "@/components/shop/shop-subnav";
import { useGetSitewideDiscountQuery } from "@/lib/redux/api/shop.api";

export default function CartPage() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(
    null,
  );
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<null | {
    code: string;
    discountAmount: number;
    type: string;
    value: number;
    isSitewide?: boolean;
  }>(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(
    null,
  );

  const { data: sitewideData } = useGetSitewideDiscountQuery();
  const sitewideDiscount = (sitewideData as any)?.data ?? null;

  useEffect(() => {
    if (!sitewideDiscount) return;
    setAppliedDiscount((current) => {
      if (current && !current.isSitewide) return current;
      if (totalPrice <= 0) return null;
      const discountAmount =
        sitewideDiscount.type === "PERCENTAGE"
          ? Math.round(
              ((totalPrice * sitewideDiscount.value) / 100) * 100,
            ) / 100
          : Math.min(sitewideDiscount.value, totalPrice);
      return {
        code: sitewideDiscount.code,
        discountAmount,
        type: sitewideDiscount.type,
        value: sitewideDiscount.value,
        isSitewide: true,
      };
    });
  }, [sitewideDiscount, totalPrice]);

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountLoading(true);
    setDiscountError(null);
    setAppliedDiscount(null);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/discounts/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: discountCode,
          orderTotal: totalPrice,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Invalid discount code");
      setAppliedDiscount({ ...data.data, isSitewide: false });
    } catch (err: any) {
      setDiscountError(err.message || "Failed to apply discount");
    } finally {
      setDiscountLoading(false);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError(null);
    try {
      const lineItems = items.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.size,
        productId: item.product.id,
        image: item.product.images?.[0] ?? undefined,
      }));

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL ||
        "http://localhost:4000/api/v1";
      const res = await fetch(`${apiUrl}/checkout/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lineItems,
          ...(appliedDiscount
            ? { discountCode: appliedDiscount.code }
            : {}),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData?.message || "Failed to start checkout",
        );
      }

      const data = await res.json();
      window.location.href = data.data.url;
    } catch (err: any) {
      setCheckoutError(
        err.message || "Something went wrong. Please try again.",
      );
      setCheckoutLoading(false);
    }
  };

  const discountAmountApplied = appliedDiscount?.discountAmount ?? 0;
  const finalTotal =
    totalPrice - discountAmountApplied + (totalPrice >= 100 ? 0 : 10);

  if (items.length === 0) {
    return (
      <>
        <ShopSubNav />
        <div className="min-h-screen bg-white pt-32 md:pt-36 px-4 md:px-8 lg:px-16">
          <div className="max-w-screen-2xl mx-auto py-16 md:py-24">
            <h1 className="text-5xl md:text-6xl text-[#050507] tracking-[-0.03em] font-medium mb-8">
              Your Cart
            </h1>
            <div className="bg-[#f8f8f8] border border-[rgba(0,0,0,0.08)] rounded p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-6 text-[rgba(0,0,0,0.2)]"
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
              <h2 className="text-2xl text-[#050507] font-medium mb-3">
                Your cart is empty
              </h2>
              <p className="text-base text-[rgba(0,0,0,0.5)] mb-8 font-light">
                Discover our latest drops and exclusive pieces
              </p>
              <Link
                href="/shop"
                className="inline-block bg-[#050507] hover:bg-[#050507]/90 transition-colors rounded-sm px-8 py-4 text-sm text-white uppercase tracking-[0.12em] font-medium">
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
      <div className="min-h-screen bg-white pt-32 md:pt-36 px-4 md:px-8 lg:px-16">
        <div className="max-w-screen-2xl mx-auto py-16 md:py-24">
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-5xl md:text-6xl text-[#050507] tracking-[-0.03em] font-medium">
              Your Cart
            </h1>
            <button
              onClick={clearCart}
              className="text-sm text-[rgba(0,0,0,0.4)] hover:text-red-500 transition-colors uppercase tracking-[0.12em] font-medium">
              Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.product.id}-${item.size}`}
                  className="bg-[#f8f8f8] border border-[rgba(0,0,0,0.08)] rounded-[4px] p-6">
                  <div className="flex gap-6">
                    <Link
                      href={`/shop/${item.product.slug}`}
                      className="shrink-0 w-32 h-32 rounded-[4px] overflow-hidden border border-[rgba(0,0,0,0.08)] hover:border-[rgba(0,0,0,0.2)] transition-all">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          href={`/shop/${item.product.slug}`}
                          className="text-[18px] md:text-[20px] text-[#050507] font-medium hover:text-[#1ecbe1] transition-colors mb-2 block">
                          {item.product.name}
                        </Link>
                        <div className="flex items-center gap-4 text-[13px] text-[rgba(0,0,0,0.45)] uppercase tracking-[0.12em] font-medium">
                          <span>Size: {item.size}</span>
                          <span>•</span>
                          <span>
                            ${item.product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-[rgba(0,0,0,0.12)] rounded-sm overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.quantity - 1,
                              )
                            }
                            className="px-4 py-2 text-[#050507] hover:bg-[rgba(0,0,0,0.04)] transition-colors">
                            -
                          </button>
                          <span className="px-6 py-2 text-[#050507] border-x border-[rgba(0,0,0,0.12)]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product.id,
                                item.size,
                                item.quantity + 1,
                              )
                            }
                            className="px-4 py-2 text-[#050507] hover:bg-[rgba(0,0,0,0.04)] transition-colors">
                            +
                          </button>
                        </div>
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.size)
                          }
                          className="text-[13px] text-[rgba(0,0,0,0.4)] hover:text-red-500 transition-colors uppercase tracking-[0.12em] font-medium">
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-[20px] md:text-[24px] text-[#050507] font-medium">
                        $
                        {(item.product.price * item.quantity).toFixed(
                          2,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#f8f8f8] border border-[rgba(0,0,0,0.08)] rounded-[4px] p-6 sticky top-24">
                <h2 className="text-[20px] text-[#050507] font-medium mb-6 pb-4 border-b border-[rgba(0,0,0,0.08)]">
                  Order Summary
                </h2>

                {/* Discount Code */}
                <div className="mb-4">
                  {appliedDiscount?.isSitewide ? (
                    <p className="text-[13px] text-[#1ecbe1] font-medium">
                      ✓ {appliedDiscount.value}
                      {appliedDiscount.type === "PERCENTAGE"
                        ? "%"
                        : "$"}{" "}
                      off applied automatically
                    </p>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={discountCode}
                          onChange={(e) =>
                            setDiscountCode(
                              e.target.value.toUpperCase(),
                            )
                          }
                          placeholder="DISCOUNT CODE"
                          className="flex-1 bg-white border border-[rgba(0,0,0,0.12)] rounded-sm px-3 py-2 text-[13px] text-[#050507] uppercase tracking-[0.08em] placeholder:text-[rgba(0,0,0,0.3)] focus:outline-none focus:border-[rgba(0,0,0,0.3)]"
                        />
                        <button
                          onClick={handleApplyDiscount}
                          disabled={
                            discountLoading || !discountCode.trim()
                          }
                          className="px-4 py-2 bg-[rgba(0,0,0,0.06)] hover:bg-[rgba(0,0,0,0.1)] border border-[rgba(0,0,0,0.12)] rounded-sm text-[12px] text-[#050507] uppercase tracking-[0.08em] transition-colors disabled:opacity-50">
                          {discountLoading ? "..." : "Apply"}
                        </button>
                      </div>
                      {discountError && (
                        <p className="text-xs text-red-500 mt-1">
                          {discountError}
                        </p>
                      )}
                      {appliedDiscount && (
                        <p className="text-xs text-[#1ecbe1] mt-1">
                          ✓ {appliedDiscount.code} — saving $
                          {appliedDiscount.discountAmount.toFixed(2)}
                        </p>
                      )}
                    </>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-[15px]">
                    <span className="text-[rgba(0,0,0,0.5)] font-light">
                      Items ({totalItems})
                    </span>
                    <span className="text-[#050507] font-medium">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  {appliedDiscount && (
                    <div className="flex justify-between text-[15px]">
                      <span className="text-[#1ecbe1] font-light">
                        Discount ({appliedDiscount.code})
                      </span>
                      <span className="text-[#1ecbe1] font-medium">
                        -${appliedDiscount.discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-[15px]">
                    <span className="text-[rgba(0,0,0,0.5)] font-light">
                      Shipping
                    </span>
                    <span className="text-[#050507] font-medium">
                      {totalPrice >= 100 ? "FREE" : "$10.00"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[rgba(0,0,0,0.08)] pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[18px] text-[#050507] font-medium uppercase tracking-[0.08em]">
                      Total
                    </span>
                    <span className="text-[24px] text-[#050507] font-medium">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {checkoutError && (
                  <p className="text-xs text-red-500 text-center mb-3">
                    {checkoutError}
                  </p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="block w-full bg-[#050507] hover:bg-[#050507]/90 transition-colors rounded-sm px-8 py-4 text-[13px] text-white uppercase tracking-[0.12em] font-medium text-center mb-3 disabled:opacity-60 disabled:cursor-not-allowed">
                  {checkoutLoading
                    ? "Redirecting..."
                    : "Proceed to Checkout"}
                </button>
                <Link
                  href="/shop"
                  className="block w-full bg-white border border-[rgba(0,0,0,0.12)] hover:bg-[rgba(0,0,0,0.04)] transition-colors rounded-sm px-8 py-4 text-[13px] text-[#050507] uppercase tracking-[0.12em] font-medium text-center">
                  Continue Shopping
                </Link>

                <div className="mt-6 pt-6 border-t border-[rgba(0,0,0,0.08)] space-y-3 text-[12px] text-[rgba(0,0,0,0.4)] font-light">
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
                    <span>Secure checkout via Stripe</span>
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
