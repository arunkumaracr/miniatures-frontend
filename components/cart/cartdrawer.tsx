"use client";

import { useState } from "react";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "../../lib/cart-context";
import { useAuth } from "../../lib/auth-context";
import { ShoppingBag, X, Plus, Minus, ShieldCheck, RotateCcw, ThumbsUp, Award, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TRUST_BADGES = [
  { icon: ShieldCheck, label: "100% Secure\nPayments" },
  { icon: RotateCcw, label: "Easy Returns\n& Exchanges" },
  { icon: ThumbsUp, label: "Trusted By\n2 Lac+ Customers" },
  { icon: Award, label: "Quality\nAssured" },
];

export function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, cartCount } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [orderNote, setOrderNote] = useState("");

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.discountPrice * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative p-2 text-slate-700 hover:text-brand-600 transition-colors">
          <ShoppingBag className="h-6 w-6" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white shadow-sm animate-in zoom-in-50 duration-200">
              {cartCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent showCloseButton={false} className="w-full sm:max-w-[420px] flex flex-col bg-white p-0 border-l border-slate-200">
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between px-5 py-4 border-b border-slate-200">
          <SheetTitle className="text-xl font-black text-slate-900 tracking-tight">
            Cart
          </SheetTitle>
          <SheetClose className="p-1 rounded-full hover:bg-slate-100 transition-colors text-slate-500 hover:text-slate-800">
            <X className="h-5 w-5" />
          </SheetClose>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 px-6 text-center">
              <ShoppingBag className="h-12 w-12 text-slate-300 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-400">Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="divide-y divide-slate-100">
                {cart.map((item) => {
                  const savePct =
                    item.product.originalPrice > item.product.discountPrice
                      ? Math.round(
                          ((item.product.originalPrice - item.product.discountPrice) /
                            item.product.originalPrice) *
                            100
                        )
                      : 0;

                  return (
                    <div key={item.product.id} className="p-5 flex gap-4">
                      {/* Image */}
                      <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
                            {item.product.title}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="flex-shrink-0 p-0.5 text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Price row */}
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-sm font-black text-slate-900">
                            ₹{item.product.discountPrice.toFixed(2)}
                          </span>
                          {savePct > 0 && (
                            <>
                              <span className="text-xs text-slate-400 line-through font-medium">
                                MRP: ₹{item.product.originalPrice.toFixed(2)}
                              </span>
                              <span className="text-xs font-black text-green-600">
                                Save {savePct}%
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                          Inclusive of all taxes
                        </p>

                        {/* Qty stepper */}
                        <div className="flex items-center border border-slate-300 rounded w-fit mt-3 overflow-hidden">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                          <span className="h-8 w-9 flex items-center justify-center text-sm font-black text-slate-800 border-x border-slate-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="h-8 w-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Note */}
              <div className="px-5 pt-2 pb-4 border-t border-slate-100">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                  Order Note
                </p>
                <textarea
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note for your order..."
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-slate-400 resize-none"
                />
              </div>

              {/* Trust Badges */}
              <div className="px-5 py-4 border-t border-slate-100 grid grid-cols-4 gap-2">
                {TRUST_BADGES.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1.5">
                    <div className="h-10 w-10 rounded-full border border-slate-200 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-slate-600 stroke-[1.5]" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 leading-tight whitespace-pre-line">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sticky Footer */}
        {cart.length > 0 && (
          <div className="border-t border-slate-200 px-5 pt-4 pb-5 space-y-3 bg-white">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Subtotal
              </span>
              <span className="text-xl font-black text-slate-900">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium -mt-1">
              Shipping and discount codes calculated at checkout.
            </p>
            <SheetClose asChild>
              <button
                onClick={() =>
                  router.push(isLoggedIn ? "/checkout" : "/auth/login?redirect=/checkout")
                }
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-[#C0392B] hover:bg-[#a93226] text-white font-black text-sm uppercase tracking-widest rounded transition-colors"
              >
                <span>Checkout</span>
                <div className="flex items-center gap-1 opacity-80">
                  <span className="text-[10px] bg-white/20 rounded px-1 py-0.5 font-bold">G Pay</span>
                  <span className="text-[10px] bg-white/20 rounded px-1 py-0.5 font-bold">UPI</span>
                  <span className="text-[10px] bg-white/20 rounded px-1 py-0.5 font-bold">COD</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
