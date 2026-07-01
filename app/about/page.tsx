import Link from "next/link";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import { Heart, Shield, Sparkles, Users, Star, Truck } from "lucide-react";

const VALUES = [
  {
    icon: Heart,
    title: "Made with Love",
    desc: "Every toy we source is chosen with a parent's eye - safe, enriching, and genuinely fun for kids of all ages.",
    color: "bg-brand-50 text-brand-500",
  },
  {
    icon: Shield,
    title: "Safety First",
    desc: "All products meet BIS and EN71 safety standards. We never compromise on the safety of your child.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Sparkles,
    title: "Spark Curiosity",
    desc: "We believe play is learning. Our range is curated to develop creativity, motor skills, and imagination.",
    color: "bg-amber-50 text-amber-500",
  },
  {
    icon: Users,
    title: "Community First",
    desc: "Built by parents, for parents. We listen to our community to constantly improve what we offer.",
    color: "bg-purple-50 text-purple-500",
  },
];

const MILESTONES = [
  { year: "The Beginning", event: "It all started with a passion — collecting tiny, detailed miniature things. What began as a personal hobby slowly grew into something bigger: a dream to share that joy with others." },
  { year: "The First Shop", event: "We opened our first physical store 'Miniatures & Toys' in Tamil Nadu. Walking in felt like stepping into a tiny world — every shelf filled with handpicked miniature figurines, kitchen sets, and collectibles." },
  { year: "Going Online", event: "As demand grew beyond our local reach, we took the leap onto online platforms — making our miniatures available to collectors and gifters all across India." },
  { year: "Today", event: "Miniaturestoys.in is now a fully online brand, focused 100% on delivering the best miniature toys and collectibles directly to your doorstep — from couple figurines to brass kitchen sets and character collectibles." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#e8884f] to-[#d4703a] text-white py-20 px-4 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-white/70 mb-3">Our Story</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight max-w-2xl mx-auto">
          Bringing Joy to<br />Every Childhood
        </h1>
        <p className="mt-5 text-base text-white/80 font-medium max-w-xl mx-auto leading-relaxed">
          Miniature Toys started with a simple passion — collecting tiny, beautiful things. From a small physical shop in Tamil Nadu to a fully online platform, we now bring handpicked miniature collectibles to doorsteps across India.
        </p>
        <div className="mt-8 flex items-center justify-center gap-6 text-sm font-black">
          <div className="text-center">
            <p className="text-3xl font-black">2L+</p>
            <p className="text-white/70 text-xs mt-0.5">Happy Families</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-3xl font-black">200+</p>
            <p className="text-white/70 text-xs mt-0.5">Products</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <p className="text-3xl font-black">4.8</p>
            <p className="text-white/70 text-xs mt-0.5 flex items-center gap-0.5"><Star className="h-3 w-3 fill-white" /> Rating</p>
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 pb-24 space-y-20">

        {/* Mission */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-brand-500 mb-3">Our Mission</p>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">
              Tiny things,<br />big happiness.
            </h2>
            <p className="mt-4 text-slate-500 font-medium leading-relaxed">
              Miniatures & Toys was born from a personal love of collecting tiny, detailed figurines. What started as a hobby became a real shop in Tamil Nadu — and today it's a fully online brand delivering joy to collectors and gift-givers all over India.
            </p>
            <p className="mt-3 text-slate-500 font-medium leading-relaxed">
              From couple miniatures to brass kitchen sets and cartoon collectibles, every piece we carry is handpicked for its detail, charm, and ability to make someone smile.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {VALUES.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-black text-slate-800">{title}</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section>
          <p className="text-xs font-black uppercase tracking-widest text-brand-500 mb-2">How We Got Here</p>
          <h2 className="text-2xl font-black text-slate-900 mb-8">Our Journey</h2>
          <div className="relative border-l-2 border-brand-100 pl-8 space-y-8">
            {MILESTONES.map(({ year, event }) => (
              <div key={year} className="relative">
                <div className="absolute -left-[2.85rem] h-5 w-5 rounded-full bg-brand-500 border-4 border-white shadow-sm" />
                <p className="text-xs font-black text-brand-500 uppercase tracking-widest mb-1">{year}</p>
                <p className="text-sm font-medium text-slate-600 leading-relaxed">{event}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-brand-50 to-purple-50 rounded-3xl p-10 text-center border border-brand-100">
          <Truck className="h-10 w-10 text-brand-400 mx-auto mb-4 stroke-[1.5]" />
          <h2 className="text-2xl font-black text-slate-900">Start Shopping Today</h2>
          <p className="text-sm text-slate-500 font-medium mt-2 max-w-sm mx-auto">
            Free shipping on orders above ₹1999.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-black uppercase tracking-wider px-8 py-3.5 rounded-xl transition-colors shadow-md shadow-brand-200"
          >
            Explore Products
          </Link>
        </section>

      </main>

      <Footer />
    </div>
  );
}
