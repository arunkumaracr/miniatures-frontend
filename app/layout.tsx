import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { CartProvider } from "../lib/cart-context";
import { AuthProvider } from "../lib/auth-context";
import { WishlistProvider } from "../lib/wishlist-context";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Miniature Toys",
  description: "Premium educational toys for kids",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-dm-sans)]">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
