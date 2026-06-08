"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">My Wishlist</h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">
              {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          {wishlist.length > 0 && (
            <Link
              href="/"
              className="text-xs font-black text-pink-500 hover:text-pink-600 transition-colors flex items-center gap-1"
            >
              Continue shopping <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-24 gap-4">
            <div className="h-16 w-16 rounded-full bg-pink-50 flex items-center justify-center">
              <Heart className="h-8 w-8 text-pink-300 stroke-[1.5]" />
            </div>
            <p className="text-base font-black text-slate-500">Your wishlist is empty</p>
            <p className="text-sm text-slate-400 font-medium">Save items you love and come back to them anytime.</p>
            <Link
              href="/"
              className="mt-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-colors"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishlist.map((product) => {
              const savePct =
                product.originalPrice > product.discountPrice
                  ? Math.round(
                      ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
                    )
                  : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group"
                >
                  {/* Image */}
                  <Link href={`/products/${product.id}`} className="relative h-52 bg-[#FDF2F8]/60 flex-shrink-0 block overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {savePct > 0 && (
                      <span className="absolute top-3 left-3 bg-amber-400 text-white text-xs font-black px-2.5 py-1 rounded-full">
                        -{savePct}%
                      </span>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="p-4 flex flex-col flex-1">
                    <Link href={`/products/${product.id}`} className="block mb-1">
                      <h3 className="text-sm font-bold text-slate-800 hover:text-pink-500 transition-colors line-clamp-2 leading-snug">
                        {product.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mt-1 mb-4">
                      <span className="text-sm font-black text-pink-600">
                        ₹{product.discountPrice.toFixed(2)}
                      </span>
                      {savePct > 0 && (
                        <span className="text-xs text-slate-400 line-through font-medium">
                          ₹{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-auto">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.isAvailable}
                        className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-pink-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-wider py-2.5 rounded-xl transition-all active:scale-95"
                      >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {product.isAvailable ? "Add to Cart" : "Out of Stock"}
                      </button>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
