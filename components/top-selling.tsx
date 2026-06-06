// components/top-selling.tsx
"use client";

import Link from "next/link";
import { ProductCardHorizontal } from "../components/products/product-card-horizontal";
import { ToyProduct } from "../types/store";
import STORE_DATA from "../lib/products-top.json";

export function TopSelling() {
  const topSellingProducts = (STORE_DATA.topSelling || []) as ToyProduct[];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Top Selling Products
        </h2>
        <Link href="/shop" className="text-xs sm:text-sm font-bold text-slate-500 hover:text-pink-500 transition-colors">
          View All
        </Link>
      </div>

      {/* 🎯 FORCE A CLEAN RESPONSIVE MULTI-COLUMN GRID CONTAINER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topSellingProducts.map((product) => (
          <ProductCardHorizontal key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}