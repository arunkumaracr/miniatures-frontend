"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { useAuth } from "@/lib/auth-context";
import {
  Search, Package, CheckCircle2, Truck, Home,
  Clock, AlertCircle, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface TrackedOrder {
  id: string;
  status: OrderStatus;
  createdAt: string;
  customerName: string;
  address: string;
  totalAmount?: number;
}

const STEPS: { key: OrderStatus | "confirmed"; label: string; icon: React.ElementType }[] = [
  { key: "pending",    label: "Order Placed",  icon: Clock },
  { key: "confirmed",  label: "Confirmed",     icon: CheckCircle2 },
  { key: "processing", label: "Processing",    icon: Package },
  { key: "shipped",    label: "Shipped",       icon: Truck },
  { key: "delivered",  label: "Delivered",     icon: Home },
];

const STATUS_ORDER: Record<string, number> = {
  pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4,
};

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function TrackOrderPage() {
  const { isLoggedIn } = useAuth();
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackedIdRef = useRef<string>("");

  async function fetchOrder(id: string, silent = false) {
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/orders/track/${id}`);
      if (!res.ok) throw new Error("not_found");
      const data = await res.json();
      setOrder(data.order || data);
      setLastRefreshed(new Date());
      setError("");
    } catch {
      if (!silent) setError("Order not found. Please check your Order ID and try again.");
    } finally {
      if (!silent) setLoading(false);
    }
  }

  function startPolling(id: string) {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(() => fetchOrder(id, true), 10000);
  }

  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  async function handleTrack(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!orderId.trim()) return;
    setError("");
    setOrder(null);
    trackedIdRef.current = orderId.trim();
    await fetchOrder(orderId.trim());
    startPolling(orderId.trim());
  }

  const activeStep = order ? (STATUS_ORDER[order.status] ?? 0) : -1;

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-12 pb-24">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-brand-50 mb-4">
            <Package className="h-7 w-7 text-brand-500 stroke-[1.5]" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Track Your Order</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Enter your order ID to get a live status update
          </p>
        </div>

        {/* Lookup form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-600 uppercase tracking-wider">
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. 64f3a2b1c9e..."
                className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white font-mono"
              />
            </div>


            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-sm font-semibold text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !orderId.trim()}
              className="w-full h-12 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-brand-200 disabled:shadow-none"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              {loading ? "Looking up..." : "Track Order"}
            </button>
          </form>

          {isLoggedIn && (
            <p className="mt-4 text-center text-sm text-slate-400 font-medium">
              Signed in?{" "}
              <Link href="/account" className="font-black text-brand-500 hover:text-brand-600 transition-colors">
                View all your orders →
              </Link>
            </p>
          )}
        </div>

        {/* Result */}
        {order && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            {lastRefreshed && (
              <div className="flex items-center justify-end gap-1.5 -mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] text-slate-400 font-medium">
                  Live · updated {lastRefreshed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              </div>
            )}
            {/* Order meta */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-medium">Order ID</p>
                <p className="font-mono font-bold text-slate-800 text-sm">
                  #{String(order.id).slice(-12).toUpperCase()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-medium">Placed on</p>
                <p className="text-sm font-bold text-slate-800">{formatDate(order.createdAt)}</p>
              </div>
              {order.totalAmount != null && (
                <div className="text-right">
                  <p className="text-xs text-slate-400 font-medium">Total</p>
                  <p className="text-sm font-black text-brand-600">₹{Number(order.totalAmount).toFixed(2)}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            {order.status !== "cancelled" ? (
              <div>
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-5">
                  Shipment Progress
                </p>
                <div className="flex items-start gap-0">
                  {STEPS.map((step, idx) => {
                    const done = idx <= activeStep;
                    const active = idx === activeStep;
                    const Icon = step.icon;
                    return (
                      <div key={step.key} className="flex-1 flex flex-col items-center relative">
                        {/* Connector line */}
                        {idx < STEPS.length - 1 && (
                          <div className={cn(
                            "absolute top-5 left-1/2 w-full h-0.5 -translate-y-1/2",
                            done && idx < activeStep ? "bg-brand-400" : "bg-slate-200"
                          )} />
                        )}
                        {/* Circle */}
                        <div className={cn(
                          "relative z-10 h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all",
                          active
                            ? "bg-brand-500 border-brand-500 shadow-lg shadow-brand-200"
                            : done
                            ? "bg-brand-100 border-brand-300"
                            : "bg-white border-slate-200"
                        )}>
                          <Icon className={cn(
                            "h-4 w-4",
                            active ? "text-white" : done ? "text-brand-500" : "text-slate-300"
                          )} />
                        </div>
                        <p className={cn(
                          "mt-2 text-[10px] font-bold text-center leading-tight",
                          active ? "text-brand-500" : done ? "text-slate-600" : "text-slate-300"
                        )}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-black text-red-600">Order Cancelled</p>
                  <p className="text-xs text-red-400 font-medium mt-0.5">
                    This order has been cancelled. Contact support if you need help.
                  </p>
                </div>
              </div>
            )}

            {/* Delivery address */}
            {order.address && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">
                  Delivering to
                </p>
                <p className="text-sm font-bold text-slate-700">{order.customerName}</p>
                <p className="text-sm text-slate-500 font-medium">{order.address}</p>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
