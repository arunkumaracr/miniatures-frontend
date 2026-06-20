import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { BadgeCheck } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Warranty Coverage",
    body: `All products sold on Miniature Toys come with a 30-day quality guarantee from the date of delivery. If your product arrives damaged, defective, or differs significantly from the listed description, you are eligible for a replacement or full refund.`,
  },
  {
    title: "2. What Is Covered",
    body: `Our warranty covers manufacturing defects, paint or finish flaws present at the time of delivery, broken or missing parts due to packaging failure, and items damaged in transit. We cover all costs for replacement shipping in these cases.`,
  },
  {
    title: "3. What Is Not Covered",
    body: `The warranty does not cover damage caused by misuse, accidental drops, unauthorised modifications, normal wear and tear, or damage resulting from failure to follow care instructions. Colour variations due to screen settings are not considered defects.`,
  },
  {
    title: "4. How to Claim",
    body: `To raise a warranty claim, email support@miniaturetoys.in within 30 days of delivery. Include your order ID, a brief description of the issue, and clear photographs of the item. Our team will respond within 2 business days with next steps.`,
  },
  {
    title: "5. Resolution Options",
    body: `Depending on the nature of the issue, we will offer one of the following resolutions: a full replacement of the defective item at no cost, store credit equivalent to the product value, or a full refund to your original payment method. The choice is yours.`,
  },
  {
    title: "6. Replacement Timeline",
    body: `Once a warranty claim is approved, replacements are dispatched within 3–5 business days. Refunds are processed within 5–7 business days to your original payment method.`,
  },
  {
    title: "7. Fragile Items",
    body: `Miniature figurines and display pieces are delicate by nature. We pack all orders carefully with protective materials. In the rare event of breakage during transit, we will replace the item once you share photographic evidence.`,
  },
  {
    title: "8. Contact",
    body: `For warranty queries, reach us at support@miniaturetoys.in or call +91 91599 47106 (Mon–Sat, 10 AM – 6 PM IST). Please have your order number ready for faster resolution.`,
  },
];

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Navbar />

      <div className="bg-slate-900 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-white/10 mb-4">
          <BadgeCheck className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Warranty Policy</h1>
        <p className="text-sm text-slate-400 font-medium mt-2">Last updated: June 2026</p>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 pb-24">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-10 space-y-8">
          <p className="text-sm text-slate-500 font-medium leading-relaxed border-l-4 border-brand-400 pl-4">
            We stand behind every product we sell. If something isn't right, we'll make it right — quickly and without hassle.
          </p>

          {SECTIONS.map(({ title, body }) => (
            <div key={title} className="space-y-2">
              <h2 className="text-base font-black text-slate-900">{title}</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{body}</p>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <p className="text-xs text-slate-400 font-medium">Need to raise a claim?</p>
            <Link href="/contact" className="text-xs font-black text-brand-500 hover:text-brand-600 transition-colors">
              Contact Support →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
