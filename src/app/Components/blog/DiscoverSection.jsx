"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Reveal, RevealScale, Stagger, StaggerItem } from "../motion/Reveal";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

const STATIC_BLOGS = [
  { id: 1, slug: "eternal-collection", tag: "Collection Guide", title: "The Eternal Collection", subtitle: "Heirloom Diamonds for Every Generation", image: "https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=900&q=80" },
  { id: 2, slug: "filigree", tag: "Behind the Craft", title: "Filigree", subtitle: "The Ancient Wire-Work Art Still Alive in Portugal", image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80" },
  { id: 3, slug: "pearl-grading", tag: "Buying Guide", title: "Pearl Grading", subtitle: "Akoya, Freshwater, South Sea — What the Labels Mean", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80" },
  { id: 4, slug: "the-goldsmith", tag: "Interview", title: "The Goldsmith", subtitle: "Talking Tradition with Mumbai's Last Koftigars", image: "https://images.unsplash.com/photo-1573408301185-9519f94815d4?w=600&q=80" },
  { id: 5, slug: "sapphire-origins", tag: "Gem Guide", title: "Sapphire Origins", subtitle: "Kashmir, Ceylon, Madagascar — Does Source Matter?", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80" },
];

function Card({ item, big = false }) {
  return (
    <Link href={`/blog/${item.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <RevealScale
        className="card-hover"
        style={{
          position: "relative", overflow: "hidden", cursor: "pointer",
          minHeight: big ? "clamp(360px, 45vw, 380px)" : "clamp(168px, 22vw, 180px)",
          border: "1px solid var(--border-color)",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#B8942A"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(0,0,0,0.12)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-color)"; e.currentTarget.style.boxShadow = "none"; }}
      >
        <div className="card-img" style={{ position: "absolute", inset: 0, backgroundImage: `url(${item.image})`, backgroundSize: "cover", backgroundPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,7,2,0.22) 0%, rgba(10,7,2,0.60) 55%, rgba(10,7,2,0.92) 100%)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "clamp(12px, 2.5vw, 18px) clamp(14px, 3vw, 20px)" }}>
          <span style={{ fontSize: "9px", fontFamily: "Inter, sans-serif", letterSpacing: "0.14em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, backgroundColor: "rgba(0,0,0,0.45)", padding: "4px 8px", display: "inline-block", backdropFilter: "blur(4px)" }}>{item.tag}</span>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 1, padding: "0 clamp(14px, 3vw, 20px) clamp(14px, 3vw, 20px)" }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: big ? "clamp(20px, 5vw, 28px)" : "clamp(15px, 4vw, 18px)", fontWeight: 600, color: "#F5E6C8", margin: "0 0 5px", lineHeight: 1.2 }}>{item.title}</h3>
          <p style={{ fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#ccc", margin: 0, lineHeight: 1.5 }}>{item.subtitle}</p>
        </div>
      </RevealScale>
    </Link>
  );
}

export default function DiscoverSection() {
  const [blogs, setBlogs] = useState(STATIC_BLOGS);

  useEffect(() => {
     fetch(`${API}/blogs/published?limit=5`)
      .then(r => r.json())
      .then(d => {
        const list = d.data?.blogs ?? d.data ?? [];
        if (list.length) setBlogs(list.map(b => ({
          id: b._id,
          slug: b.slug,
          tag: b.tag || b.category || "",
          title: b.title,
          subtitle: b.excerpt || b.subtitle || "",
          image: b.heroImg || b.img || b.image || "",
        })));
      })
      .catch(() => {}); // fallback to static
  }, []);

  const [main, ...rest] = blogs;

  return (
    <section style={{ backgroundColor: "var(--cream)", padding: "0 24px 60px" }}>
      <Reveal style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "10px 24px", marginBottom: "20px", paddingTop: "40px" }}>
        <div>
          <p style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", letterSpacing: "0.14em", textTransform: "uppercase", color: "#B8942A", fontWeight: 600, margin: "0 0 6px" }}>For You</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(24px, 6vw, 32px)", fontWeight: 600, color: "var(--text)", margin: 0, lineHeight: 1.1 }}>Discover Our Jewellery Universe</h2>
        </div>
        <a href="/blog" style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: "#B8942A", textDecoration: "none", borderBottom: "1px solid #B8942A", paddingBottom: "2px", whiteSpace: "nowrap" }}>View All</a>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
        <Reveal><Card item={main} big /></Reveal>
        <Stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: "12px" }}>
          {rest.map(item => <StaggerItem key={item.id}><Card item={item} /></StaggerItem>)}
        </Stagger>
      </div>
    </section>
  );
}