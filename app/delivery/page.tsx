import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Truck } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Shipping Coverage",
    body: `We ship across India to all pin codes serviceable by our courier partners. For remote or difficult-to-reach areas, delivery may take additional time. International shipping is not currently available but is coming soon.`,
  },
  {
    title: "2. Delivery Timelines",
    body: `Standard delivery takes 5–7 business days from the date of dispatch. Express delivery (2–3 business days) is available at checkout for select pin codes at an additional charge. Timelines are estimates and may vary during peak seasons, public holidays, or due to courier delays.`,
  },
  {
    title: "3. Shipping Charges",
    body: `Free shipping applies on all orders above ₹999. For orders below ₹999, a flat shipping fee of ₹79 is charged at checkout. Express delivery charges vary by location and are displayed at checkout before payment.`,
  },
  {
    title: "4. Order Processing",
    body: `Orders are processed and dispatched within 1–2 business days of payment confirmation. You will receive an email and/or SMS with your tracking number once your order is shipped. Orders placed after 5 PM IST are processed the next business day.`,
  },
  {
    title: "5. Order Tracking",
    body: `You can track your order anytime using the Track Order page on our website. Enter your order number or the tracking ID sent to your registered email. For real-time updates, you can also use the courier partner's tracking portal directly.`,
  },
  {
    title: "6. Failed Delivery Attempts",
    body: `Our courier partners make up to 3 delivery attempts. If all attempts fail (e.g., incorrect address, recipient unavailable), the package is returned to us. In such cases, we will contact you to arrange re-delivery. Re-delivery shipping charges may apply.`,
  },
  {
    title: "7. Returns",
    body: `You may return eligible items within 30 days of delivery. Items must be unused, in original packaging, and with all tags intact. To initiate a return, email support@miniaturetoys.in with your order ID and reason for return. Approved returns are collected by our courier partner at no additional cost to you.`,
  },
  {
    title: "8. Refunds",
    body: `Once a returned item is received and inspected (usually within 2 business days), we process the refund within 5–7 business days to your original payment method. UPI and wallet refunds are typically faster than card refunds.`,
  },
  {
    title: "9. Damaged or Wrong Items",
    body: `If you receive a damaged, defective, or incorrect item, please contact us within 48 hours of delivery at support@miniaturetoys.in with photos. We will arrange an immediate replacement or full refund with no return required in most cases.`,
  },
  {
    title: "10. Contact",
    body: `For any delivery or returns queries, reach us at support@miniaturetoys.in or call +91 91599 47106 (Mon–Sat, 10 AM – 6 PM IST).`,
  },
];

export default function DeliveryPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Navbar />

      <div className="bg-slate-900 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-white/10 mb-4">
          <Truck className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Delivery & Returns</h1>
        <p className="text-sm text-slate-400 font-medium mt-2">Last updated: June 2026</p>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 pb-24">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-10 space-y-8">
          <p className="text-sm text-slate-500 font-medium leading-relaxed border-l-4 border-brand-400 pl-4">
            Fast, reliable delivery and hassle-free returns — here's everything you need to know about getting your order and sending it back if needed.
          </p>

          {SECTIONS.map(({ title, body }) => (
            <div key={title} className="space-y-2">
              <h2 className="text-base font-black text-slate-900">{title}</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{body}</p>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <p className="text-xs text-slate-400 font-medium">Need help with your order?</p>
            <Link href="/track" className="text-xs font-black text-brand-500 hover:text-brand-600 transition-colors">
              Track Your Order →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
