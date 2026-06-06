// components/category/category.tsx
import Link from "next/link";
import { fetchCategories } from "../../lib/api";
import {
  Gamepad2, Boxes, Paintbrush, Rocket, Car,
  Baby, Puzzle, Star, Zap, Globe,
} from "lucide-react";

// Map icon string names from DB to Lucide components
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Boxes,
  Rocket,
  Gamepad2,
  Car,
  Paintbrush,
  Baby,
  Puzzle,
  Star,
  Zap,
  Globe,
  grid: Boxes, // fallback for "all"
};

export async function CategoryShowcase() {
  const data = await fetchCategories();
  const categories = data.categories || [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Our Categories
        </h2>
        <Link
          href="/categories"
          className="text-xs sm:text-sm font-bold text-slate-500 hover:text-pink-500 transition-colors duration-200"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((item: any) => {
          const IconComponent = ICON_MAP[item.icon] || Boxes;
          return (
            <Link
              key={item.id}
              href={`/categories/${item.slug || item.id}`}
              className="group flex flex-col items-center justify-center text-center p-5 rounded-xl bg-[#FDF2F8]/60 border border-pink-50/50 hover:bg-[#FDF2F8] hover:border-pink-300/60 transition-all duration-300 hover:shadow-md aspect-square"
            >
              <div className="p-3 bg-white rounded-full text-pink-500 shadow-sm border border-pink-100/40 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <IconComponent className="h-7 w-7 stroke-[1.75]" />
              </div>
              <span className="mt-4 text-xs sm:text-sm font-black text-slate-800 tracking-tight group-hover:text-pink-600 transition-colors duration-200 line-clamp-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}