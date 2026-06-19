import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Search, Home, LayoutGrid } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50/40 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center py-32 text-center">
          {/* Big 404 */}
          <div className="relative mb-6 select-none">
            <span className="text-[120px] sm:text-[160px] font-black text-slate-100 leading-none tracking-tighter">
              404
            </span>
            <span className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-black text-slate-800 tracking-tight">
              Page Not Found
            </span>
          </div>

          <p className="text-slate-500 font-medium text-sm sm:text-base max-w-md mb-10">
            The page you're looking for has been moved, deleted, or never existed.
            Let's get you back to the good stuff.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 h-11 px-6 rounded-full bg-[#A21CAF] hover:bg-pink-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <Home className="h-4 w-4" /> Back to Home
            </Link>
            <Link
              href="/categories/all"
              className="flex items-center gap-2 h-11 px-6 rounded-full border border-slate-200 bg-white hover:border-pink-300 text-slate-700 font-black text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              <LayoutGrid className="h-4 w-4" /> Browse Products
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-2 h-11 px-6 rounded-full border border-slate-200 bg-white hover:border-pink-300 text-slate-700 font-black text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95"
            >
              <Search className="h-4 w-4" /> Search
            </Link>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
