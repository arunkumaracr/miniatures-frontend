// components/navbar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, User, Heart, Menu } from "lucide-react";
import { CartDrawer } from "@/components/cart/cartdrawer";

export function Navbar() {
  return (
    <header className="w-full border-b border-muted bg-white sticky top-0 z-50 shadow-sm">
      {/* Top micro utilities banner matching references */}
      <div className="w-full bg-slate-900 text-white text-xs py-2 px-4 md:px-8 flex justify-between items-center font-medium">
        <div>✨ Welcome to Miniature Toys Marketplace! Free global shipping over $50</div>
        <div className="flex gap-4 opacity-80">
          <Link href="/track" className="hover:underline">Track Order</Link>
          <Link href="/help" className="hover:underline">Help Support</Link>
        </div>
      </div>

      {/* Main Core Navigation Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo Element */}
        {/* Logo Element */}
        <Link href="/" className="flex items-center flex-shrink-0 transition-transform active:scale-95">
          <div className="relative h-20 w-30"> {/* Adjust h-12 (height) and w-36 (width) to perfectly match your logo's dimensions */}
            <Image
              src="/mt_logo_new.png"
              alt="Shopus Toys Logo"
              fill
              priority // Forces the browser to load the logo immediately without lazy-loading
              className="object-contain object-left" // Prevents the logo from stretching or distorting
            />
          </div>
        </Link>

        {/* Structural Search Wrapper Container */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search premium educational toys, plushies, puzzles..."
            className="w-full h-10 pl-4 pr-10 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all"
          />
          <Search className="absolute right-3.5 top-2.5 h-5 w-5 text-muted-foreground pointer-events-none" />
        </div>

        {/* Interactive Utility Trigger Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          <button className="p-2 text-slate-700 hover:text-pink-600 transition-colors hidden sm:block">
            <User className="h-5 w-5" />
          </button>
          <button className="p-2 text-slate-700 hover:text-pink-600 transition-colors relative hidden sm:block">
            <Heart className="h-5 w-5" />
          </button>

          {/* Active Cart Slide Trigger Component hook */}
          <CartDrawer />

          <button className="p-2 text-slate-700 hover:text-pink-600 transition-colors md:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Sub-Category Bar row layer matching layout mockup */}
      <div className="border-t border-muted bg-slate-50/80 hidden md:block">
        <div className="max-w-7xl mx-auto px-8 h-11 flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
          <Link href="/categories/wooden" className="hover:text-pink-500 transition-colors">Wooden Blocks</Link>
          <Link href="/categories/plush" className="hover:text-pink-500 transition-colors">Soft Plushies</Link>
          <Link href="/categories/educational" className="hover:text-pink-500 transition-colors">Montessori Learning</Link>
          <Link href="/categories/puzzles" className="hover:text-pink-500 transition-colors">Puzzles & Strategy</Link>
          <span className="ml-auto text-pink-600 font-extrabold animate-pulse">🔥 Flash Sale: 70% Off!</span>
        </div>
      </div>
    </header>
  );
}