// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getProducts, getCategories } from "@/lib/admin-api";
import { Package, Tag, TrendingUp, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    topSelling: 0,
    available: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [productsRes, categoriesRes] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      const products = productsRes.products || [];
      const categories = categoriesRes.categories || [];

      setStats({
        totalProducts: products.length,
        totalCategories: categories.filter((c: any) => c.id !== "all").length,
        topSelling: products.filter((p: any) => p.isTopSelling).length,
        available: products.filter((p: any) => p.isAvailable).length,
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  const cards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "text-blue-600 bg-blue-50" },
    { label: "Categories", value: stats.totalCategories, icon: Tag, color: "text-purple-600 bg-purple-50" },
    { label: "Top Selling", value: stats.topSelling, icon: TrendingUp, color: "text-pink-600 bg-pink-50" },
    { label: "Available", value: stats.available, icon: CheckCircle, color: "text-green-600 bg-green-50" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900 mb-1">Dashboard</h1>
      <p className="text-sm text-slate-500 mb-8">Welcome back! Here's your store overview.</p>

      {loading ? (
        <div className="text-sm text-slate-400">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
      )}
    </div>
  );
}