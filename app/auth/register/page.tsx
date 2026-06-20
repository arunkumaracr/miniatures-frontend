"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { registerUser } from "@/lib/auth-api";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      if (data.token && data.user) {
        login(data.user, data.token);
        router.push("/account");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center">
        <div className="relative h-14 w-40">
          <Image
            src="/mt_logo_new.png"
            alt="Miniature Toys"
            fill
            className="object-contain"
          />
        </div>
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-sm p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Create account</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Join Miniature Toys today
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
              placeholder="Your full name"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                placeholder="Min. 6 characters"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-600 uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
              placeholder="Re-enter password"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-sm shadow-brand-200 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 font-medium">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-black text-brand-500 hover:text-brand-600 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
