// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  // Allow access to maintenance page itself and static assets
  if (
    request.nextUrl.pathname.startsWith("/maintenance") ||
    request.nextUrl.pathname.startsWith("/_next") ||
    request.nextUrl.pathname.startsWith("/api") ||
    request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (isMaintenanceMode) {
    return NextResponse.rewrite(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};