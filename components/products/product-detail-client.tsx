// components/products/product-detail-client.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ToyProduct } from "@/types/store";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import {
  Star, ShoppingCart, Heart, Truck,
  RotateCcw, ShieldCheck, Plus, Minus,
} from "lucide-react";

export function ProductDetailClient({ product }: { product: ToyProduct }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const wishlisted = isWishlisted(product.id);

  const discount = product.originalPrice > product.discountPrice
    ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 100)
    : 0;

  function handleAddToCart() {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

          {/* ── LEFT: Product Image ── */}
          <div className="relative bg-[#fef3ec]/60 flex items-center justify-center p-8 min-h-[420px]">
            {discount > 0 && (
              <div className="absolute top-5 left-5 bg-amber-400 text-white text-xs font-black px-3 py-1.5 rounded-full z-10">
                -{discount}%
              </div>
            )}
            <div className="relative w-full h-[380px]">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-contain drop-shadow-lg"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="p-8 flex flex-col justify-center space-y-5">

            {/* Category + Badge */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-widest text-brand-500 bg-brand-50 px-3 py-1 rounded-full">
                🧸 TOY UNIVERSE / {product.categoryId.toUpperCase()}
              </span>
              {product.badge && (
                <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Rating Row */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-slate-600">
                {product.rating.toFixed(1)}
              </span>
              <span className="text-sm text-slate-400">
                {product.reviewCount} Verified Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {product.originalPrice > product.discountPrice && (
                <span className="text-lg text-slate-400 line-through font-bold">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-3xl font-black text-brand-600">
                ₹{product.discountPrice.toFixed(2)}
              </span>
            </div>

            {/* Description */}
            {/* <p className="text-sm text-slate-500 leading-relaxed">
              Encourage developmental growth, critical reasoning, and hours of
              immersive adventure with this authentic product collection — built
              for creative play and lasting fun.
            </p> */}

            {/* Availability */}
            <div className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-lg w-fit border ${
              product.isAvailable
                ? "bg-green-50 text-green-700 border-green-100"
                : "bg-red-50 text-red-600 border-red-100"
            }`}>
              <span className={`w-2 h-2 rounded-full ${product.isAvailable ? "bg-green-500" : "bg-red-400"}`} />
              {product.isAvailable
                ? "✔ Available In Stock"
                : "✘ Out of Stock"}
            </div>

            {/* Age Range */}
            {/* {product.ageRange && (
              <div className="text-xs font-bold text-slate-500">
                Suitable Age: <span className="text-slate-800">{product.ageRange}</span>
              </div>
            )} */}

            {/* ── Variants / Size ── will add in future ──────────────────────
            <div className="space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-slate-600">Size / Variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants?.map((v) => (
                  <button
                    key={v}
                    className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-lg hover:border-brand-400 hover:text-brand-600 transition-colors"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            ──────────────────────────────────────────────────────────────── */}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 pt-1">
              {/* Quantity Selector */}
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-3 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="px-4 py-2 text-sm font-black text-slate-900 border-x border-slate-200 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-3 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-all ${
                  wishlisted
                    ? "bg-brand-50 border-brand-200 text-brand-500"
                    : "border-slate-200 text-slate-400 hover:border-brand-200 hover:text-brand-400"
                }`}
              >
                <Heart className={`h-4 w-4 ${wishlisted ? "fill-brand-500" : ""}`} />
              </button>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable}
                className="flex-1 flex items-center justify-center gap-2 bg-[#e8884f] hover:bg-[#d4703a] text-white text-sm font-black uppercase tracking-wider py-3.5 px-6 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-brand-200"
              >
                <ShoppingCart className="h-4 w-4" />
                Add To Cart
              </button>
            </div>

            {/* Category + Tags */}
            <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-100">
              <p>
                <span className="font-bold text-slate-500">Category: </span>
                <Link
                  href={`/categories/${product.categoryId}`}
                  className="text-brand-500 hover:underline capitalize"
                >
                  {product.categoryId}
                </Link>
              </p>
              <p>
                <span className="font-bold text-slate-500">Tags: </span>
                <span className="text-brand-500">Premium, Safe, KidApproved</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 bg-[#e8884f] rounded-2xl px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: "Free Shipping", sub: "When ordering over ₹999" },
            { icon: RotateCcw, title: "Free Return", sub: "Get Return within 30 days" },
            { icon: ShieldCheck, title: "Secure Payment", sub: "100% Secure Online Payment" },
            { icon: Star, title: "Best Quality", sub: "Original Product Guaranteed" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 text-white">
              <div className="p-2.5 bg-white/10 rounded-xl flex-shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black">{title}</p>
                <p className="text-xs text-white/70 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}