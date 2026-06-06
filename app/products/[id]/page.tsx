// app/products/[id]/page.tsx
"use client";

import { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { useCart } from "@/lib/cart-context";
import { ToyProduct } from "@/types/store";
import { TopSelling } from "@/components/top-selling";
import { Star, Heart, Plus, Minus, ChevronRight, ShoppingCart } from "lucide-react";
import STORE_DATA from "@/lib/products-top.json";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  // Un-wrap dynamic routing parameters using React.use()
  const resolvedParams = use(params);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();

  // Find product inside standard catalog list OR topSelling list arrays cleanly
  const allProducts = [
    ...(STORE_DATA.products || []),
    ...(STORE_DATA.topSelling || [])
  ] as ToyProduct[];

  const product = allProducts.find((p) => p.id === resolvedParams.id);

  // Guard routing frame safely if id doesn't map to anything
  if (!product) {
    notFound();
  }

  // Calculate percentage markdown if item is on sale matching image_3aad0c.jpg orange badge
  const discountPercent = product.originalPrice > product.discountPrice
    ? Math.round(((product.originalPrice - product.discountPrice) / product.originalPrice) * 180)
    : 0;

  const handleQuantityIncrement = () => setQuantity((q) => q + 1);
  const handleQuantityDecrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleAddToCartWithQty = () => {
    // Dispatch selected units iteratively straight into the context matrix
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Navbar />

        {/* 🗺️ BREADCRUMB TRAIL: Matches layout exactly from image_3aad0c.jpg */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 tracking-wide uppercase">
            <Link href="/" className="hover:text-pink-500 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3 text-slate-400 stroke-[2.5]" />
            <Link href="/" className="hover:text-pink-500 transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3 text-slate-400 stroke-[2.5]" />
            <span className="text-slate-800 font-black truncate max-w-[200px]">Product Details</span>
          </div>
        </nav>

        {/* 🏗️ MAIN PRODUCT VIEW DISPLAY CORE */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
            
            {/* 📸 LEFT ZONE: Main Presentation Window with Curved Yellow Discount Circle Badge */}
            <div className="md:col-span-6 w-full relative aspect-square bg-[#FDF2F8]/40 border border-slate-100 rounded-2xl overflow-hidden p-6 flex items-center justify-center group">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                priority
                className="object-cover p-0 transition-transform duration-500 group-hover:scale-102"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {discountPercent > 0 && (
                <div className="absolute top-6 left-6 h-16 w-16 bg-[#FFBB38] rounded-full flex flex-col items-center justify-center shadow shadow-amber-500/20 animate-bounce-slow">
                  <span className="text-xs font-black text-slate-900">-{discountPercent}%</span>
                </div>
              )}
            </div>

            {/* 📝 RIGHT ZONE: Metadata Detail Matrix */}
            <div className="md:col-span-6 text-left space-y-4 sm:space-y-5">
              
              {/* Category Breadcrumb Tag */}
              <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                🎯 TOY PARIVERSE / {product.categoryId}
              </div>

              {/* Title Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Stars & Reviews */}
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex text-amber-400 items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star 
                      key={idx} 
                      className={`h-4 w-4 ${idx < Math.floor(product.rating) ? 'fill-current' : 'opacity-25'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-400">
                  {product.reviewCount} Verified Reviews
                </span>
              </div>

              {/* Pricing Blocks */}
              <div className="flex items-baseline gap-3 pt-1">
                {product.originalPrice > product.discountPrice && (
                  <span className="text-base sm:text-lg text-slate-400 line-through font-bold">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-2xl sm:text-3xl font-black text-pink-600">
                  ${product.discountPrice.toFixed(2)}
                </span>
              </div>

              {/* Marketing Narrative Copy Paragraph */}
              <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xl">
                Encourage developmental growth, critical reasoning, and hours of immersive adventure with this authentic product collection selection layout item built for creative play.
              </p>

              {/* 🏷️ Availability Indicator Pill Box */}
              <div className="w-fit bg-[#FDF2F8] text-pink-700 rounded-md px-4 py-2.5 text-xs font-extrabold border border-pink-100/30 flex items-center gap-1.5 shadow-sm">
                Availability:{" "}
                <span className="text-purple-700 uppercase tracking-wide">
                  {product.isAvailable ? "✔ 132 Products Available In Stock" : "❌ Temporarily Out Of Stock"}
                </span>
              </div>

              {/* Interactive Multi-Select Dropdown Container */}
              <div className="space-y-1.5 max-w-sm">
                <label className="text-xs font-black text-slate-500 uppercase tracking-wider block">Variants / Size</label>
                <select className="w-full border border-slate-200 rounded-lg p-3 text-xs font-bold text-slate-700 bg-white focus:outline-none focus:border-pink-400 cursor-pointer shadow-sm">
                  <option>Standard Pack Edition</option>
                  <option>Deluxe Collector Set bundle</option>
                  <option>Premium Gift Box wrapping wrap</option>
                </select>
              </div>

              {/* 🛠️ ACTION SUBSECTION: Quantity Adjusters, Wishlist Toggles & Cart Hooks */}
              <div className="flex flex-wrap items-center gap-3 pt-3">
                
                {/* Quantity Control Panel Block */}
                <div className="flex items-center border border-slate-200 rounded-lg h-12 overflow-hidden bg-white shadow-sm">
                  <button 
                    onClick={handleQuantityDecrement}
                    className="px-3.5 h-full hover:bg-slate-50 text-slate-500 transition-colors active:scale-95"
                  >
                    <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                  <span className="w-10 text-center text-xs font-black text-slate-800 select-none">
                    {quantity}
                  </span>
                  <button 
                    onClick={handleQuantityIncrement}
                    className="px-3.5 h-full hover:bg-slate-50 text-slate-500 transition-colors active:scale-95"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Wishlist Hook Toggle */}
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`h-12 w-12 border border-slate-200 rounded-lg flex items-center justify-center transition-all shadow-sm ${
                    isWishlisted 
                      ? "bg-pink-50 border-pink-200 text-pink-500" 
                      : "bg-white text-slate-600 hover:text-pink-500 hover:border-slate-300"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                </button>

                {/* Main Add To Cart Action Trigger */}
                <button
                  disabled={!product.isAvailable}
                  onClick={handleAddToCartWithQty}
                  className="flex-1 md:flex-none h-12 min-w-[200px] flex items-center justify-center gap-2 rounded-full bg-[#A21CAF] hover:bg-pink-600 active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider px-8 transition-all duration-150 shadow-md disabled:bg-slate-200 disabled:text-slate-400"
                >
                  <Plus className="h-4 w-4 stroke-[3]" /> Add to Cart
                </button>

              </div>

              {/* Meta Categories Tags Hailline block footer lists */}
              <div className="border-t border-slate-100 pt-5 space-y-2 text-xs font-bold text-slate-400">
                <div>Category : <span className="text-pink-600 hover:underline cursor-pointer ml-1">{product.categoryId} Marketplace</span></div>
                <div>Tags : <span className="text-purple-600 hover:underline cursor-pointer ml-1">Premium, Safe, KidApproved</span></div>
              </div>

            </div>

          </div>
        </main>

        <TopSelling />
      </div>

      <Footer />
    </div>
  );
}