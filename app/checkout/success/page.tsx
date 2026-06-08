"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="max-w-md w-full text-center space-y-6">
      <div className="flex justify-center">
        <div className="h-24 w-24 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center">
          <CheckCircle2 className="h-14 w-14 text-green-500 stroke-[1.5]" />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-black text-slate-900">Order Placed!</h1>
        <p className="text-slate-500 font-medium mt-2">
          Thank you for shopping with Miniature Toys. Your order is confirmed.
        </p>
      </div>

      {orderId && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Order ID</p>
          <p className="text-xl font-black text-slate-900 mt-1 font-mono">{orderId}</p>
          <p className="text-xs text-slate-400 font-medium mt-2">
            Save this ID to track your order
          </p>
        </div>
      )}

      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 text-left space-y-2">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <p className="text-sm font-black text-amber-800">What happens next?</p>
        </div>
        <ul className="text-xs text-amber-700 font-medium space-y-1 ml-6 list-disc">
          <li>You will receive an order confirmation shortly</li>
          <li>We will notify you when your order is dispatched</li>
          <li>Estimated delivery: 3–7 business days</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-black text-sm uppercase tracking-wider transition-all shadow-md shadow-pink-200 active:scale-[0.98]"
        >
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/track"
          className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full border-2 border-slate-200 hover:border-pink-300 text-slate-700 hover:text-pink-600 font-black text-sm uppercase tracking-wider transition-all"
        >
          Track Order
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <Suspense fallback={<div className="text-sm text-slate-400 font-medium">Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
