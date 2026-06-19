// components/common/Navbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Search, User, Heart, Menu, X, Loader2, LogOut, Package, Truck, HelpCircle, ChevronRight, LayoutGrid } from "lucide-react";
import { CartDrawer } from "@/components/cart/cartdrawer";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


export function Navbar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  // Fetch categories from API
  useEffect(() => {
    fetch(`${BASE_URL}/api/categories`)
      .then((r) => r.json())
      .then((data) => {
        const list = (data.categories || data || []).filter((c: any) => c.id !== "all");
        setCategories(list);
      })
      .catch(() => {});
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search — waits 300ms after user stops typing
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/products`);
        const data = await res.json();
        const all: any[] = data.products || [];

        // Filter client-side by title match
        const filtered = all.filter((p) =>
          p.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(productId: string) {
    setQuery("");
    setShowDropdown(false);
    setResults([]);
    router.push(`/products/${productId}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && query.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  }

  return (
    <header className="w-full border-b border-muted bg-white sticky top-0 z-50 shadow-sm">
      {/* Top Banner */}
      <div className="w-full bg-slate-900 text-white text-xs py-2 px-4 md:px-8 flex justify-between items-center font-medium">
        <div>✨ Welcome to Miniature Toys Marketplace! Free global shipping over $50</div>
        <div className="flex gap-4 opacity-80">
          <Link href="/track" className="hover:underline">Track Order</Link>
          <Link href="/help" className="hover:underline">Help Support</Link>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0 transition-transform active:scale-95">
          <div className="relative h-20 w-30">
            <Image
              src="/mt_logo_new.png"
              alt="Miniatures Toys Logo"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Search Box */}
        <div ref={searchRef} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search premium educational toys, plushies, puzzles..."
            className="w-full h-10 pl-4 pr-10 rounded-full border border-slate-200 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-all"
          />

          {/* Icon: loading / clear / search */}
          <div className="absolute right-3.5 top-2.5">
            {loading ? (
              <Loader2 className="h-5 w-5 text-pink-400 animate-spin" />
            ) : query ? (
              <button onClick={() => { setQuery(""); setResults([]); setShowDropdown(false); }}>
                <X className="h-5 w-5 text-slate-400 hover:text-pink-500 transition-colors" />
              </button>
            ) : (
              <Search className="h-5 w-5 text-muted-foreground pointer-events-none" />
            )}
          </div>

          {/* Dropdown Results */}
          {showDropdown && (
            <div className="absolute top-12 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-[420px] overflow-y-auto">
              {results.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-400 font-medium">
                  No products found for "{query}"
                </div>
              ) : (
                <>
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      {results.length} result{results.length !== 1 ? "s" : ""} found
                    </p>
                  </div>
                  {results.slice(0, 5).map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelect(product.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-pink-50 transition-colors text-left border-b border-slate-50 last:border-0 group"
                    >
                      {/* Product Image */}
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                        <Image
                          src={product.imageUrl}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 group-hover:text-pink-600 transition-colors line-clamp-1">
                          {product.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-pink-600">
                            ₹{product.discountPrice.toFixed(2)}
                          </span>
                          {product.originalPrice > product.discountPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                          {product.badge && (
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <Search className="h-3.5 w-3.5 text-slate-300 group-hover:text-pink-400 transition-colors flex-shrink-0" />
                    </button>
                  ))}
                  <Link
                    href={`/search?q=${encodeURIComponent(query.trim())}`}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center justify-center gap-1.5 px-4 py-3 text-xs font-black text-pink-500 hover:text-pink-600 hover:bg-pink-50 transition-colors border-t border-slate-100"
                  >
                    See all {results.length} results <Search className="h-3 w-3" />
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Auth user menu */}
          <div ref={userMenuRef} className="relative hidden sm:block">
            {isLoggedIn && user ? (
              <>
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="h-8 w-8 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-black text-xs flex items-center justify-center transition-colors shadow-sm shadow-pink-200"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-10 bg-white border border-slate-200 rounded-xl shadow-xl w-44 py-1.5 z-50">
                    <p className="px-4 py-2 text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-100 truncate">
                      {user.name}
                    </p>
                    <Link
                      href="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Package className="h-4 w-4" /> My Account
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); router.push("/"); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link href="/auth/login" className="p-2 text-slate-700 hover:text-pink-600 transition-colors flex">
                <User className="h-5 w-5" />
              </Link>
            )}
          </div>
          <Link href="/wishlist" className="p-2 text-slate-700 hover:text-pink-600 transition-colors relative hidden sm:block">
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm">
                {wishlistCount}
              </span>
            )}
          </Link>
          <CartDrawer />
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 text-slate-700 hover:text-pink-600 transition-colors md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[80vw] max-w-[320px] bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="relative h-10 w-28">
            <Image src="/mt_logo_new.png" alt="Miniature Toys" fill className="object-contain object-left" />
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Auth section */}
          <div className="px-5 py-4 border-b border-slate-100">
            {isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-pink-500 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm shadow-pink-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400 font-medium truncate">{user.email}</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login" className="flex-1 text-center py-2.5 bg-pink-500 hover:bg-pink-600 text-white text-sm font-black rounded-xl transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/register" className="flex-1 text-center py-2.5 border border-slate-200 hover:border-pink-300 text-slate-700 text-sm font-black rounded-xl transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="px-5 py-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <LayoutGrid className="h-3.5 w-3.5" /> Shop by Category
            </p>
            <div className="space-y-0.5">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  {cat.label}
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-5 border-t border-slate-100" />

          {/* Account links */}
          <div className="px-5 py-3 space-y-0.5">
            {isLoggedIn && (
              <Link href="/account" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                <Package className="h-4 w-4 text-slate-400" /> My Orders
              </Link>
            )}
            <Link href="/wishlist" className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
              <span className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-slate-400" /> Wishlist
              </span>
              {wishlistCount > 0 && (
                <span className="h-5 min-w-5 px-1 rounded-full bg-pink-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>

          <div className="mx-5 border-t border-slate-100" />

          {/* Help links */}
          <div className="px-5 py-3 space-y-0.5">
            <Link href="/track" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
              <Truck className="h-4 w-4 text-slate-400" /> Track Order
            </Link>
            <Link href="/help" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-pink-50 hover:text-pink-600 transition-colors">
              <HelpCircle className="h-4 w-4 text-slate-400" /> Help & Support
            </Link>
          </div>
        </div>

        {/* Drawer footer — sign out */}
        {isLoggedIn && (
          <div className="px-5 py-4 border-t border-slate-100">
            <button
              onClick={() => { logout(); router.push("/"); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Sub-Category Bar */}
      {categories.length > 0 && (
        <div className="border-t border-muted bg-slate-50/80 hidden md:block">
          <div className="max-w-7xl mx-auto px-8 h-11 flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="hover:text-pink-500 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
            <span className="ml-auto text-pink-600 font-extrabold animate-pulse">🔥 Flash Sale: 70% Off!</span>
          </div>
        </div>
      )}
    </header>
  );
}