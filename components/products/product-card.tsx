// components/product-card.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ToyProduct } from "../../types/store";
import { useCart } from "../../lib/cart-context";
import { useWishlist } from "../../lib/wishlist-context";
import { Star, Maximize2, Heart, RefreshCw, Check } from "lucide-react";

export function ProductCard({ product }: { product: ToyProduct }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  const [quickAdded, setQuickAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    setQuickAdded(true);
    setTimeout(() => setQuickAdded(false), 1200);
  };

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white hover:border-brand-500/30 hover:shadow-lg transition-all duration-300 flex flex-col h-[400px] relative group p-4 text-left">
      
      {/* 📸 TOP SECTION: Explicitly locked height window to prevent bottom crowding */}
      <div className="relative w-full h-[230px] bg-[#fef3ec]/60 rounded-xl overflow-hidden flex-shrink-0 mb-3">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-102"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* 🎯 HOVER ACCENTS PANEL */}
        <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 z-10">
          {/* Expand → product detail page */}
          <button
            onClick={() => router.push(`/products/${product.id}`)}
            className="h-9 w-9 bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-brand-500 hover:scale-110 shadow transform translate-y-3 group-hover:translate-y-0 transition-all duration-300"
            title="View product"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          {/* Heart → wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            className="h-9 w-9 bg-white rounded-full flex items-center justify-center hover:scale-110 shadow transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-[40ms]"
            title="Add to wishlist"
          >
            <Heart className={`h-4 w-4 transition-colors ${wishlisted ? "fill-brand-500 text-brand-500" : "text-slate-700 hover:text-brand-500"}`} />
          </button>
          {/* Quick-add → add to cart with tick feedback */}
          <button
            onClick={handleQuickAdd}
            className={`h-9 w-9 bg-white rounded-full flex items-center justify-center hover:scale-110 shadow transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-[80ms] ${quickAdded ? "text-green-500" : "text-slate-700 hover:text-brand-500"}`}
            title="Quick add to cart"
          >
            {quickAdded ? <Check className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* 📝 BOTTOM SECTION: Secure and fully spaced metadata area */}
      <div className="flex-1 flex flex-col justify-between w-full pb-8">
        <div className="space-y-1.5">
          
          {/* 5-Star Cluster */}
          <div className="flex text-amber-400 items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star 
                key={idx} 
                className="h-3.5 w-3.5 fill-current text-amber-400" 
              />
            ))}
          </div>

          {/* Product Title Link Header */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="text-sm font-extrabold text-slate-900 hover:text-brand-500 transition-colors tracking-tight leading-snug line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {/* Pricing Row */}
          <div className="flex items-center gap-2 pt-0.5">
            {product.originalPrice > product.discountPrice && (
              <span className="text-xs text-slate-400 line-through font-bold">
                ₹{product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-sm font-black text-brand-600">
              ₹{product.discountPrice.toFixed(2)}
            </span>
          </div>

        </div>
      </div>

      {/* 🛒 BOTTOM RIGHT CORNER: Curved Action Ribbon Button */}
      <button
        onClick={() => addToCart(product)}
        className="absolute bottom-0 right-0 bg-[#fff5ee] text-[#9a3412] hover:bg-brand-500 hover:text-white text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-tl-2xl transition-all duration-200 active:scale-95 z-20"
      >
        Add To Cart
      </button>

    </Card>
  );
}