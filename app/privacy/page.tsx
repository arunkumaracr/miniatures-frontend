import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { ShieldCheck } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: `We collect personal information you provide when you create an account, place an order, or contact us — including your name, email address, phone number, and delivery address. We also collect non-personal data such as browser type, device information, and pages visited to improve your shopping experience.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `Your information is used solely to process and fulfil your orders, send order confirmations and shipping updates, respond to customer support queries, and improve our website and product offerings. We do not use your data for unsolicited marketing without your explicit consent.`,
  },
  {
    title: "3. Data Sharing",
    body: `We do not sell, trade, or rent your personal information to third parties. We may share your details with trusted logistics partners (e.g., courier companies) strictly for order delivery purposes. All partners are bound by confidentiality agreements.`,
  },
  {
    title: "4. Cookies",
    body: `Our website uses cookies to maintain session state, remember your cart, and analyse site traffic. You may disable cookies through your browser settings, though some features of the site may not function correctly without them.`,
  },
  {
    title: "5. Data Security",
    body: `We implement industry-standard security measures including HTTPS encryption and secure password hashing to protect your personal data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "6. Data Retention",
    body: `We retain your personal data for as long as your account is active or as needed to provide services. You may request deletion of your account and associated data at any time by contacting us at support@miniaturetoys.in.`,
  },
  {
    title: "7. Your Rights",
    body: `You have the right to access, correct, or delete your personal data at any time. To exercise these rights, please email support@miniaturetoys.in with your registered email address. We will respond within 7 business days.`,
  },
  {
    title: "8. Third-Party Links",
    body: `Our website may contain links to third-party sites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies separately.`,
  },
  {
    title: "9. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance of the revised policy.`,
  },
  {
    title: "10. Contact",
    body: `For any privacy-related questions or requests, contact us at support@miniaturetoys.in or call +91 91599 47106 (Mon–Sat, 10 AM – 6 PM IST).`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Navbar />

      <div className="bg-slate-900 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-white/10 mb-4">
          <ShieldCheck className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-slate-400 font-medium mt-2">Last updated: June 2026</p>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 pb-24">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-10 space-y-8">
          <p className="text-sm text-slate-500 font-medium leading-relaxed border-l-4 border-brand-400 pl-4">
            At Miniature Toys, your privacy matters. This policy explains what data we collect, how we use it, and how we keep it safe.
          </p>

          {SECTIONS.map(({ title, body }) => (
            <div key={title} className="space-y-2">
              <h2 className="text-base font-black text-slate-900">{title}</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">{body}</p>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <p className="text-xs text-slate-400 font-medium">Questions about your data?</p>
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
