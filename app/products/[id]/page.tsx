// app/products/[id]/page.tsx
"use client";

import { useState, use, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { useCart } from "@/lib/cart-context";
import { ToyProduct } from "@/types/store";
import { TopSelling } from "@/components/top-selling";
import { ProductCard } from "@/components/products/product-card";
import { Star, Heart, Plus, Minus, ChevronRight } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<ToyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);
  const [related, setRelated] = useState<ToyProduct[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${BASE_URL}/api/products/${resolvedParams.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.product) {
          setNotFoundState(true);
        } else {
          setProduct(data.product);
          // Fetch same-category products for cross-sell
          fetch(`${BASE_URL}/api/products?categoryId=${data.product.categoryId}`)
            .then((r) => r.json())
            .then((res) => {
              const others: ToyProduct[] = (res.products || []).filter(
                (p: ToyProduct) => p.id !== data.product.id
              );
              setRelated(others.slice(0, 4));
            })
            .catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => {
        setNotFoundState(true);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="space-y-4 w-full max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="aspect-square bg-slate-100 rounded-2xl animate-pulse" />
              <div className="space-y-4 py-8">
                <div className="h-4 bg-slate-100 rounded-lg w-1/3 animate-pulse" />
                <div className="h-8 bg-slate-100 rounded-lg w-3/4 animate-pulse" />
                <div className="h-4 bg-slate-100 rounded-lg w-1/2 animate-pulse" />
                <div className="h-10 bg-slate-100 rounded-lg w-1/3 animate-pulse" />
                <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
                <div className="h-12 bg-slate-100 rounded-full w-1/2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFoundState || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-2xl font-black text-slate-700">Product not found</p>
          <Link href="/" className="text-sm font-bold text-pink-500 hover:underline">
            ← Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const discountPercent = product.originalPrice > product.discountPrice
    ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)
    : 0;

  const handleAddToCartWithQty = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Breadcrumb */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 tracking-wide uppercase">
            <Link href="/" className="hover:text-pink-500 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-slate-400 stroke-[2.5]" />
            <Link href="/" className="hover:text-pink-500 transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3 text-slate-400 stroke-[2.5]" />
            <span className="text-slate-800 font-black truncate max-w-[200px]">Product Details</span>
          </div>
        </nav>

        {/* Main Product View */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">

            {/* Left: Image */}
            <div className="md:col-span-6 w-full relative aspect-square bg-[#FDF2F8]/40 border border-slate-100 rounded-2xl overflow-hidden p-6 flex items-center justify-center group">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {discountPercent > 0 && (
                <div className="absolute top-6 left-6 h-16 w-16 bg-[#FFBB38] rounded-full flex flex-col items-center justify-center shadow shadow-amber-500/20 z-10">
                  <span className="text-xs font-black text-slate-900">-{discountPercent}%</span>
                </div>
              )}
            </div>

            {/* Right: Info */}
            <div className="md:col-span-6 text-left space-y-4 sm:space-y-5">

              {/* Category + Badge */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                  🎯 TOY UNIVERSE / {product.categoryId.toUpperCase()}
                </span>
                {product.badge && (
                  <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Stars & Reviews */}
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex text-amber-400 items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4 w-4 ${idx < Math.floor(product.rating) ? "fill-current" : "opacity-25"}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {product.reviewCount} Verified Reviews
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                {product.originalPrice > product.discountPrice && (
                  <span className="text-base sm:text-lg text-slate-400 line-through font-bold">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-black text-pink-600">
                  ₹{product.discountPrice.toFixed(2)}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xl">
                Encourage developmental growth, critical reasoning, and hours of immersive
                adventure with this authentic product collection built for creative play.
              </p>

              {/* Availability */}
              <div className="w-fit bg-[#FDF2F8] text-pink-700 rounded-md px-4 py-2.5 text-xs font-extrabold border border-pink-100/30 flex items-center gap-1.5 shadow-sm">
                Availability:{" "}
                <span className="text-purple-700 uppercase tracking-wide">
                  {product.isAvailable ? "✔ Available In Stock" : "❌ Out Of Stock"}
                </span>
              </div>

              {/* Age Range */}
              {product.ageRange && (
                <div className="text-xs font-bold text-slate-500">
                  Suitable Age:{" "}
                  <span className="text-slate-800">{product.ageRange}</span>
                </div>
              )}

              {/* Variants */}
              <div className="space-y-1.5 max-w-sm">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">
                  Variants / Size
                </label>
                <select className="w-full border border-slate-200 rounded-lg p-3 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-pink-400 cursor-pointer shadow-sm">
                  <option>Standard Pack Edition</option>
                  <option>Deluxe Collector Set</option>
                  <option>Premium Gift Box</option>
                </select>
              </div>

              {/* Quantity + Wishlist + Cart */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-lg h-12 overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 h-full hover:bg-slate-50 text-slate-500 transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                  <span className="w-10 text-center text-xs font-black text-slate-800 select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 h-full hover:bg-slate-50 text-slate-500 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Wishlist */}
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`h-12 w-12 border rounded-lg flex items-center justify-center transition-all shadow-sm ${
                    isWishlisted
                      ? "bg-pink-50 border-pink-200 text-pink-500"
                      : "border-slate-200 bg-white text-slate-600 hover:text-pink-500"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                </button>

                {/* Add to Cart */}
                <button
                  disabled={!product.isAvailable}
                  onClick={handleAddToCartWithQty}
                  className="flex-1 md:flex-none h-12 min-w-[200px] flex items-center justify-center gap-2 rounded-full bg-[#A21CAF] hover:bg-pink-600 text-white font-black text-xs uppercase tracking-wider px-8 transition-all duration-150 shadow-md disabled:bg-slate-200 disabled:text-slate-400 active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4 stroke-[3]" /> Add to Cart
                </button>
              </div>

              {/* Tags */}
              <div className="border-t border-slate-100 pt-5 space-y-2 text-xs font-bold text-slate-400">
                <div>
                  Category:{" "}
                  <span className="text-pink-600 ml-1 capitalize">{product.categoryId} Marketplace</span>
                </div>
                <div>
                  Tags:{" "}
                  <span className="text-purple-600 ml-1">Premium, Safe, KidApproved</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">You May Also Like</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">More from the same category</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        <TopSelling />
      </div>

      <Footer />
    </div>
  );
}