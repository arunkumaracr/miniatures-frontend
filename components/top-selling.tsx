// components/top-selling.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCardHorizontal } from "../components/products/product-card-horizontal";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function TopSelling() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products/top-selling`)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.topSelling || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Top Selling Products
        </h2>
        <Link
          href="/"
          className="text-xs sm:text-sm font-bold text-slate-500 hover:text-pink-500 transition-colors"
        >
          View All
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-[190px] bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <ProductCardHorizontal key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}