// components/product-card-horizontal.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ToyProduct } from "../../types/store";
import { useCart } from "../../lib/cart-context";
import { useWishlist } from "../../lib/wishlist-context";
import { Star, Maximize2, Heart, RefreshCw } from "lucide-react";

export function ProductCardHorizontal({ product }: { product: ToyProduct }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-100 bg-white hover:border-brand-500/30 hover:shadow-lg transition-all duration-300 grid grid-cols-12 h-[190px] relative group p-4 w-full">
      
      {/* 📸 LEFT SIDE: Image occupies exactly 5 out of 12 columns */}
      <div className="col-span-5 relative h-full w-full bg-[#fef3ec]/60 rounded-xl overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 150px, 200px"
        />

        {/* HOVER ACTION BUTTONS */}
        <div className="absolute inset-0 bg-brand-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-1.5 z-10">
          <button className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-brand-500 hover:scale-110 shadow transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
            className="h-8 w-8 bg-white rounded-full flex items-center justify-center hover:scale-110 shadow transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-[40ms]"
          >
            <Heart className={`h-3.5 w-3.5 transition-colors ${wishlisted ? "fill-brand-500 text-brand-500" : "text-slate-700 hover:text-brand-500"}`} />
          </button>
          <button className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-brand-500 hover:scale-110 shadow transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 delay-[80ms]">
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 📝 RIGHT SIDE: Text and info occupies exactly 7 out of 12 columns */}
      <div className="col-span-7 flex flex-col justify-center pl-4 h-full text-left">
        <div className="space-y-1.5 pb-4">
          
          {/* ⭐ 5 Star Ratings */}
          <div className="flex text-amber-400 items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star 
                key={idx} 
                className="h-4 w-4 fill-current text-amber-400" 
              />
            ))}
          </div>

          {/* 🏷️ Product Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="text-base font-extrabold text-slate-900 hover:text-brand-500 transition-colors tracking-tight leading-tight line-clamp-2">
              {product.title}
            </h3>
          </Link>

          {/* 💰 Price Matrix */}
          <div className="flex items-center gap-2 pt-1">
            {product.originalPrice > product.discountPrice && (
              <span className="text-sm text-slate-400 line-through font-bold">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-base font-black text-brand-600">
              ${product.discountPrice.toFixed(2)}
            </span>
          </div>

        </div>
      </div>

      {/* 🛒 BOTTOM RIGHT: Add to Cart Action Button */}
      <button
        onClick={() => addToCart(product)}
        className="absolute bottom-0 right-0 bg-[#fff5ee] text-[#9a3412] hover:bg-brand-500 hover:text-white text-xs font-black uppercase tracking-wider py-3.5 px-6 rounded-tl-2xl transition-all duration-200 active:scale-95 z-20"
      >
        Add To Cart
      </button>

    </Card>
  );
}