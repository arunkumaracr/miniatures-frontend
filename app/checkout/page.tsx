"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Navbar } from "@/components/common/Navbar";
import { ChevronLeft, MapPin, CreditCard, Truck, ShieldCheck, Plus, Minus } from "lucide-react";
import type { PaymentMethod, ShippingAddress } from "@/types/store";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open(): void;
      on(event: string, handler: () => void): void;
    };
  }
}

const SHIPPING_THRESHOLD = 1999;
const SHIPPING_COST = 49;
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface CheckoutForm extends ShippingAddress {
  paymentMethod: PaymentMethod;
}

type FormErrors = Partial<Record<keyof CheckoutForm, string>>;

function inputCls(hasError?: boolean) {
  return `w-full border ${
    hasError ? "border-red-400 focus:ring-red-400" : "border-slate-200 focus:ring-brand-400"
  } rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all bg-white`;
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-black text-slate-600 uppercase tracking-wider">
        {label} {required && <span className="text-brand-500">*</span>}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="text-xs text-red-500 font-semibold mt-1">{error}</p>}
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, updateQuantity, clearCart, cartCount } = useCart();
  const { user, token, isLoggedIn } = useAuth();
  const router = useRouter();
  const orderPlaced = useRef(false);
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [rzpReady, setRzpReady] = useState(false);

  const [form, setForm] = useState<CheckoutForm>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    paymentMethod: "razorpay",
  });

  // Load Razorpay checkout script once, track when ready
  useEffect(() => {
    if (document.getElementById("razorpay-script")) {
      if (window.Razorpay) setRzpReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRzpReady(true);
    script.onerror = () => console.error("Razorpay script failed to load");
    document.body.appendChild(script);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/auth/login?redirect=/checkout");
    }
  }, [isLoggedIn, router]);

  // Pre-fill name and email from logged-in user
  useEffect(() => {
    if (user) {
      const [firstName = "", ...rest] = user.name.trim().split(" ");
      setForm((prev) => ({
        ...prev,
        email: prev.email || user.email,
        firstName: prev.firstName || firstName,
        lastName: prev.lastName || rest.join(" "),
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cart.length === 0 && !orderPlaced.current) router.replace("/");
  }, [cart.length, router]);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.discountPrice * item.quantity,
    0
  );
  const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shippingCost;

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 7)
      e.phone = "Valid phone required";
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.address1.trim()) e.address1 = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.state.trim()) e.state = "Required";
    if (!form.postalCode.trim()) e.postalCode = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function placeOrderRecord(paymentId?: string) {
    const payload = {
      customerName: `${form.firstName} ${form.lastName}`.trim(),
      customerEmail: form.email,
      customerPhone: form.phone,
      address: [
        form.address1,
        form.address2,
        `${form.city}, ${form.state} ${form.postalCode}`,
        form.country,
      ]
        .filter(Boolean)
        .join(", "),
      paymentId: paymentId || null,
      paymentMethod: form.paymentMethod,
      items: cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.discountPrice,
      })),
    };
    try {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return data.order?.id || data.id || `MT-${Date.now()}`;
    } catch {
      return `MT-${Date.now()}`;
    }
  }

  async function handlePlaceOrder() {
    if (!validate()) return;

    if (form.paymentMethod === "razorpay") {
      if (!rzpReady || !window.Razorpay) {
        alert("Payment gateway is still loading. Please wait a moment and try again.");
        return;
      }
      setPlacing(true);
      try {
        // Step 1: create Razorpay order on backend
        const orderRes = await fetch(`${BASE_URL}/api/payment/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: Math.round(total * 100) }),
        });
        if (!orderRes.ok) {
          const err = await orderRes.json().catch(() => ({}));
          throw new Error(err.error || "Failed to create payment order");
        }
        const { order_id, amount: rzpAmount, currency } = await orderRes.json();

        // Step 2: open Razorpay modal
        const rzpKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "rzp_test_T8I5Cv89GPtU6E";
        const rzp = new window.Razorpay({
          key: rzpKey,
          amount: rzpAmount,
          currency,
          order_id,
          name: "Miniature Toys",
          description: "Miniature Collectibles Order",
          image: "/mt_logo_new.png",
          prefill: {
            name: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            contact: form.phone,
          },
          theme: { color: "#e8884f" },
          method: {
            upi: true,
            card: true,
            netbanking: true,
            wallet: true,
            paylater: true,
          },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              // Step 3: verify signature
              const verifyRes = await fetch(`${BASE_URL}/api/payment/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              });
              const verified = await verifyRes.json();
              if (!verified.verified) throw new Error("Payment verification failed");

              // Step 4: save order record
              const orderId = await placeOrderRecord(response.razorpay_payment_id);
              orderPlaced.current = true;
              clearCart();
              router.push(`/checkout/success?orderId=${orderId}`);
            } catch {
              alert("Payment was received but order confirmation failed. Please contact support.");
              setPlacing(false);
            }
          },
          modal: {
            ondismiss: () => {
              setPlacing(false);
            },
          },
        });
        rzp.open();
      } catch (err) {
        console.error("Razorpay init error:", err);
        alert(`Could not initiate payment: ${(err as Error).message || "Unknown error"}. Check that the backend is running on port 5000.`);
        setPlacing(false);
      }
      return;
    }

    // COD fallback (currently disabled in UI but kept for safety)
    setPlacing(true);
    const orderId = await placeOrderRecord();
    orderPlaced.current = true;
    clearCart();
    router.push(`/checkout/success?orderId=${orderId}`);
    setPlacing(false);
  }

  if (cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-slate-50/60">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-brand-500 transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4 stroke-[2.5]" /> Continue Shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── LEFT: FORM ── */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Contact */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-brand-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  1
                </span>
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Email Address" error={errors.email} required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputCls(!!errors.email)}
                    placeholder="you@example.com"
                  />
                </Field>
                <Field label="Phone Number" error={errors.phone} required>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputCls(!!errors.phone)}
                    placeholder="+91 98765 43210"
                  />
                </Field>
              </div>
            </section>

            {/* 2. Shipping Address */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-brand-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  2
                </span>
                Shipping Address
                <MapPin className="h-4 w-4 text-slate-400 ml-auto" />
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="First Name" error={errors.firstName} required>
                  <input
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className={inputCls(!!errors.firstName)}
                    placeholder="First name"
                  />
                </Field>
                <Field label="Last Name" error={errors.lastName} required>
                  <input
                    value={form.lastName}
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className={inputCls(!!errors.lastName)}
                    placeholder="Last name"
                  />
                </Field>
              </div>
              <Field label="Address Line 1" error={errors.address1} required>
                <input
                  value={form.address1}
                  onChange={(e) => setForm({ ...form, address1: e.target.value })}
                  className={inputCls(!!errors.address1)}
                  placeholder="Street address, apartment, suite, etc."
                />
              </Field>
              <Field label="Address Line 2 (Optional)">
                <input
                  value={form.address2}
                  onChange={(e) => setForm({ ...form, address2: e.target.value })}
                  className={inputCls()}
                  placeholder="Landmark, area"
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="City" error={errors.city} required>
                  <input
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={inputCls(!!errors.city)}
                    placeholder="Chennai"
                  />
                </Field>
                <Field label="State / Province" error={errors.state} required>
                  <input
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className={inputCls(!!errors.state)}
                    placeholder="Tamil Nadu"
                  />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Postal Code" error={errors.postalCode} required>
                  <input
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                    className={inputCls(!!errors.postalCode)}
                    placeholder="600001"
                  />
                </Field>
                <Field label="Country">
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className={inputCls()}
                  >
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                    <option>Australia</option>
                    <option>Singapore</option>
                    <option>UAE</option>
                  </select>
                </Field>
              </div>
            </section>

            {/* 3. Payment */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-brand-500 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
                  3
                </span>
                Payment Method
                <CreditCard className="h-4 w-4 text-slate-400 ml-auto" />
              </h2>
              <div className="space-y-3">
                {/* Razorpay — UPI / Cards / Netbanking */}
                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  form.paymentMethod === "razorpay"
                    ? "border-brand-400 bg-brand-50/30"
                    : "border-slate-200 hover:border-slate-300"
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={form.paymentMethod === "razorpay"}
                    onChange={() => setForm({ ...form, paymentMethod: "razorpay" })}
                    className="accent-brand-500 w-4 h-4"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-lg flex-shrink-0">
                      💳
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">Pay Online</p>
                      <p className="text-xs text-slate-400 font-medium">UPI · Cards · Netbanking · Wallets</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 flex-shrink-0">
                    Secure
                  </span>
                </label>

                {/* COD — unavailable */}
                <label className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-not-allowed opacity-50 border-slate-200 bg-slate-50">
                  <input type="radio" name="payment" value="cod" disabled className="w-4 h-4" />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-lg flex-shrink-0">
                      💵
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-600">Cash on Delivery</p>
                      <p className="text-xs text-slate-400 font-medium">Pay when your order arrives</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full flex-shrink-0">
                    Not Available
                  </span>
                </label>
              </div>
            </section>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-8 py-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <ShieldCheck className="h-4 w-4 text-green-500" /> Secure Checkout
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Truck className="h-4 w-4 text-blue-500" /> Fast Delivery
              </div>
            </div>

            {/* Place Order */}
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full h-14 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-sm uppercase tracking-wider rounded-2xl transition-all active:scale-[0.99] shadow-md shadow-brand-200 disabled:shadow-none"
            >
              {placing
                ? "Processing..."
                : form.paymentMethod === "razorpay"
                ? `Pay ₹${total.toFixed(2)} Securely →`
                : `Place Order · ₹${total.toFixed(2)}`}
            </button>
          </div>

          {/* ── RIGHT: ORDER SUMMARY ── */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sticky top-6 space-y-5">
              <h2 className="text-base font-black text-slate-900">
                Order Summary{" "}
                <span className="text-slate-400 font-semibold text-sm">({cartCount} items)</span>
              </h2>

              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                        {item.product.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-5 w-5 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="h-3 w-3 stroke-[2.5] text-slate-500" />
                        </button>
                        <span className="text-xs font-black text-slate-700 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-5 w-5 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="h-3 w-3 stroke-[2.5] text-slate-500" />
                        </button>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-900 flex-shrink-0">
                      ₹{(item.product.discountPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-800">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="font-bold text-green-600">Free</span>
                  ) : (
                    <span className="font-bold text-slate-800">₹{shippingCost.toFixed(2)}</span>
                  )}
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-slate-400 font-medium">
                    Add ₹{(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>

              <div className="border-t-2 border-slate-900 pt-4 flex justify-between items-baseline">
                <span className="text-base font-black text-slate-900">Total</span>
                <span className="text-2xl font-black text-brand-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
