"use client";

import Link from "next/link";
import { 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Trophy, 
  MapPin, 
  PhoneCall 
} from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#1E293B] text-slate-300 relative mt-24">
      
      {/* 🟣 LAYER 1: The Floating Purple Trust Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -top-12 z-20">
        <div className="w-full bg-brand-500 rounded-md p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 shadow-xl">
          
          {/* Feature 1 */}
          <div className="flex items-center gap-4 text-white border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 pr-2">
            <Truck className="h-10 w-10 flex-shrink-0 stroke-[1.5]" />
            <div className="text-left">
              <h4 className="text-sm font-black uppercase tracking-wider">Free Shipping</h4>
              <p className="text-xs text-brand-100 font-medium mt-0.5">When ordering over $100</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-4 text-white border-b sm:border-b-0 lg:border-r border-white/10 pb-4 sm:pb-0 lg:pr-2">
            <RotateCcw className="h-10 w-10 flex-shrink-0 stroke-[1.5]" />
            <div className="text-left">
              <h4 className="text-sm font-black uppercase tracking-wider">Free Return</h4>
              <p className="text-xs text-brand-100 font-medium mt-0.5">Get Return within 30 days</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-4 text-white border-b sm:border-b-0 sm:border-r border-white/10 pb-4 sm:pb-0 pr-2">
            <ShieldCheck className="h-10 w-10 flex-shrink-0 stroke-[1.5]" />
            <div className="text-left">
              <h4 className="text-sm font-black uppercase tracking-wider">Secure Payment</h4>
              <p className="text-xs text-brand-100 font-medium mt-0.5">100% Secure Online Payment</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center gap-4 text-white pr-2">
            <Trophy className="h-10 w-10 flex-shrink-0 stroke-[1.5]" />
            <div className="text-left">
              <h4 className="text-sm font-black uppercase tracking-wider">Best Quality</h4>
              <p className="text-xs text-brand-100 font-medium mt-0.5">Original Product Guaranteed</p>
            </div>
          </div>

        </div>
      </div>

      {/* 🕋 LAYER 2: Core Dark Navigation Links Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-left">
          
          {/* Brand Identity Pillar */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-tighter text-white">
                Shop<span className="text-brand-500">Us</span>
              </span>
            </Link>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li><Link href="/track" className="hover:text-brand-500 transition-colors">Track Order</Link></li>
              <li><Link href="/delivery" className="hover:text-brand-500 transition-colors">Delivery & Returns</Link></li>
              {/* <li><Link href="/warranty" className="hover:text-brand-500 transition-colors">Warranty</Link></li> */}
            </ul>
          </div>

          {/* About Us Link Matrix */}
          <div className="space-y-4">
            <h3 className="text-md font-black tracking-tight text-white uppercase">Company</h3>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li><Link href="/about" className="hover:text-brand-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand-500 transition-colors">Contact Us</Link></li>
              <li><Link href="/help" className="hover:text-brand-500 transition-colors">Help & Support</Link></li>
              <li><Link href="/track" className="hover:text-brand-500 transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Useful Info Links Matrix */}
          <div className="space-y-4">
            <h3 className="text-md font-black tracking-tight text-white uppercase">Legal</h3>
            <ul className="space-y-3 text-sm font-medium text-slate-400">
              <li><Link href="/terms" className="hover:text-brand-500 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-brand-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/help" className="hover:text-brand-500 transition-colors">Returns Policy</Link></li>
              <li><Link href="/help" className="hover:text-brand-500 transition-colors">Shipping Info</Link></li>
            </ul>
          </div>

          {/* Contact Information Elements Panel */}
          <div className="space-y-5">
            <h3 className="text-md font-black tracking-tight text-white uppercase">Contact Info</h3>
            
            <div className="flex gap-3 text-slate-400 items-start">
              <div className="h-9 w-9 border border-slate-700 rounded-full flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <span className="font-extrabold text-white block">Address:</span>
                <span className="font-medium">Azad Nagar Chamrajpet Bengaluru 560018</span>
              </div>
            </div>

            <div className="flex gap-3 text-slate-400 items-start">
              <div className="h-9 w-9 border border-slate-700 rounded-full flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                <PhoneCall className="h-4 w-4" />
              </div>
              <div className="text-sm">
                <span className="font-extrabold text-white block">Phone:</span>
                <span className="font-medium hover:text-brand-500 transition-colors cursor-pointer">+919159947106</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom copyright hairline bar */}
        <div className="w-full border-t border-slate-800 mt-12 pt-6 text-center text-xs font-semibold text-slate-500 tracking-wide">
          &copy; {new Date().getFullYear()} Miniatures & Toys. All Rights Reserved. Curran curations sequence layout.
        </div>
      </div>

    </footer>
  );
}