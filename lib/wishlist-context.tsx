"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ToyProduct } from "@/types/store";

interface WishlistContextType {
  wishlist: ToyProduct[];
  addToWishlist: (product: ToyProduct) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (product: ToyProduct) => void;
  isWishlisted: (productId: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<ToyProduct[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("toy_store_wishlist");
    if (saved) {
      try { setWishlist(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("toy_store_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  function addToWishlist(product: ToyProduct) {
    setWishlist((prev) =>
      prev.find((p) => p.id === product.id) ? prev : [...prev, product]
    );
  }

  function removeFromWishlist(productId: string) {
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
  }

  function toggleWishlist(product: ToyProduct) {
    setWishlist((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  }

  function isWishlisted(productId: string) {
    return wishlist.some((p) => p.id === productId);
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted, wishlistCount: wishlist.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
}
