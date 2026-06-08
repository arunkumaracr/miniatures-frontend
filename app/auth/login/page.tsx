"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { loginUser } from "@/lib/auth-api";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/account";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser({ email: form.email, password: form.password });

      if (data.token && data.user) {
        login(data.user, data.token);
        router.push(redirectTo);
      } else {
        setError(data.message || "Invalid email or password.");
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
          <h1 className="text-2xl font-black text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Sign in to your account to continue
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
              Email Address
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
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
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                placeholder="••••••••"
                autoComplete="current-password"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-pink-500 hover:bg-pink-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-sm shadow-pink-200 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 font-medium">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-black text-pink-500 hover:text-pink-600 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50/60 flex items-center justify-center" />}>
      <LoginForm />
    </Suspense>
  );
}
