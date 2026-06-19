"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ProductCard } from "@/components/products/product-card";
import { ToyProduct } from "@/types/store";
import { Search, X } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";

  const [inputValue, setInputValue] = useState(initialQuery);
  const [allProducts, setAllProducts] = useState<ToyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Keep input in sync when URL param changes (e.g. browser back/forward)
  useEffect(() => {
    setInputValue(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    fetch(`${BASE_URL}/api/products`)
      .then((r) => r.json())
      .then((data) => setAllProducts(Array.isArray(data.products) ? data.products : []))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const q = initialQuery.trim().toLowerCase();
    if (!q) return allProducts;
    return allProducts.filter((p) => p.title.toLowerCase().includes(q));
  }, [initialQuery, allProducts]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = inputValue.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-24">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search toys, puzzles, plushies..."
                className="w-full h-12 pl-5 pr-12 rounded-full border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/20 shadow-sm transition-all"
                autoFocus
              />
              <div className="absolute right-4 top-3.5 flex items-center gap-2">
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => { setInputValue(""); router.push("/search"); }}
                  >
                    <X className="h-4 w-4 text-slate-400 hover:text-pink-500 transition-colors" />
                  </button>
                )}
                <button type="submit">
                  <Search className="h-5 w-5 text-pink-500 hover:text-pink-600 transition-colors" />
                </button>
              </div>
            </div>
          </form>

          {/* Header */}
          <div className="mb-6">
            {initialQuery ? (
              <>
                <h1 className="text-xl font-black text-slate-900">
                  {loading ? "Searching…" : `${results.length} result${results.length !== 1 ? "s" : ""} for`}{" "}
                  {!loading && (
                    <span className="text-pink-500">"{initialQuery}"</span>
                  )}
                </h1>
                {!loading && results.length > 0 && (
                  <p className="text-sm text-slate-400 font-medium mt-1">
                    Showing all matching products
                  </p>
                )}
              </>
            ) : (
              <h1 className="text-xl font-black text-slate-900">All Products</h1>
            )}
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-[400px] bg-white rounded-2xl border border-slate-100 animate-pulse" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-28 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Search className="h-10 w-10 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-black text-base mb-1">
                No results for "{initialQuery}"
              </p>
              <p className="text-slate-400 text-sm font-medium">
                Try a different keyword or browse by category
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
