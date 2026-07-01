import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { FileText } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using the Miniature Toys website ("Site"), you agree to be bound by these Terms & Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this Site. We reserve the right to update these terms at any time without prior notice.`,
  },
  {
    title: "2. Products & Pricing",
    body: `All products listed on the Site are subject to availability. Prices are displayed in Indian Rupees (₹) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to modify prices at any time. In the event of a pricing error, we will notify you before processing your order.`,
  },
  {
    title: "3. Orders & Payment",
    body: `By placing an order, you confirm that the information provided is accurate and complete. We accept UPI, Credit/Debit Cards, Net Banking. Orders are confirmed only after successful payment. We reserve the right to cancel orders at our discretion, in which case a full refund will be issued.`,
  },
  {
    title: "4. Shipping & Delivery",
    body: `We ship across India. Standard delivery takes 5–7 business days; express delivery (2–3 days) is available at checkout. Delivery timelines are estimates and may vary due to courier or regional factors. Miniature Toys is not responsible for delays caused by third-party logistics providers. Free shipping applies on orders above ₹999.`,
  },
  {
    title: "5. Returns & Refunds",
    body: `We offer a 7-day return policy from the date of delivery. To be eligible, items must be unused, unassembled, and in their original packaging with all parts intact. Returns are accepted under the following conditions:\n\n• The item received is damaged, broken, or defective on arrival.\n• The wrong product was delivered.\n• The item is significantly different from what was described.\n\nReturns are NOT accepted if:\n• The item has been used, assembled, or repainted.\n• The packaging has been destroyed or discarded.\n• The return request is raised after 7 days of delivery.\n• Damage was caused by the buyer after delivery.\n\nTo initiate a return, email us at support@miniaturetoys.in within 7 days of delivery with your Order ID, a brief reason, and clear photos of the item and packaging. Once we receive and inspect the returned item, refunds are processed within 5–7 business days to the original payment method. For COD orders, refunds are issued via bank transfer or UPI.`,
  },
  {
    title: "6. Intellectual Property",
    body: `All content on this Site — including logos, images, product descriptions, and graphics — is the property of Miniature Toys and protected under applicable intellectual property laws. You may not reproduce, distribute, or use any content without prior written permission.`,
  },
  {
    title: "7. User Accounts",
    body: `When you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. Notify us immediately at support@miniaturetoys.in if you suspect unauthorised access. We reserve the right to suspend accounts that violate these terms.`,
  },
  {
    title: "8. Limitation of Liability",
    body: `Miniature Toys shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our products or services. Our total liability in any matter arising from a purchase shall not exceed the amount paid for the specific product in question.`,
  },
  {
    title: "9. Privacy",
    body: `Your use of this Site is also governed by our Privacy Policy. We collect and process personal data solely to fulfil orders, improve your shopping experience, and comply with legal obligations. We do not sell or share your personal information with third parties for marketing purposes without your consent.`,
  },
  {
    title: "10. Governing Law",
    body: `These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Bengaluru, Karnataka.`,
  },
  {
    title: "11. Contact",
    body: `If you have questions about these Terms & Conditions, please contact us at support@miniaturetoys.in or call +91 9159947106 (Mon–Sat, 10 AM – 6 PM).`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="bg-slate-900 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-white/10 mb-4">
          <FileText className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Terms & Conditions</h1>
        <p className="text-sm text-slate-400 font-medium mt-2">Last updated: June 2026</p>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 pb-24">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 sm:p-10 space-y-8">
          <p className="text-sm text-slate-500 font-medium leading-relaxed border-l-4 border-brand-400 pl-4">
            Please read these Terms & Conditions carefully before using the Miniature Toys platform. These terms govern your access to and use of our website and services.
          </p>

          {SECTIONS.map(({ title, body }) => (
            <div key={title} className="space-y-2">
              <h2 className="text-base font-black text-slate-900">{title}</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed whitespace-pre-line">{body}</p>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
            <p className="text-xs text-slate-400 font-medium">
              Questions? We&apos;re happy to help.
            </p>
            <Link
              href="/contact"
              className="text-xs font-black text-brand-500 hover:text-brand-600 transition-colors"
            >
              Contact Support →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
