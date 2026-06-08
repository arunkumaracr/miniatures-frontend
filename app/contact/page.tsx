"use client";

import { useState } from "react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: "Email Us",
    detail: "support@miniaturetoys.in",
    sub: "We reply within 24 hours",
    href: "mailto:support@miniaturetoys.in",
    color: "bg-pink-50 text-pink-500",
  },
  {
    icon: Phone,
    title: "Call Us",
    detail: "+91 80 1234 5678",
    sub: "Mon–Sat, 10 AM – 6 PM",
    href: "tel:+918012345678",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    detail: "Bengaluru, Karnataka",
    sub: "India – 560001",
    href: "#",
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: Clock,
    title: "Support Hours",
    detail: "Mon–Fri: 9 AM – 7 PM",
    sub: "Sat: 10 AM – 5 PM · Sun: Closed",
    href: "#",
    color: "bg-amber-50 text-amber-500",
  },
];

const SUBJECTS = [
  "Order Issue",
  "Return / Refund",
  "Product Query",
  "Shipping Delay",
  "Payment Problem",
  "Other",
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function validate() {
    if (!form.name.trim()) return "Please enter your name.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) return "Please enter a valid email.";
    if (!form.subject) return "Please select a subject.";
    if (form.message.trim().length < 10) return "Message must be at least 10 characters.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setSending(true);
    // Simulate network call — replace with real API when ready
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white py-14 px-4 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-white/15 mb-4">
          <Mail className="h-7 w-7 text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-tight">Get in Touch</h1>
        <p className="text-sm text-white/80 font-medium mt-2 max-w-md mx-auto">
          Have a question or need help? We&apos;d love to hear from you. Our team is ready to assist.
        </p>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 pb-24">

        {/* Contact cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {CONTACT_CARDS.map(({ icon: Icon, title, detail, sub, href, color }) => (
            <a
              key={title}
              href={href}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-3 hover:border-pink-200 transition-colors"
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">{title}</p>
                <p className="text-xs font-bold text-slate-700 mt-0.5">{detail}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5 leading-snug">{sub}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Contact form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Message Sent!</h2>
              <p className="text-sm text-slate-500 font-medium max-w-xs">
                Thanks for reaching out. We&apos;ll get back to you at <strong>{form.email}</strong> within 24 hours.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                className="mt-2 text-sm font-black text-pink-500 hover:text-pink-600 transition-colors"
              >
                Send another message →
              </button>
            </div>
          ) : (
            <>
              <h2 className="text-lg font-black text-slate-900 mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Your Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Arunkumar"
                      className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com"
                      className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Subject *</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white text-slate-700"
                  >
                    <option value="">Select a topic...</option>
                    {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-600 uppercase tracking-wider">Message *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    placeholder="Describe your issue or question in detail..."
                    className="mt-1.5 w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white resize-none"
                  />
                </div>

                {error && (
                  <p className="text-sm font-semibold text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full h-12 bg-pink-500 hover:bg-pink-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-pink-200 disabled:shadow-none"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
