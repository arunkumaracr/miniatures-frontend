// app/categories/[id]/page.tsx
"use client";

import { useState, use, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ProductCard } from "@/components/products/product-card";
import { ToyProduct } from "@/types/store";
import { ChevronDown, SlidersHorizontal, Check } from "lucide-react";
import { fetchProducts, fetchCategories } from "@/lib/api";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CategoryDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [sortBy, setSortBy] = useState("default");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [allProducts, setAllProducts] = useState<ToyProduct[]>([]);
  const [categoriesList, setCategoriesList] = useState<{ id: string; label: string }[]>([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [loading, setLoading] = useState(true);

  // Reset visible count whenever the category changes
  useEffect(() => {
    setVisibleCount(9);
  }, [resolvedParams.id]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchProducts().then((data) => setAllProducts(Array.isArray(data.products) ? data.products : [])),
      fetchCategories().then((data) => setCategoriesList(Array.isArray(data.categories) ? data.categories : [])),
    ]).finally(() => setLoading(false));
  }, []);

  // Handle active sidebar checked changes - route to the new category id view dynamically
  const handleCategoryCheckboxChange = (categoryId: string) => {
    router.push(`/categories/${categoryId}`);
  };

  const processedProducts = useMemo(() => {
    let result = [...allProducts];

    // 1. Category Filtering Logic based on active URL route ID
    if (resolvedParams.id !== "all") {
      result = result.filter((p) => p.categoryId === resolvedParams.id);
    }

    // 2. Sorting Switch Statement Matrix
    if (sortBy === "price-low") {
      result.sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.discountPrice - a.discountPrice);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [resolvedParams.id, sortBy, allProducts]);

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* 📋 SIDEBAR DESIGN PANEL: Fixed 3 Columns wide on Desktop, Hidden/Toggleable on Mobile */}
            <aside className={`lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6 ${
              showMobileFilters ? "block" : "hidden lg:block"
            }`}>
              <h2 className="text-md font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-3">
                Product Categories
              </h2>
              
              {/* Category Checkbox Form Elements matching image_3a3d06.jpg layout */}
              <div className="space-y-3.5">
                {categoriesList.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center gap-3 text-sm font-semibold text-slate-600 hover:text-brand-500 transition-colors cursor-pointer group"
                  >
                    <div
                      onClick={() => handleCategoryCheckboxChange(cat.id)}
                      className={`h-4 w-4 rounded flex-shrink-0 flex items-center justify-center transition-colors cursor-pointer ${
                        resolvedParams.id === cat.id
                          ? "bg-brand-500 border-2 border-brand-500"
                          : "border-2 border-slate-300 bg-white"
                      }`}
                    >
                      {resolvedParams.id === cat.id && (
                        <Check className="h-2.5 w-2.5 text-white stroke-[3.5]" />
                      )}
                    </div>
                    <span className={resolvedParams.id === cat.id ? "text-brand-600 font-extrabold" : "group-hover:translate-x-0.5 transition-transform"}>
                      {cat.label}
                    </span>
                  </label>
                ))}
              </div>
            </aside>

            {/* 🛍️ PRODUCT DATA DISPLAY FEED: Occupies 9 out of 12 columns */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* TOP ACTION BAR: Displays pagination indices and Sorting Select inputs */}
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                <div className="hidden md:block text-xs sm:text-sm font-bold text-slate-500 tracking-tight">
                  Showing 1–{Math.min(visibleCount, processedProducts.length)} of {processedProducts.length} results
                </div>

                <div className="flex items-center gap-2">
                  {/* Mobile Filter Toggle Drawer Button */}
                  <button 
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden p-2 text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 flex items-center gap-1 text-xs font-bold"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                  </button>

                  {/* Native Dropdown Selector styled cleanly matching image_3a3d06.jpg view */}
                  <div className="relative flex items-center gap-1.5 text-xs sm:text-sm">
                    <span className="text-slate-400 font-medium whitespace-nowrap">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-slate-200 rounded-lg py-1.5 pl-2.5 pr-8 bg-white font-bold text-slate-800 focus:outline-none focus:border-brand-400 appearance-none cursor-pointer shadow-sm text-xs sm:text-sm"
                    >
                      <option value="default">Default</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Top Rated</option>
                    </select>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 pointer-events-none stroke-[2.5]" />
                  </div>
                </div>
              </div>

              {/* Dynamic Product Card Grid Output Layer */}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="h-[400px] bg-slate-100 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : processedProducts.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-slate-400 font-bold text-sm">No products found in this category.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {processedProducts.slice(0, visibleCount).map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {visibleCount < processedProducts.length && (
                    <div className="mt-8 flex flex-col items-center gap-3">
                      <p className="text-sm text-slate-400 font-medium">
                        Showing {visibleCount} of {processedProducts.length} products
                      </p>
                      <button
                        onClick={() => setVisibleCount((v) => v + 9)}
                        className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-black text-sm uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-md shadow-brand-200 transition-all"
                      >
                        Load More
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                      </button>
                    </div>
                  )}
                </>
              )}

            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}