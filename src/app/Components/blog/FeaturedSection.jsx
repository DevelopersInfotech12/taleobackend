"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Reveal, Stagger, StaggerItem } from "../motion/Reveal";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const STATIC = [
  { id: 1, slug: "goldsmiths-bench", category: "Craftsmanship", title: "Inside a Goldsmith's Bench: 40 Years of Making by Hand", image: "https://images.unsplash.com/photo-1573408301185-9519f94815d4?w=500&q=80", accent: "#C9A84C" },
  { id: 2, slug: "paraiba-tourmaline", category: "Gemstones", title: "Paraíba Tourmaline: The Neon Blue Stone That Rewrote the Market", image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=500&q=80", accent: "#7AB8E8" },
  { id: 3, slug: "beyond-solitaire", category: "Bridal", title: "Beyond the Solitaire: Engagement Ring Styles for 2026", image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=500&q=80", accent: "#D4A8E8" },
  { id: 4, slug: "lab-grown-vs-mined", category: "Sustainability", title: "Lab-Grown vs Mined: An Honest Guide for Today's Buyer", image: "https://images.unsplash.com/photo-1616697538853-f0c57a59a468?w=500&q=80", accent: "#5AC87A" },
  { id: 5, slug: "art-deco-jewellery", category: "History", title: "Art Deco Jewellery: How the Jazz Age Shaped Modern Design", image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500&q=80", accent: "#E8D47A" },
  { id: 6, slug: "quiet-luxury", category: "Luxury Trends", title: "The Rise of Quiet Luxury: Jewellery Trends Defining Modern Elegance", image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca5?w=500&q=80", accent: "#D8B47A" },
];

export default function FeaturedSection() {
  const [blogs, setBlogs] = useState(STATIC);

  useEffect(() => {
    fetch(`${API}/blogs/published?limit=6`)
      .then(r => r.json())
      .then(d => {
        const list = d.data?.blogs ?? d.data ?? [];
        if (list.length) setBlogs(list.map((b, i) => ({
          id: b._id,
          slug: b.slug,
          category: b.tag || b.category || "",
          title: b.title,
          image: b.heroImg || b.img || b.image || STATIC[i % STATIC.length].image,
          accent: STATIC[i % STATIC.length].accent,
        })));
      })
      .catch(() => {});
  }, []);

  return (
    <section style={{ backgroundColor: "#F5F0E8", padding: "40px 24px 40px" }}>
      <Reveal style={{ marginBottom: "24px" }}>
        <p style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8942A", fontWeight: 600, margin: "0 0 6px" }}>From the Archive</p>
        <h2 style={{ fontFamily: "'Cormorant Garant', 'Georgia', serif", fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 600, color: "#2C2416", margin: 0, lineHeight: 1.1, letterSpacing: "-0.01em" }}>Stories Worth Keeping</h2>
      </Reveal>

      <Stagger style={{ display: "grid", gridAutoFlow: "column", gridAutoColumns: "clamp(150px, 40vw, 200px)", gap: "12px", overflowX: "auto", paddingBottom: "8px", msOverflowStyle: "none", scrollbarWidth: "none" }}>
        {blogs.map((item, i) => (
          <Link key={item.id} href={`/blog/${item.slug}`} style={{ textDecoration: "none" }}>
            <StaggerItem
              className="card-hover"
              style={{ border: "1px solid #DDD5C5", cursor: "pointer", position: "relative", minHeight: "clamp(230px, 45vw, 240px)", display: "flex", flexDirection: "column", justifyContent: "flex-end", transition: "border-color 0.3s, box-shadow 0.3s", overflow: "hidden" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = item.accent; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#DDD5C5"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div className="card-img" style={{ position: "absolute", inset: 0, backgroundImage: `url(${item.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,10,3,0.92) 0%, rgba(15,10,3,0.35) 55%, rgba(15,10,3,0.1) 100%)" }} />
              <div style={{ position: "absolute", top: "14px", left: "14px", zIndex: 1 }}>
                <span style={{ fontSize: "9px", fontFamily: "Inter, sans-serif", letterSpacing: "0.12em", textTransform: "uppercase", color: item.accent, fontWeight: 600, backgroundColor: "rgba(0,0,0,0.5)", padding: "3px 7px", backdropFilter: "blur(4px)" }}>{item.category}</span>
              </div>
              <div style={{ position: "relative", zIndex: 1, padding: "16px" }}>
                <h4 style={{ fontFamily: "'Cormorant Garant', 'Georgia', serif", fontSize: "17px", fontWeight: 600, color: "#F5E6C8", margin: "0 0 8px", lineHeight: 1.3 }}>{item.title}</h4>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, ${item.accent}, transparent)`, opacity: 0.8 }} />
            </StaggerItem>
          </Link>
        ))}
      </Stagger>

      {/* Newsletter bar */}
      <Reveal style={{ marginTop: "48px", border: "1px solid var(--border-color)", padding: "clamp(18px, 4vw, 32px)", display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "var(--cream-dk)", flexWrap: "wrap", gap: 16 }}>
        <div style={{ flex: "1 1 240px", minWidth: 0 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "24px", fontWeight: 600, color: "var(--text)", margin: "0 0 4px" }}>The Taleo Letter</h3>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 600, color: "#7A6548", margin: 0 }}>Discover new collections, rare gemstones, and the stories behind our craftsmanship — delivered fortnightly.</p>
        </div>
        <div style={{ display: "flex", gap: 0, flex: "1 1 280px", minWidth: 0 }}>
          <input type="email" placeholder="your@email.com" style={{ backgroundColor: "var(--cream)", border: "1px solid var(--border-color)", borderRight: "none", color: "var(--text)", padding: "10px 16px", fontSize: "13px", fontFamily: "Inter, sans-serif", flex: "1 1 auto", minWidth: 0, outline: "none" }} />
          <button style={{ backgroundColor: "#B8942A", border: "none", color: "#FAFAF8", padding: "10px 20px", fontSize: "11px", fontFamily: "Inter, sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>Subscribe</button>
        </div>
      </Reveal>
    </section>
  );
}