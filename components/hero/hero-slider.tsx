// components/hero/hero-slider.tsx
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
  imagePosition?: string;
}

const SLIDE_DATA: SlideItem[] = [
  {
    id: 1,
    eyebrow: "🔥 TRENDING COLLECTION",
    titleFirstLine: "Cute Miniature Toys",
    titleSecondLine: "For Every Home & Heart.",
    subtext: "Shop the most loved miniature figurines, couple sets & character collectibles — perfect gifts starting at ₹199.",
    buttonText: "Shop Now →",
    href: "/categories/all",
    bgHex: "#FFF9EA",
    accentColor: "bg-orange-500 hover:bg-orange-600",
    imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1600",
    imagePosition: "center center",
  },
  {
    id: 2,
    eyebrow: "⭐ BESTSELLER",
    titleFirstLine: "Miniature Kitchen Sets",
    titleSecondLine: "Brass, Iron & Silver.",
    subtext: "Tiny kitchens with real detail — brass, iron & silver sets loved by collectors. Great for gifting & home decor.",
    buttonText: "Explore Kitchen Sets →",
    href: "/categories/kitchen-brass",
    bgHex: "#fff5ee",
    accentColor: "bg-brand-500 hover:bg-brand-600",
    imageUrl: "/kitchenset_banner.png",
    imagePosition: "center center",
  },
  {
    id: 3,
    eyebrow: "🐼 FAN FAVOURITE",
    titleFirstLine: "Shin-chan, Panda &",
    titleSecondLine: "Cartoon Collectibles.",
    subtext: "Bring your favourite cartoon characters home — premium resin figurines, perfect for desks, shelves & gifting.",
    buttonText: "Shop Characters →",
    href: "/categories/sinchan-panda",
    bgHex: "#EEF2FF",
    accentColor: "bg-indigo-600 hover:bg-indigo-700",
    imageUrl: "/panda_banner.webp",
    imagePosition: "center 20%",
  },
  {
    id: 4,
    eyebrow: "🎁 GIFT SPECIAL",
    titleFirstLine: "Couple Miniatures",
    titleSecondLine: "Made for Your Story.",
    subtext: "Romantic miniature sets for anniversaries, birthdays & weddings — unique gifts that tell your love story.",
    buttonText: "Shop Couple Sets →",
    href: "/categories/couple-miniatures",
    bgHex: "#F0FFF7",
    accentColor: "bg-emerald-500 hover:bg-emerald-600",
    imageUrl: "/banner_couple_toys.webp",
    imagePosition: "center center",
  },
];

const SLIDE_COUNT = SLIDE_DATA.length;

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDE_COUNT);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="w-full relative overflow-hidden"
      style={{ height: "clamp(320px, 75vw, 780px)" }}
    >
      {/* Horizontal rail — all slides in a row, container slides left */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{
          width: `${SLIDE_COUNT * 100}%`,
          transform: `translateX(-${currentSlide * (100 / SLIDE_COUNT)}%)`,
        }}
      >
        {SLIDE_DATA.map((slide, index) => (
          <div
            key={slide.id}
            className="relative h-full flex items-center overflow-hidden"
            style={{
              width: `${100 / SLIDE_COUNT}%`,
              backgroundColor: slide.bgHex,
            }}
          >
            {/* Background image */}
            <Image
              src={slide.imageUrl}
              alt={slide.titleFirstLine}
              fill
              priority={index === 0}
              className="object-cover"
              style={{ objectPosition: slide.imagePosition ?? "center center" }}
              sizes="100vw"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/20 sm:bg-gradient-to-r sm:from-black/65 sm:via-black/25 sm:to-transparent" />

            {/* Text content */}
            <div className="relative z-20 max-w-7xl mx-auto w-full px-5 sm:px-6 lg:px-8">
              <div className="max-w-lg space-y-3 sm:space-y-4 md:space-y-5">
                <span className="text-[10px] sm:text-sm font-black uppercase tracking-[0.15em] text-orange-300 block">
                  {slide.eyebrow}
                </span>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-[1.15]">
                  {slide.titleFirstLine}
                  <br />
                  <span className="text-white/80">{slide.titleSecondLine}</span>
                </h1>

                <p className="text-xs sm:text-sm text-white/70 font-medium max-w-sm leading-relaxed">
                  {slide.subtext}
                </p>

                <Link
                  href={slide.href}
                  className={`inline-flex items-center rounded-full ${slide.accentColor} text-white font-extrabold text-xs sm:text-sm px-5 sm:px-7 py-2.5 sm:py-3 shadow-md active:scale-95 transition-all`}
                >
                  {slide.buttonText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot navigation */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {SLIDE_DATA.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
