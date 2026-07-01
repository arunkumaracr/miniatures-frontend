// components/home-client.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";

const VISIBLE_COUNT = 12; // 3 rows × 4 columns

// Next.js automatically injects your live Railway domain here on Vercel
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function HomeClient() {
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch categories once when the page mounts
  useEffect(() => {
    fetch(`${BASE_URL}/api/categories`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch categories");
        return r.json();
      })
      .then((data) => {
        setCategories(data.categories || []);
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
      });
  }, []);

  // 2. Fetch and filter products whenever the user changes the active category tab
  useEffect(() => {
    setLoading(true);
    
    // If 'all' tab is active, fetch everything. Otherwise, append the category query parameter.
    const url = activeTab === "all"
      ? `${BASE_URL}/api/products`
      : `${BASE_URL}/api/products?categoryId=${activeTab}`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch products");
        return r.json();
      })
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, [activeTab]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      {/* Section Headers */}
      <div className="text-center space-y-2 mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-brand-500 bg-brand-50 px-3 py-1 rounded-full">
          Our Catalog
        </span>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight md:text-4xl">
          Explore Our Toy Universe
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto font-medium">
          Find the perfect match for every age, interest, and developmental milestone.
        </p>
      </div>

      {/* Category Tabs Filter Slider */}
      <div className="flex items-center justify-start md:justify-center overflow-x-auto gap-2 pb-4 mb-8 scrollbar-none border-b border-slate-200/60">
        {categories.map((category: any) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`whitespace-nowrap px-4 py-2 text-xs font-black uppercase tracking-wider rounded-md transition-all duration-200 ${
              activeTab === category.id
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Product Display Layout Grid */}
      {loading ? (
        // Skeleton loading animation states while fetching data
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[400px] bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        // Empty state UI if a selected category has no items assigned yet
        <div className="text-center py-20 bg-white rounded-lg border border-slate-200">
          <p className="text-slate-400 font-medium text-sm">
            No products found in this category yet.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, VISIBLE_COUNT).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length > VISIBLE_COUNT && (
            <div className="mt-12 flex flex-col items-center gap-3">
              <p className="text-sm text-slate-400 font-medium">
                Showing 12 of {products.length} products
              </p>
              <Link
                href={`/categories/${activeTab}`}
                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-black text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-md shadow-brand-200 transition-all"
              >
                Load More
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          )}
        </>
      )}
    </main>
  );
}