// components/hero-slider.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface SlideItem {
  id: number;
  eyebrow: string;
  titleFirstLine: string;
  titleSecondLine: string;
  subtext: string;
  buttonText: string;
  href: string;
  bgHex: string;
  accentColor: string;
  imageUrl: string;
}

const SLIDE_DATA: SlideItem[] = [
  {
    id: 1,
    eyebrow: "NEW COLLECTION",
    titleFirstLine: "Tiny Details,",
    titleSecondLine: "Big Emotions. Shop Couple Miniatures.",
    subtext: "Handcrafted couple figurines that tell your love story — shelf-ready & gift-perfect.",
    buttonText: "Shop Now →",
    href: "/categories/all",
    bgHex: "bg-[#FFF9EA]",
    accentColor: "bg-orange-500 hover:bg-orange-600",
    imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 2,
    eyebrow: "TRENDING NOW",
    titleFirstLine: "Miniature Kitchens",
    titleSecondLine: "That Steal Every Heart.",
    subtext: "Perfectly scaled kitchen sets — collect, display, or gift with love.",
    buttonText: "Explore Collection →",
    href: "/categories/all",
    bgHex: "bg-[#FFF0F6]",
    accentColor: "bg-pink-500 hover:bg-pink-600",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 3,
    eyebrow: "COLLECTOR'S PICK",
    titleFirstLine: "Real Metal. Real Detail.",
    titleSecondLine: "Real Passion.",
    subtext: "Diecast scale models built for true collectors — every curve, every chrome.",
    buttonText: "Shop Diecast →",
    href: "/categories/all",
    bgHex: "bg-[#F0F4FF]",
    accentColor: "bg-indigo-600 hover:bg-indigo-700",
    imageUrl: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 4,
    eyebrow: "LIMITED OFFER",
    titleFirstLine: "Own a Little World",
    titleSecondLine: "of Your Own.",
    subtext: "Miniature showpieces starting at just ₹299 — curated for collectors & gifters.",
    buttonText: "Grab the Deal →",
    href: "/categories/all",
    bgHex: "bg-[#F0FFF7]",
    accentColor: "bg-emerald-500 hover:bg-emerald-600",
    imageUrl: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80&w=1000",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide every 6 seconds to keep user engagement high
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_DATA.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full relative overflow-hidden h-[420px] sm:h-[500px] lg:h-[600px]">
      {/* Slide Container Wrapper */}
      <div className="w-full h-full relative">
        {SLIDE_DATA.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full ${slide.bgHex} flex items-center transition-all duration-700 ease-in-out ${
              index === currentSlide 
                ? "opacity-100 translate-x-0 z-10" 
                : "opacity-0 translate-x-full z-0"
            }`}
          >
            <div className="max-w-7xl mx-auto w-full h-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 items-center relative">
              
              {/* Text Layout Element */}
              <div className="md:col-span-6 z-20 space-y-4 md:space-y-6 text-left animate-in fade-in slide-in-from-left-8 duration-500">
                <span className="text-sm sm:text-base font-black uppercase tracking-wider text-pink-600 block tracking-[0.15em]">
                  {slide.eyebrow}
                </span>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.10]">
                  {slide.titleFirstLine} <br />
                  <span className="text-slate-800">{slide.titleSecondLine}</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-500 font-medium max-w-sm leading-relaxed">
                  {slide.subtext}
                </p>

                <Link
                  href={slide.href}
                  className={`inline-flex items-center rounded-full ${slide.accentColor} text-white font-extrabold text-sm px-8 py-3.5 shadow-md active:scale-95 transition-all`}
                >
                  {slide.buttonText}
                </Link>
              </div>

              {/* Graphical Circular Banner Element (Hidden on small mobile viewports) */}
              <div className="hidden md:block md:col-span-6 h-full relative z-10 animate-in fade-in zoom-in-95 duration-700">
                {/* The curved semi-circle layout clip matching the  template style */}
                <div className="absolute right-0 bottom-0 top-10 w-[110%] h-[90%] bg-white rounded-l-full overflow-hidden shadow-2xl shadow-slate-200 border-l border-white">
                  <Image
                    src={slide.imageUrl}
                    alt="Toy Campaign Advertisement Showcase"
                    fill
                    priority={index === 0}
                    className="object-cover object-center"
                    sizes="(max-width: 1200px) 50vw, 40vw"
                  />
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dot Indicators Layer matching  design dots spacing exactly */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {SLIDE_DATA.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide 
                ? "w-8 h-2.5 bg-pink-500" // Active stretched layout dot parameter
                : "w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}