// components/promo-banners.tsx
"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      {/* 2-Column Responsive Grid System */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Banner 1: Left Orange Gradient Block */}
        <div className="relative rounded-md overflow-hidden bg-gradient-to-r from-[#FFEAD2] to-[#FFF8F0] min-h-[260px] sm:min-h-[290px] p-6 sm:p-8 flex items-center group border border-amber-100">
          <div className="w-1/2 z-10 space-y-3 sm:space-y-4 text-left">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
              NEW COLLECTION
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Get 65% Offer <br />& Make Kids <br />Creative.
            </h3>
            <button className="flex items-center gap-1.5 rounded-full bg-[#FFBB38] hover:bg-[#e0a22e] text-slate-900 font-extrabold text-xs px-5 py-3 transition-all duration-200 shadow-sm active:scale-95">
              Shop Now <ChevronRight className="h-4 w-4 stroke-[3]" />
            </button>
          </div>
          
          {/* Banner 1 Transparent Cutout Image */}
          <div className="absolute right-0 bottom-0 top-4 w-1/2 h-[95%] transition-transform duration-500 group-hover:scale-103">
            <Image
              src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=500" // Happy kids celebrating
              alt="Creative Toys Collection Promo"
              fill
              className="object-cover object-center rounded-tl-full"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>

        {/* Banner 2: Right Pink Pastel Block */}
        <div className="relative rounded-md overflow-hidden bg-[#FBCFE8]/40 min-h-[260px] sm:min-h-[290px] p-6 sm:p-8 flex items-center group border border-brand-100">
          <div className="w-1/2 z-10 space-y-3 sm:space-y-4 text-left">
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-600">
              MEGA OFFER
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight">
              Build Imaginations <br />with Our Soft <br />Plushies.
            </h3>
            <button className="flex items-center gap-1.5 rounded-full bg-[#e8884f] hover:bg-[#d4703a] text-white font-extrabold text-xs px-5 py-3 transition-all duration-200 shadow-sm active:scale-95">
              Shop Now <ChevronRight className="h-4 w-4 stroke-[3]" />
            </button>
          </div>
          
          {/* Banner 2 Transparent Cutout Image */}
          <div className="absolute right-0 bottom-0 top-4 w-1/2 h-[95%] transition-transform duration-500 group-hover:scale-103">
            <Image
              src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=500" // Fun bright playroom setting
              alt="Plush Toys Collection Promo"
              fill
              className="object-cover object-center rounded-tl-full"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>

      </div>
    </section>
  );
}