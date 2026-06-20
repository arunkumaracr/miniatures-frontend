// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProducts, getCategories, getOrders } from "@/lib/admin-api";
import { Package, Tag, TrendingUp, CheckCircle, ShoppingCart, IndianRupee } from "lucide-react";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface RecentOrder {
  id: string;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-600",
  processing: "bg-blue-50 text-blue-600",
  shipped: "bg-purple-50 text-purple-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-500",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    topSelling: 0,
    available: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [productsRes, categoriesRes, ordersRes] = await Promise.all([
        getProducts(),
        getCategories(),
        getOrders(),
      ]);

      const products = productsRes.products || [];
      const categories = categoriesRes.categories || [];
      const orders: RecentOrder[] = ordersRes.orders || [];

      const totalRevenue = orders.reduce((sum: number, o: RecentOrder) => sum + Number(o.totalAmount || 0), 0);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.filter((c: any) => c.id !== "all").length,
        topSelling: products.filter((p: any) => p.isTopSelling).length,
        available: products.filter((p: any) => p.isAvailable).length,
        totalOrders: orders.length,
        totalRevenue,
      });

      setRecentOrders(orders.slice(0, 5));
      setLoading(false);
    }
    loadStats();
  }, []);

  const cards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Categories", value: stats.totalCategories, icon: Tag, color: "text-purple-600 bg-purple-50" },
    { label: "Top Selling", value: stats.topSelling, icon: TrendingUp, color: "text-brand-600 bg-brand-50" },
    { label: "Available", value: stats.available, icon: CheckCircle, color: "text-green-600 bg-green-50" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-orange-600 bg-orange-50" },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: IndianRupee,
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-1">Dashboard</h1>
      <p className="text-sm text-slate-500 mb-8">Welcome back! Here's your store overview.</p>

      {loading ? (
        <div className="text-sm text-slate-400">Loading stats...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {cards.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900">{value}</p>
                  <p className="text-xs text-slate-500 font-medium">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors"
              >
                View all →
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-10">No orders yet.</p>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Order</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="text-left px-5 py-3 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3">
                        <span className="font-mono text-xs font-bold text-slate-700">
                          #{String(order.id).slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-xs font-bold text-slate-800">{order.customerName}</td>
                      <td className="px-5 py-3 text-xs text-slate-500 font-medium">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-3 text-sm font-black text-slate-800">
                        ₹{Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.status] ?? "bg-slate-50 text-slate-500"}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
