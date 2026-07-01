// app/page.tsx
import { Navbar } from "@/components/common/Navbar";
import { HeroSlider } from "@/components/hero/hero-slider";
import { NewLaunched } from "@/components/home/new-launched";
import { CategoryShowcase } from "@/components/category/category";
// import { PromoBanners } from "@/components/promotion/promo-banners";
import { TopSelling } from "@/components/top-selling";
import { Footer } from "@/components/common/Footer";
import { HomeClient } from "@/components/home-client";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50/40">
      <Navbar />
      <HeroSlider />
      <CategoryShowcase />
      {/* <PromoBanners /> */}
      <TopSelling />
      <NewLaunched />
      <HomeClient />
      <Footer />
    </div>
  );
}