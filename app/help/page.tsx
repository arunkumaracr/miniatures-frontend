"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import {
  ChevronDown, Truck, RotateCcw, CreditCard, Package,
  Mail, Phone, Clock, MessageCircle, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  q: string;
  a: string;
}

const TOPICS: { icon: React.ElementType; label: string; color: string; faqs: FaqItem[] }[] = [
  {
    icon: Truck,
    label: "Shipping",
    color: "bg-blue-50 text-blue-600",
    faqs: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 5–7 business days. Express delivery (2–3 days) is available at checkout for an additional fee.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! Orders above ₹999 qualify for free standard shipping anywhere in India.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order ships you'll receive a tracking link by email. You can also use our Track Order page anytime.",
      },
      {
        q: "Do you ship internationally?",
        a: "Currently we ship within India only. International shipping is coming soon — subscribe to our newsletter to be notified.",
      },
    ],
  },
  {
    icon: RotateCcw,
    label: "Returns & Exchanges",
    color: "bg-green-50 text-green-600",
    faqs: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 30 days of delivery. Items must be unused, in original packaging, with all tags attached.",
      },
      {
        q: "How do I initiate a return?",
        a: "Email us at support@miniaturetoys.in with your order ID and reason for return. We'll arrange a free pickup within 2 business days.",
      },
      {
        q: "When will I get my refund?",
        a: "Refunds are processed within 5–7 business days after we receive and inspect the returned item. It will be credited to your original payment method.",
      },
      {
        q: "Can I exchange for a different product?",
        a: "Yes, exchanges are free of charge. Contact us with your order ID and the product you'd like instead.",
      },
    ],
  },
  {
    icon: CreditCard,
    label: "Payments",
    color: "bg-purple-50 text-purple-600",
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "We accept UPI (Google Pay, PhonePe, Paytm), Net Banking, Credit/Debit Cards, and Cash on Delivery (COD).",
      },
      {
        q: "Is COD available for all orders?",
        a: "COD is available for orders up to ₹5,000 in most pin codes. You'll see COD as an option at checkout if it's available for your location.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All payments are processed through Razorpay, a PCI-DSS compliant gateway. We never store your card details.",
      },
      {
        q: "Can I use multiple payment methods?",
        a: "Currently one payment method per order. You can use partial wallet balance + UPI on the Razorpay checkout screen.",
      },
    ],
  },
  {
    icon: Package,
    label: "Products & Orders",
    color: "bg-amber-50 text-amber-600",
    faqs: [
      {
        q: "Are the toys safe for children?",
        a: "All our toys comply with BIS (Bureau of Indian Standards) and EN71 safety certifications. Age-appropriate labels are on every product.",
      },
      {
        q: "Can I cancel my order?",
        a: "Orders can be cancelled within 2 hours of placement. After that, the order may already be packed. Contact us immediately and we'll do our best.",
      },
      {
        q: "What if I receive a damaged item?",
        a: "Please photograph the damage and email us within 48 hours of delivery. We'll send a replacement or full refund at no extra cost.",
      },
      {
        q: "Do products come with a warranty?",
        a: "Select premium products include a 6-month manufacturer warranty. This is mentioned on the individual product page.",
      },
    ],
  },
];

function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-slate-100">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
          >
            <span className="text-sm font-bold text-slate-800">{faq.q}</span>
            <ChevronDown className={cn(
              "h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200",
              open === i && "rotate-180"
            )} />
          </button>
          {open === i && (
            <div className="px-5 pb-4">
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{faq.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const allFaqs = TOPICS.flatMap((t) => t.faqs);
  const filtered = searchQuery.trim()
    ? allFaqs.filter(
        (f) =>
          f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#e8884f] to-[#d4703a] text-white py-14 px-4 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-white/15 mb-4">
            <MessageCircle className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Help & Support</h1>
          <p className="text-sm text-white/80 font-medium mt-2 max-w-md mx-auto">
            Find answers to common questions or reach out — we're here to help.
          </p>

          {/* Search */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-white text-slate-800 text-sm font-medium focus:outline-none shadow-lg"
            />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          {/* Search results */}
          {filtered !== null ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-8">
              <div className="px-5 py-4 border-b border-slate-100">
                <p className="text-sm font-black text-slate-700">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{searchQuery}"
                </p>
              </div>
              {filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm text-slate-400 font-medium">No FAQs matched your search.</p>
                  <p className="text-sm text-slate-400 font-medium mt-1">
                    Try a different keyword or{" "}
                    <button onClick={() => setSearchQuery("")} className="text-brand-500 font-bold hover:underline">
                      browse all topics
                    </button>
                    .
                  </p>
                </div>
              ) : (
                <FaqAccordion faqs={filtered} />
              )}
            </div>
          ) : (
            <>
              {/* Topic tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
                {TOPICS.map((topic, idx) => {
                  const Icon = topic.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(idx)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border",
                        activeTab === idx
                          ? "bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-200"
                          : "bg-white text-slate-600 border-slate-200 hover:border-brand-200 hover:text-brand-500"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {topic.label}
                    </button>
                  );
                })}
              </div>

              {/* FAQ panel */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-8 overflow-hidden">
                <div className={cn("flex items-center gap-3 px-5 py-4 border-b border-slate-100")}>
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", TOPICS[activeTab].color)}>
                    {(() => { const Icon = TOPICS[activeTab].icon; return <Icon className="h-4 w-4" />; })()}
                  </div>
                  <h2 className="font-black text-slate-900">{TOPICS[activeTab].label}</h2>
                </div>
                <FaqAccordion faqs={TOPICS[activeTab].faqs} />
              </div>
            </>
          )}

          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center gap-3">
              <div className="h-11 w-11 rounded-full bg-brand-50 flex items-center justify-center">
                <Mail className="h-5 w-5 text-brand-500" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">Email Us</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">We reply within 24 hours</p>
              </div>
              <a
                href="mailto:support@miniaturetoys.in"
                className="text-xs font-black text-brand-500 hover:text-brand-600 transition-colors"
              >
                support@miniaturetoys.in
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center gap-3">
              <div className="h-11 w-11 rounded-full bg-green-50 flex items-center justify-center">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">Call Us</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Mon–Sat, 10 AM – 6 PM</p>
              </div>
              <a
                href="tel:+918012345678"
                className="text-xs font-black text-green-600 hover:text-green-700 transition-colors"
              >
                +91 80 1234 5678
              </a>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center gap-3">
              <div className="h-11 w-11 rounded-full bg-amber-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">Support Hours</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">When we're available</p>
              </div>
              <p className="text-xs font-bold text-slate-600 text-center leading-relaxed">
                Mon–Fri: 9 AM – 7 PM<br />
                Sat: 10 AM – 5 PM<br />
                Sun: Closed
              </p>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-400 font-medium">
            Still need help?{" "}
            <Link href="/track" className="font-black text-brand-500 hover:text-brand-600 transition-colors">
              Track your order →
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
