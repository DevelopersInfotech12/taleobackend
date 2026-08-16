"use client";   // ← ADD THIS LINE

import HeroBanner          from "../Components/home/HeroBanner";
import TrustBar            from "../Components/home/TrustBar";
import ShopByCategory      from "../Components/home/ShopByCategory";
import MasterCrafted        from "../Components/home/MasterCrafted";
import BannerAdd           from "../Components/home/BannerAdd";
import FeaturedCollection  from "../Components/home/FeaturedCollection";
import NewCollectionBanner from "../Components/home/NewCollectionBanner";
import InfoPanels          from "../Components/home/InfoPanels";
import BlogSection         from "../Components/home/BlogSection";
import TestimonialsSection from "../Components/home/TestimonialsSection";
import InstagramSlider     from "../Components/home/InstagramSlider";
import NewsletterBar       from "../Components/home/NewsletterBar";
import Faq from "../Components/home/Faq";

export default function HomeScreen() {
  return (
    <main className="overflow-hidden">
      {/* 1 — Full-viewport dark hero */}
      <HeroBanner />

      {/* 2 — Trust badges strip */}
      {/* <TrustBar /> */}

      {/* 3 — Shop by Category 5-col grid */}
      <ShopByCategory />

      <MasterCrafted />

      {/* 4 — Featured Collection (left text + right 4 products) */}
      <FeaturedCollection />

      <BannerAdd/>

      {/* 5 — New Collection split banner */}
      <NewCollectionBanner />

      {/* 6 — 3 dark info panels (Craft / Diamonds / Experience) */}
      <InfoPanels />

      {/* 7 — Blog section: 3 journal posts */}
      <BlogSection />

      {/* 8 — Customer Testimonials */}
      <TestimonialsSection />

      {/* 9 — Instagram photo slider */}
      <InstagramSlider />

     <Faq/>

      {/* 10 — Newsletter subscribe bar */}
      <NewsletterBar />
    </main>
  );
}
