"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getMyOrders } from "@/lib/auth-api";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { LogOut, Package, ChevronRight, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface MyOrder {
  id: string;
  items: { productId: string; quantity: number; price: number }[];
  status: OrderStatus;
  total?: number;
  createdAt: string;
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-600 border-amber-100",
  processing: "bg-blue-50 text-blue-600 border-blue-100",
  shipped: "bg-purple-50 text-purple-600 border-purple-100",
  delivered: "bg-green-50 text-green-600 border-green-100",
  cancelled: "bg-red-50 text-red-500 border-red-100",
};

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AccountPage() {
  const { user, token, isLoggedIn, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<MyOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/auth/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn || !token) {
      setOrdersLoading(false);
      return;
    }
    setOrdersLoading(true);
    setOrdersError("");
    getMyOrders(token)
      .then((data) => {
        if (data.error) {
          setOrdersError(`Could not load orders (${data.error}). Check your backend GET /api/orders/my endpoint.`);
        }
        setOrders(data.orders || []);
      })
      .catch(() => setOrdersError("Failed to fetch orders. Please try again."))
      .finally(() => setOrdersLoading(false));
  }, [token, isLoggedIn]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (!isLoggedIn || !user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 pb-24">
        <h1 className="text-2xl font-black text-slate-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ── Profile card ── */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              {/* Avatar */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="h-16 w-16 rounded-full bg-pink-500 text-white font-black text-xl flex items-center justify-center shadow-md shadow-pink-200">
                  {initials}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg leading-tight">{user.name}</p>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-1">
                <Link
                  href="/account"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-pink-50 text-pink-600 text-sm font-bold"
                >
                  <span className="flex items-center gap-2">
                    <Package className="h-4 w-4" /> My Orders
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-500 text-sm font-bold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </aside>

          {/* ── Order history ── */}
          <section className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-base font-black text-slate-900">Order History</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {orders.length} order{orders.length !== 1 ? "s" : ""} placed
                </p>
              </div>

              {ordersError ? (
                <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
                  <p className="text-xs font-semibold text-amber-700">{ordersError}</p>
                </div>
              ) : null}
              {ordersLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <ShoppingBag className="h-10 w-10 text-slate-300 stroke-[1.5]" />
                  <p className="text-sm font-bold text-slate-400">No orders yet</p>
                  <Link
                    href="/"
                    className="text-xs font-black text-pink-500 hover:text-pink-600 transition-colors"
                  >
                    Start shopping →
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <div key={order.id} className="px-6 py-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-mono font-bold text-slate-700">
                          #{String(order.id).slice(-8).toUpperCase()}
                        </p>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          {formatDate(order.createdAt)} · {order.items?.length ?? 0} item{order.items?.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {order.total != null && (
                          <span className="text-sm font-black text-slate-900">
                            ₹{Number(order.total).toFixed(2)}
                          </span>
                        )}
                        <span
                          className={cn(
                            "text-xs font-bold px-2.5 py-1 rounded-full border capitalize",
                            STATUS_STYLES[order.status] ?? "bg-slate-50 text-slate-500 border-slate-100"
                          )}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
