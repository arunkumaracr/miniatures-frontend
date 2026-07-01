"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage) {
      const auth = localStorage.getItem("admin_auth");
      if (auth !== "true") {
        router.replace("/admin/login");
      }
    }
  }, [isLoginPage, router]);

  // Login page — no sidebar, no chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <AdminSidebar />
      <main className="flex-1 pt-14 md:pt-0 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
