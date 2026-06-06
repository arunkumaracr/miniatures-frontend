// components/cart-drawer.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "../../lib/cart-context";
import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";

export function CartDrawer() {
  const { cart, removeFromCart, cartCount, clearCart } = useCart();

  // 🎯 FIX 1: Use item.product.discountPrice instead of price
  const subtotal = cart.reduce((acc, item) => acc + item.product.discountPrice * item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 text-slate-700 hover:text-pink-600 transition-colors">
          <ShoppingBag className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm animate-in zoom-in-50 duration-200">
              {cartCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-white border-l border-muted p-0">
        <SheetHeader className="p-4 border-b border-muted">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <ShoppingBag className="h-5 w-5 text-pink-500" /> Your Toy Basket ({cartCount})
          </SheetTitle>
        </SheetHeader>

        {/* Dynamic Card Rows */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-2">
              <ShoppingBag className="h-12 w-12 text-muted-foreground stroke-[1.5]" />
              <p className="text-sm font-medium text-slate-500">Your basket is completely empty.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex items-center gap-4 border border-muted p-3 rounded-md bg-slate-50/50">
                <div className="relative h-16 w-16 bg-white border border-muted rounded overflow-hidden flex-shrink-0">
                  {/* 🎯 FIX 2: Use item.product.imageUrl and item.product.title directly */}
                  <Image 
                    src={item.product.imageUrl} 
                    alt={item.product.title} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 truncate">{item.product.title}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                  {/* 🎯 FIX 3: Calculate using discountPrice */}
                  <p className="text-sm font-black text-pink-600 mt-1">${(item.product.discountPrice * item.quantity).toFixed(2)}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Summary Sticky Footer */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-muted bg-slate-50 space-y-4">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-slate-600">Subtotal Amount:</span>
              <span className="text-xl font-black text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold rounded">
                Proceed To Checkout
              </Button>
              <button 
                onClick={clearCart}
                className="text-xs text-muted-foreground hover:text-slate-800 underline transition-colors py-1"
              >
                Clear all toys from basket
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}