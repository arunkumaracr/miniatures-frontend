// components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, ShoppingCart, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-100">
        <span className="text-lg font-black text-slate-900 tracking-tight">
          🧸 Admin Panel
        </span>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          MiniaturesToys
        </p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all",
              pathname === href
                ? "bg-brand-50 text-brand-600"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Icon size={17} />
            {label}
          </Link>
        ))}
      </nav>

      {/* View Store Link */}
      <div className="px-3 py-4 border-t border-slate-100">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <ExternalLink size={17} />
          View Store
        </a>
      </div>
    </aside>
  );
};