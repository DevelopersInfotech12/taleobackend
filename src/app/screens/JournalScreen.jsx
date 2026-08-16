"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import OtherHero from "../Components/OtherHero";
import { Reveal, RevealImage, Stagger, StaggerItem } from "../Components/motion/Reveal";

const categories = ["All", "Jewellery Care", "Style Guide", "Behind the Craft", "Gifting", "Stories"];

const articles = [
  { id: 1, cat: "Behind the Craft", title: "Inside the Atelier: How a Ring is Born", excerpt: "From sketch to satin box — a rare look inside our Mumbai workshop where 23 artisans breathe life into gold.", img: "https://images.unsplash.com/photo-1573408301185-9519f94a74a9?w=700&q=80&fit=crop", date: "15 Jan 2025", readTime: "6 min read" },
  { id: 2, cat: "Style Guide", title: "Layering Necklaces: The Luxéor Method", excerpt: "Three lengths, two textures, one rule: let the skin show. Our guide to stacking that feels effortless, not accidental.", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=80&fit=crop", date: "08 Jan 2025", readTime: "4 min read" },
  { id: 3, cat: "Jewellery Care", title: "How to Keep Your Gold Radiant for Decades", excerpt: "Gold doesn't tarnish — but it does dull. Our goldsmith shares the five habits that preserve your pieces across generations.", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=80&fit=crop", date: "02 Jan 2025", readTime: "5 min read" },
  { id: 4, cat: "Gifting", title: "The Art of Gifting Jewellery", excerpt: "A ring says something a bouquet cannot. Our guide to choosing a piece that communicates exactly what you mean.", img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700&q=80&fit=crop", date: "24 Dec 2024", readTime: "4 min read" },
  { id: 5, cat: "Stories", title: "The Bride Who Designed Her Own Bridal Set", excerpt: "Priya came to us with a sketch on a napkin. Eight weeks later, she wore a piece that will outlast her wedding album.", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=80&fit=crop", date: "18 Dec 2024", readTime: "7 min read" },
  { id: 6, cat: "Behind the Craft", title: "The 47-Point Inspection: Nothing Leaves Without It", excerpt: "Before any Luxéor piece is packaged, it passes 47 quality checks. Our quality director walks us through each one.", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=80&fit=crop", date: "10 Dec 2024", readTime: "5 min read" },
  { id: 7, cat: "Style Guide", title: "Earrings for Every Face Shape", excerpt: "The right earring is the one that makes you forget you're wearing it. A shape-by-shape guide from our design team.", img: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=700&q=80&fit=crop", date: "03 Dec 2024", readTime: "4 min read" },
  { id: 8, cat: "Jewellery Care", title: "Gemstone Care: A Stone-by-Stone Guide", excerpt: "Diamonds, rubies, emeralds — each demands a different care routine. Our gemologist explains what most people get wrong.", img: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=700&q=80&fit=crop", date: "25 Nov 2024", readTime: "6 min read" },
  { id: 9, cat: "Gifting", title: "Jewellery for Him: Breaking the Last Taboo", excerpt: "Men have worn gold for 5,000 years. Our edit of understated pieces for the man who wears intention, not ornament.", img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=700&q=80&fit=crop", date: "18 Nov 2024", readTime: "4 min read" },
];

export default function JournalScreen() {
  const [activeCat, setActiveCat] = useState("All");
  const filtered = activeCat === "All" ? articles : articles.filter(a => a.cat === activeCat);
  const [featured, ...rest] = filtered;

  return (
    <div>
      <Navbar />
      <OtherHero
        title="Journal"
        subtitle="Stories from the atelier and beyond"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Journal" }]}
        desktopImages={[
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&fit=crop",
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80&fit=crop",
          "https://images.unsplash.com/photo-1573408301185-9519f94a74a9?w=1600&q=80&fit=crop",
        ]}
        mobileImages={[
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1573408301185-9519f94a74a9?w=800&q=80&fit=crop&crop=center",
        ]}
      />

      <section className="bg-[#f5efe8] py-20">
        <div className="max-w-[1200px] mx-auto px-6">

          {/* Category Filter */}
          <Reveal className="flex flex-wrap gap-3 justify-center mb-14">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`font-[family-name:var(--font-jost)] px-5 py-2 rounded-full border transition-all duration-200 ${
                  activeCat === c
                    ? "bg-[#b08850] border-[#b08850] text-white"
                    : "bg-transparent border-[#b08850]/25 text-[#2a1a0e]/60 hover:border-[#b08850]/60 hover:text-[#2a1a0e]"
                }`}
                style={{ fontSize: "12px", letterSpacing: "0.05em", fontWeight: activeCat === c ? 600 : 400 }}
              >
                {c}
              </button>
            ))}
          </Reveal>

          {/* Featured Article */}
          {featured && (
            <Reveal className="mb-12 bg-white rounded-2xl overflow-hidden border border-[#b08850]/10 hover-lift">
              <div className="grid md:grid-cols-2">
                <RevealImage>
                  <img src={featured.img} alt={featured.title} className="w-full object-cover" style={{ height: "420px" }} />
                </RevealImage>
                <div className="p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-[family-name:var(--font-jost)] text-[#b08850] uppercase" style={{ fontSize: "10px", letterSpacing: "0.3em", fontWeight: 600 }}>{featured.cat}</span>
                    <span className="w-1 h-1 rounded-full bg-[#b08850]/40" />
                    <span className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/40" style={{ fontSize: "11px" }}>Featured</span>
                  </div>
                  <h2 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-4" style={{ fontSize: "28px", fontWeight: 700, lineHeight: 1.25 }}>
                    {featured.title}
                  </h2>
                  <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/55 leading-[1.8] mb-6" style={{ fontSize: "14px" }}>
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/35" style={{ fontSize: "12px" }}>{featured.date} · {featured.readTime}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          )}

          {/* Article Grid */}
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map(a => (
              <StaggerItem key={a.id} className="bg-white rounded-xl overflow-hidden border border-[#b08850]/10 hover-lift flex flex-col">
                <RevealImage>
                  <img src={a.img} alt={a.title} className="w-full object-cover" style={{ height: "220px" }} />
                </RevealImage>
                <div className="p-6 flex flex-col flex-1">
                  <span className="font-[family-name:var(--font-jost)] text-[#b08850] uppercase mb-3 inline-block" style={{ fontSize: "10px", letterSpacing: "0.3em", fontWeight: 600 }}>
                    {a.cat}
                  </span>
                  <h3 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-3 flex-1" style={{ fontSize: "17px", fontWeight: 600, lineHeight: 1.35 }}>
                    {a.title}
                  </h3>
                  <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/50 leading-[1.75] mb-4" style={{ fontSize: "13px" }}>
                    {a.excerpt}
                  </p>
                  <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/30 mt-auto" style={{ fontSize: "11.5px" }}>
                    {a.date} · {a.readTime}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

        </div>
      </section>

      <Footer />
    </div>
  );
}
