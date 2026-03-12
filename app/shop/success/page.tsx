"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/context/cart-context";

interface SessionDetails {
  customerName?: string;
  customerEmail?: string;
  amountTotal?: number;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const [session, setSession] = useState<SessionDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearCart();

    if (!sessionId) {
      setLoading(false);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    fetch(`${apiUrl}/checkout/session/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        const s = data?.data;
        setSession({
          customerName: s?.customer_details?.name ?? undefined,
          customerEmail: s?.customer_details?.email ?? undefined,
          amountTotal: s?.amount_total ? s.amount_total / 100 : undefined,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="w-20 h-20 rounded-full bg-[#1ecbe1]/10 border border-[#1ecbe1]/30 flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-[#1ecbe1]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl text-[#050507] tracking-[-0.03em] font-medium mb-4">
          Order Confirmed
        </h1>

        {!loading && session?.customerName && (
          <p className="text-lg text-[rgba(0,0,0,0.6)] font-light mb-2">
            Thanks, {session.customerName}!
          </p>
        )}

        {!loading && session?.customerEmail && (
          <p className="text-sm text-[rgba(0,0,0,0.45)] font-light mb-2">
            A confirmation has been sent to{" "}
            <span className="text-[#050507]">{session.customerEmail}</span>.
          </p>
        )}

        {!loading && session?.amountTotal !== undefined && (
          <p className="text-sm text-[rgba(0,0,0,0.45)] font-light mb-8">
            Total charged:{" "}
            <span className="text-[#050507] font-medium">${session.amountTotal.toFixed(2)}</span>
          </p>
        )}

        {loading && (
          <p className="text-sm text-[rgba(0,0,0,0.3)] font-light mb-8 animate-pulse">
            Loading order details...
          </p>
        )}

        {!loading && !session?.customerEmail && (
          <p className="text-base text-[rgba(0,0,0,0.5)] font-light mb-8">
            Your payment was successful. You&apos;ll receive a confirmation email shortly.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop" className="inline-block bg-[#050507] hover:bg-[#050507]/90 transition-colors rounded-sm px-8 py-4 text-sm text-white uppercase tracking-[0.12em] font-medium">
            Continue Shopping
          </Link>
          <Link href="/" className="inline-block bg-transparent border border-[rgba(0,0,0,0.15)] hover:border-[rgba(0,0,0,0.3)] transition-colors rounded-sm px-8 py-4 text-sm text-[#050507] uppercase tracking-[0.12em] font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <p className="text-[rgba(0,0,0,0.3)] text-sm animate-pulse">Loading...</p>
        </div>
      }>
      <SuccessContent />
    </Suspense>
  );
}
