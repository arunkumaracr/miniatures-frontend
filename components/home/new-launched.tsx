"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface NewLaunch {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string | null;
  createdAt: string;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function isYouTube(url: string) {
  return !!getYouTubeId(url);
}

function getThumbnail(url: string): string {
  const ytId = getYouTubeId(url);
  if (ytId) return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  // Cloudinary: swap the video resource path to a JPG still at second 0
  return url
    .replace("/video/upload/", "/video/upload/so_0,w_640,h_360,c_fill/")
    .replace(/\.(mp4|mov|webm|avi)$/i, ".jpg");
}

// ── Thumbnail card — with gradient fallback if image 404s ──────────────────
function VideoThumbnail({ item, onClick }: { item: NewLaunch; onClick: () => void }) {
  const [imgFailed, setImgFailed] = useState(false);
  const thumb = item.thumbnailUrl || getThumbnail(item.videoUrl);

  return (
    <button
      onClick={onClick}
      className="group flex-shrink-0 w-64 text-left focus:outline-none"
    >
      <div className="relative w-64 h-[180px] rounded-2xl overflow-hidden shadow-sm">
        {/* Image / fallback */}
        {!imgFailed ? (
          <img
            src={thumb}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <Play className="h-10 w-10 text-white/60" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors duration-300" />

        {/* NEW badge */}
        <span className="absolute top-3 left-3 bg-brand-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow">
          New
        </span>

        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 flex items-center justify-center shadow-lg transition-all duration-300">
            <Play className="h-5 w-5 text-brand-500 fill-brand-500 ml-0.5" />
          </div>
        </div>
      </div>

      {/* Title */}
      <p className="mt-3 text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-brand-600 transition-colors leading-snug">
        {item.title}
      </p>
    </button>
  );
}

// ── Main section ───────────────────────────────────────────────────────────
export function NewLaunched() {
  const [launches, setLaunches] = useState<NewLaunch[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState<NewLaunch | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/api/new-launches`)
      .then((r) => r.json())
      .then((d) => setLaunches(d.launches || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  }

  if (!loading && launches.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div className="space-y-1">
          <span className="text-xs font-black uppercase tracking-widest text-brand-500 bg-brand-50 px-3 py-1 rounded-full">
            Fresh Arrivals
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
            Newly Launched
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Watch our latest miniature collections in action
          </p>
        </div>

        {/* Scroll arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            className="h-9 w-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-brand-400 hover:text-brand-500 transition-colors shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="h-9 w-9 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:border-brand-400 hover:text-brand-500 transition-colors shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Horizontal scroll */}
      <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-none pb-2">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-64 h-[220px] bg-slate-100 rounded-2xl animate-pulse" />
            ))
          : launches.map((item) => (
              <VideoThumbnail key={item.id} item={item} onClick={() => setPlaying(item)} />
            ))}
      </div>

      {/* Video modal */}
      {playing && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPlaying(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPlaying(null)}
              className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className="aspect-video w-full">
              {isYouTube(playing.videoUrl) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(playing.videoUrl)}?autoplay=1`}
                  title={playing.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <video
                  src={playing.videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="px-5 py-4 bg-slate-900">
              <p className="text-white font-bold text-sm">{playing.title}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
