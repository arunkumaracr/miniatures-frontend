// components/home-client.tsx
"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "@/components/products/product-card";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function HomeClient() {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    fetch(`${BASE_URL}/api/categories`)
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []));
  }, []);

  // Reload products when tab changes
  useEffect(() => {
    setLoading(true);
    const url = activeTab === "all"
      ? `${BASE_URL}/api/products`
      : `${BASE_URL}/api/products?categoryId=${activeTab}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      });
  }, [activeTab]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-pink-500 bg-pink-50 px-3 py-1 rounded-full">
          Our Catalog
        </span>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight md:text-4xl">
          Explore Our Toy Universe
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto font-medium">
          Find the perfect match for every age, interest, and developmental milestone.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-start md:justify-center overflow-x-auto gap-2 pb-4 mb-8 scrollbar-none border-b border-slate-200/60">
        {categories.map((category: any) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`whitespace-nowrap px-4 py-2 text-xs font-black uppercase tracking-wider rounded-md transition-all duration-200 ${
              activeTab === category.id
                ? "bg-pink-500 text-white shadow-md shadow-pink-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[400px] bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-400 font-medium text-sm">
            No products found in this category yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}