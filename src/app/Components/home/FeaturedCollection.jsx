"use client";

import { useState, useEffect } from "react";
import { fetchFeaturedProducts, normaliseProduct } from "../../lib/api";
import ProductCard from "../shop/ProductCard";
import { Reveal, RevealSide, Stagger, StaggerItem } from "../motion/Reveal";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'Inter', sans-serif";

// ── Fallback hardcoded products (shown if API returns empty) ──────────────────
const FALLBACK_PRODUCTS = [
  {
    _id: "f1",
    slug: "royal-heritage-necklace",
    name: "Royal Heritage Necklace",
    category: { name: "22K Gold · Necklace" },
    description: "An heirloom-grade piece crafted by hand in small batches — made to be worn and remembered.",
    price: 45999,
    comparePrice: 52999,
    avgRating: 4.9,
    reviewCount: 124,
    isNewArrival: true,
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80"],
  },
  {
    _id: "f2",
    slug: "temple-drop-earrings",
    name: "Temple Drop Earrings",
    category: { name: "22K Gold · Earrings" },
    description: "Intricately carved temple motifs suspended in warm gold — a quiet statement for every occasion.",
    price: 18999,
    comparePrice: 22999,
    avgRating: 4.8,
    reviewCount: 87,
    isBestseller: true,
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80"],
  },
  {
    _id: "f3",
    slug: "celestial-bangle-set",
    name: "Celestial Bangle Set",
    category: { name: "22K Gold · Bangles" },
    description: "A set of three hand-finished bangles etched with celestial patterns — lightweight yet rich.",
    price: 34500,
    comparePrice: null,
    avgRating: 4.7,
    reviewCount: 56,
    isNewArrival: true,
    images: ["https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80"],
  },
  {
    _id: "f4",
    slug: "kundan-cocktail-ring",
    name: "Kundan Cocktail Ring",
    category: { name: "22K Gold · Rings" },
    description: "Bold Kundan-set stone framed in hand-beaten gold — a centrepiece for any celebration.",
    price: 27999,
    comparePrice: 31999,
    avgRating: 4.6,
    reviewCount: 43,
    isBestseller: true,
    images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80"],
  },
];

export default function FeaturedCollection() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS.map(normaliseProduct));

  useEffect(() => {
    fetchFeaturedProducts(4).then((raw) => {
      if (raw.length > 0) {
        setProducts(raw.map(normaliseProduct));
      }
    });
  }, []);

  return (
    <section className="w-full px-4 sm:px-6 lg:px-10 py-12 bg-[#faf7f2] dark:bg-[#150f0a] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <RevealSide from="left">
            <div className="flex items-center gap-3 mb-1">
              <span style={{ display: "block", width: 24, height: 1 }} className="bg-[#a67c2e] dark:bg-[#c9a96e]" />
              <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase" }} className="text-[#a67c2e] dark:text-[#c9a96e]">
                Featured Collection
              </span>
            </div>
            <h1 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem, 3.5vw, 3.5rem)", fontWeight: 600, lineHeight: 1.1, margin: 0 }} className="text-[#2c2c2c] dark:text-[#e8d9c4]">
              Sculpted in warmth.
            </h1>
            <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem, 3.5vw, 3.5rem)", fontWeight: 400, fontStyle: "italic", margin: 0, lineHeight: 1.1 }} className="text-[#a67c2e] dark:text-[#c9a96e]">
              Worn like a secret.
            </h2>
            <p style={{ fontFamily: BODY, fontSize: 13, lineHeight: 1.7, marginTop: 12, maxWidth: 360, fontWeight: 400 }} className="text-[#6b5d44] dark:text-[#7e6c4d]">
              Heirloom-grade pieces, each made by hand in small batches.
            </p>
          </RevealSide>

          <RevealSide from="right" delay={0.1} className="self-start sm:self-auto flex flex-col items-start sm:items-end gap-5 shrink-0">
            <div className="flex items-center gap-6">
              {[{ value: "22k", label: "Gold Standard" }, { value: "40+", label: "Artisans" }, { value: "100%", label: "Handcrafted" }].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-0.5">
                  <span style={{ fontFamily: BODY, fontSize: 22, fontWeight: 600, letterSpacing: "0.1em" }} className="text-[#a67c2e] dark:text-[#c9a96e]">{s.value}</span>
                  <span style={{ fontFamily: BODY, fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 400 }} className="text-[#a67c2e] dark:text-[#c9a96e]">{s.label}</span>
                </div>
              ))}
            </div>

            <a
              href="/shop"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all hover:brightness-110 whitespace-nowrap border border-[#d8cdb8] dark:border-[#3d3020] text-[#a67c2e] dark:text-[#c9a96e]"
              style={{ fontFamily: BODY, fontSize: 13, fontWeight: 400, background: "transparent", textDecoration: "none" }}
            >
              View full collection
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </a>
          </RevealSide>
        </div>

        {/* ── Grid ── */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
          {products.map((p) => (
            <StaggerItem key={p.id}>
              <ProductCard
                id={p.id}
                slug={p.slug}
                name={p.name}
                category={p.category}
                description={p.description}
                price={p.price}
                originalPrice={p.originalPrice}
                rating={p.rating}
                reviews={p.reviews}
                badge={p.badge}
                badgeColor={p.badgeColor}
                image={p.image}
                images={p.images}
                variants={p.variants}
              />
            </StaggerItem>
          ))}
        </Stagger>

      </div>
    </section>
  );
}