// components/hero-slider.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface SlideItem {
  id: number;
  badge: string;
  titleFirstLine: string;
  titleSecondLine: string;
  buttonText: string;
  bgHex: string;
  imageUrl: string;
}

const SLIDE_DATA: SlideItem[] = [
  {
    id: 1,
    badge: "UP TO 70% OFF",
    titleFirstLine: "Mega Summer Sale",
    titleSecondLine: "On Educational Toys",
    buttonText: "Shop Now",
    bgHex: "bg-[#FFF9EA]", // Sleek warm cream matching your reference mockup
    imageUrl: "/h1banner_1.png", // Kids playing happily
  },
  {
    id: 2,
    badge: "NEW ARRIVALS",
    titleFirstLine: "Handcrafted Wooden",
    titleSecondLine: "Play Sets Collection",
    buttonText: "Explore More",
    bgHex: "bg-[#F5F9FA]", // Premium soft pastel teal/blue
    imageUrl: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=1000", // Eco-friendly blocks
  }
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
                <span className="text-sm sm:text-base font-black uppercase tracking-wider text-pink-600 block">
                  {slide.badge.split(" ")[0]}{" "}
                  <span className="text-slate-900">{slide.badge.split(" ").slice(1).join(" ")}</span>
                </span>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.10]">
                  {slide.titleFirstLine} <br />
                  <span className="text-slate-800">{slide.titleSecondLine}</span>
                </h1>
                
                <Button 
                  className="rounded-full bg-orange-500 hover:bg-pink-600 text-white font-extrabold text-sm px-8 py-6 shadow-md active:scale-95 transition-all w-fit"
                >
                  {slide.buttonText}
                </Button>
              </div>

              {/* Graphical Circular Banner Element (Hidden on small mobile viewports) */}
              <div className="hidden md:block md:col-span-6 h-full relative z-10 animate-in fade-in zoom-in-95 duration-700">
                {/* The curved semi-circle layout clip matching the Shopus template style */}
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

      {/* Navigation Dot Indicators Layer matching Shopus design dots spacing exactly */}
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