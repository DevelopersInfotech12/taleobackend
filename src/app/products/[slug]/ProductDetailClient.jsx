"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fmtPrice } from "../../lib/api";
import { useCart } from "../../lib/CartContext";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import ProductCard from "@/app/Components/shop/ProductCard";

/* ── palette ───────────────────────────────── */
const G = "#b08850";
const GLT = "#c9a96e";
const BR = "#1a0c06";
const BRM = "#3d1f10";
const CR = "#f5efe8";
const CRD = "#ede4d8";
const BD = "#e8ddd0";
const TX = "#2c2418";
const MT = "#8a7560";

/* ── Stars ──────────────────────────────────── */
function Stars({ value, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12"
          fill={i < Math.round(value) ? GLT : BD}>
          <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9.2,11 6,9.2 2.8,11 3.5,7.5 1,5 4.5,4.5" />
        </svg>
      ))}
    </div>
  );
}

/* ── Gallery ────────────────────────────────── */
function Gallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  return (
    <>
      <div className="flex gap-4">
        {/* Thumbs */}
        <div className="hidden md:flex flex-col gap-3 w-[72px] shrink-0">
          {images.map((src, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="relative aspect-square rounded-xl overflow-hidden border-2 transition-all"
              style={{ borderColor: i === active ? G : BD }}>
              <Image src={src} alt="" fill className="object-cover" sizes="72px" />
            </button>
          ))}
        </div>
        {/* Main */}
        <div className="flex-1">
          <div className="relative overflow-hidden cursor-zoom-in rounded-3xl"
            style={{ aspectRatio: "4/5", background: CRD }}
            onClick={() => setZoom(true)}>
            <Image src={images[active]} alt={name} fill priority
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw" />
            {/* bottom gradient */}
            <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{ background: "linear-gradient(to top, rgba(26,12,6,0.4), transparent)" }} />
            <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-[10px] tracking-wider uppercase"
              style={{ background: "rgba(26,12,6,0.65)", color: "#d4b896", fontFamily: "var(--font-jost)", letterSpacing: "0.1em" }}>
              Click to zoom
            </span>
          </div>
          {/* Mobile thumbs */}
          <div className="flex md:hidden gap-2 mt-3">
            {images.map((src, i) => (
              <button key={i} onClick={() => setActive(i)}
                className="relative w-16 aspect-square rounded-xl overflow-hidden border-2 transition-all"
                style={{ borderColor: i === active ? G : BD }}>
                <Image src={src} alt="" fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-3 mt-5">
        {[{ icon: "✦", label: "BIS Hallmarked" }, { icon: "↺", label: "7-Day Exchange" }, { icon: "⛨", label: "Lifetime Warranty" }].map((b) => (
          <div key={b.label} className="flex flex-col items-center gap-2 py-4 rounded-2xl"
            style={{ border: `1.5px solid ${BD}`, background: "#fff" }}>
            <span style={{ color: G, fontSize: 18 }}>{b.icon}</span>
            <span style={{ fontSize: 12, color: MT, textAlign: "center", lineHeight: 1.4, fontWeight: "600" }}>{b.label}</span>
          </div>
        ))}
      </div>
      {/* Zoom modal */}
      {zoom && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: "rgba(0,0,0,0.88)" }} onClick={() => setZoom(false)}>
          <button className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.12)", color: "#fff", fontSize: 20 }}>✕</button>
          <div className="relative w-full max-w-2xl aspect-square">
            <Image src={images[active]} alt={name} fill className="object-contain" />
          </div>
        </div>
      )}
    </>
  );
}

/* ── REVIEWS ─────────────────────────────── */
const SAMPLE_REVIEWS = [
  { name: "Ananya Sharma", rating: 5, date: "2 weeks ago", title: "Absolutely stunning piece", body: "The craftsmanship exceeded my expectations. The stone catches light beautifully and the finish feels premium. Packaging was elegant too.", verified: true },
  { name: "Rohit Mehta", rating: 5, date: "1 month ago", title: "Perfect anniversary gift", body: "Bought this for my wife's anniversary. She loved it! Sizing was accurate and delivery was faster than expected.", verified: true },
  { name: "Priya Nair", rating: 4, date: "1 month ago", title: "Beautiful, slightly heavier than expected", body: "Gorgeous design and the gold tone is rich. Slightly heavier than I imagined from photos — but that just feels substantial and well made.", verified: true },
  { name: "Karan Verma", rating: 5, date: "2 months ago", title: "Exceeded expectations", body: "The hallmark certification gave me confidence. Customer service was responsive when I asked about resizing. Highly recommend!", verified: false },
];
const RATING_DIST = [{ stars: 5, pct: 68 }, { stars: 4, pct: 22 }, { stars: 3, pct: 7 }, { stars: 2, pct: 2 }, { stars: 1, pct: 1 }];
const TABS = ["Description", "Specifications", "Shipping & Returns", "Reviews"];

/* ═══════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════ */
export default function ProductDetailClient({ product, relatedProducts = [] }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const p = product;
  const images = p.images?.length ? p.images : [p.image].filter(Boolean);

  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedVariant, setVariant] = useState(p.variants?.[0] ?? null);
  const [selectedSize, setSize] = useState(null);
  const [tab, setTab] = useState("Description");
  const [wishlist, setWishlist] = useState(false);

  const discount = p.originalPrice
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;

  const isRing = (p.category || "").toLowerCase().includes("ring");
  const SIZES = ["12", "13", "14", "15", "16", "17", "18", "19", "20"];

  const handleAdd = () => {
    addToCart(p, { variant: selectedVariant || "", size: selectedSize || "", qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };
  const handleBuyNow = () => {
    addToCart(p, { variant: selectedVariant || "", size: selectedSize || "", qty });
    router.push("/checkout");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: CR, paddingTop: 114 }}>

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
          <nav style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: MT }}>
            <Link href="/" style={{ color: MT }}>Home</Link><span className="mx-2">›</span>
            <Link href="/shop" style={{ color: MT }}>Shop</Link>
            {p.category && (<><span className="mx-2">›</span><Link href={`/shop?category=${encodeURIComponent(p.category)}`} style={{ color: MT }}>{p.category}</Link></>)}
            <span className="mx-2">›</span>
            <span style={{ color: TX }}>{p.name}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

            {/* ── LEFT: Gallery ── */}
            <div style={{ animation: "fadeUp 0.7s ease both" }}>
              <Gallery images={images} name={p.name} />
            </div>

            {/* ── RIGHT: Info ── */}
            <div className="flex flex-col gap-5" style={{ animation: "fadeUp 0.7s 0.15s ease both" }}>

              {/* Category + badge */}
              <div className="flex items-center gap-3">
                {p.category && (
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: G }}>
                    {p.category}
                  </span>
                )}
                {p.badge && (
                  <span className="px-2.5 py-0.5 rounded-full border"
                    style={{
                      fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.1em",
                      color: p.badgeColor || GLT, borderColor: (p.badgeColor || GLT) + "55",
                      background: "rgba(0,0,0,0.03)"
                    }}>
                    {p.badge}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)", fontWeight: 600, color: TX, lineHeight: 1.1, margin: 0 }}>
                {p.name}
              </h1>

              {/* Rating + stock */}
              <div className="flex items-center gap-3 flex-wrap">
                <Stars value={p.rating} />
                <span style={{ fontSize: 13, color: G, fontWeight: 600 }}>{p.rating}</span>
                <a href="#reviews" style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: MT, textDecoration: "underline", textUnderlineOffset: 3 }}>
                  ({p.reviews} reviews)
                </a>
                <span style={{ width: 1, height: 14, background: BD, display: "inline-block" }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: p.stock === 0 ? "#c0392b" : "#2d6a4f" }}>
                  {p.stock === 0 ? "Out of Stock" : "In Stock"}
                </span>
              </div>

              <div style={{ borderTop: `1px solid ${BD}` }} />

              {/* Price */}
              <div className="flex items-baseline gap-3 flex-wrap">
                <span style={{ fontSize: 34, fontWeight: 700, color: TX, lineHeight: 1 }}>{fmtPrice(p.price)}</span>
                {p.originalPrice && (
                  <>
                    <span style={{ fontSize: 18, color: "#a08060", textDecoration: "line-through" }}>{fmtPrice(p.originalPrice)}</span>
                    <span className="rounded-full px-3 py-1 font-poppins"
                      style={{ fontSize: 11, fontWeight: 600, background: BRM, color: GLT }}>
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: MT }}>
                Incl. of all taxes · EMI from {fmtPrice(Math.round(p.price / 12))}/mo
              </p>

              {/* Short description */}
              {p.description && (
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#584e42", fontWeight: 500 }}>{p.description}</p>
              )}

              {/* Variants */}
              {p.variants?.length > 0 && (
                <div>
                  <p className="mb-2.5" style={{ fontFamily: "var(--font-jost)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: MT }}>
                    Metal — <strong style={{ color: TX, textTransform: "none", letterSpacing: 0 }}>{selectedVariant}</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.variants.map((v) => (
                      <button key={v} onClick={() => setVariant(v)}
                        className="px-4 py-2 rounded-full text-sm border transition-all duration-200"
                        style={{
                          fontFamily: "var(--font-jost)", fontWeight: 500,
                          background: selectedVariant === v ? BRM : "transparent",
                          color: selectedVariant === v ? GLT : "#5a4030",
                          borderColor: selectedVariant === v ? BRM : BD,
                        }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SIZE + QTY + WISHLIST on ONE ROW ── */}
              {isRing && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: MT }}>
                      Ring Size {selectedSize && `— ${selectedSize}`}
                    </p>
                    <button style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: G, textDecoration: "underline", textUnderlineOffset: 3 }}>
                      Size Guide
                    </button>
                  </div>

                  {/* Size buttons + divider + qty + wishlist — ALL ONE ROW */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {SIZES.map((s) => (
                      <button key={s} onClick={() => setSize(s)}
                        className="w-10 h-10 rounded-full border text-sm transition-all duration-200 font-medium flex items-center justify-center"
                        style={{
                          fontFamily: "var(--font-jost)",
                          background: selectedSize === s ? BRM : "#fff",
                          color: selectedSize === s ? GLT : "#5a4030",
                          borderColor: selectedSize === s ? BRM : BD,
                        }}>
                        {s}
                      </button>
                    ))}

                    {/* vertical divider */}
                    <span className="h-10 w-px mx-1" style={{ background: BD }} />

                    {/* Wishlist */}
                    <button onClick={() => setWishlist((w) => !w)}
                      className="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
                      style={{ borderColor: wishlist ? G : BD, background: wishlist ? "#fdf6ef" : "#fff" }}
                      aria-label="Wishlist">
                      <svg width="16" height="16" viewBox="0 0 24 22"
                        fill={wishlist ? G : "none"} stroke={wishlist ? G : MT} strokeWidth="2">
                        <path d="M12 21C12 21 2 13.5 2 7a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 6.5-10 14-10 14z" />
                      </svg>
                    </button>

                  </div>
                </div>
              )}

              {/* Non-ring: qty + wishlist row */}
              {!isRing && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border overflow-hidden" style={{ borderColor: BD }}>
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-9 h-10 flex items-center justify-center hover:bg-[#f0e9df] transition-colors"
                      style={{ color: BRM, fontSize: 18 }}>−</button>
                    <span className="w-7 text-center text-sm font-semibold" style={{ fontFamily: "var(--font-jost)", color: TX }}>{qty}</span>
                    <button onClick={() => setQty((q) => q + 1)}
                      className="w-9 h-10 flex items-center justify-center hover:bg-[#f0e9df] transition-colors"
                      style={{ color: BRM, fontSize: 18 }}>+</button>
                  </div>
                  <button onClick={() => setWishlist((w) => !w)}
                    className="w-10 h-10 rounded-full border flex items-center justify-center transition-all"
                    style={{ borderColor: wishlist ? G : BD, background: wishlist ? "#fdf6ef" : "#fff" }}>
                    <svg width="16" height="16" viewBox="0 0 24 22"
                      fill={wishlist ? G : "none"} stroke={wishlist ? G : MT} strokeWidth="2">
                      <path d="M12 21C12 21 2 13.5 2 7a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 6.5-10 14-10 14z" />
                    </svg>
                  </button>
                </div>
              )}

              {/* ── ADD TO CART + BUY NOW — ONE ROW ── */}
              <div className="flex gap-3">
                <button onClick={handleAdd} disabled={p.stock === 0}
                  className="flex-1 py-3 rounded-full flex items-center justify-center gap-2 font-semibold text-[15px] transition-all duration-300 active:scale-95 hover:brightness-110"
                  style={{
                    letterSpacing: "0.08em",
                    background: p.stock === 0 ? CRD : added
                      ? "linear-gradient(135deg, #1a5c3a, #2d6a4f)"
                      : `linear-gradient(135deg, ${BRM} 0%, #5a2e16 100%)`,
                    color: p.stock === 0 ? MT : added ? "#fff" : GLT,
                    cursor: p.stock === 0 ? "not-allowed" : "pointer",
                    boxShadow: p.stock === 0 ? "none" : "0 4px 20px rgba(61,31,16,0.28)",
                  }}>
                  {p.stock === 0 ? "Out of Stock" : added ? (
                    <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12" /></svg> Added!</>
                  ) : (
                    <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg> Add to Bag</>
                  )}
                </button>

                <button onClick={handleBuyNow} disabled={p.stock === 0}
                  className="flex-1 py-3 rounded-full flex items-center justify-center gap-2 font-semibold text-[15px] transition-all duration-300 active:scale-95 hover:bg-[#3d1f10] hover:text-[#c9a96e] hover:border-[#3d1f10]"
                  style={{
                    letterSpacing: "0.08em",
                    color: BRM, border: `2px solid ${BRM}`, background: "transparent",
                    cursor: p.stock === 0 ? "not-allowed" : "pointer",
                    opacity: p.stock === 0 ? 0.4 : 1,
                  }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  Buy Now
                </button>
              </div>

              {/* Service icons */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl items-center" style={{ background: "#fff", border: `1.5px solid ${BD}` }}>
                {[{ icon: "🚚", label: "Free Shipping" }, { icon: "🔒", label: "Secure Payment" }, { icon: "🎁", label: "Gift Wrapping" }].map((s) => (
                  <div key={s.label} className="flex items-center justify-center gap-2 h-full">
                    <span style={{ fontSize: 16, lineHeight: 1 }}>{s.icon}</span>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: 11.5, color: MT, fontWeight: 500, lineHeight: 1 }}>{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Share */}
              <div className="flex items-center gap-3">
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: MT }}>Share:</span>
                {["f", "𝕏", "in", "✉"].map((s) => (
                  <button key={s} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f0e8dc] transition-colors"
                    style={{ border: `1px solid ${BD}`, fontFamily: "var(--font-jost)", fontSize: 12, color: MT }}>{s}</button>
                ))}
              </div>
            </div>
          </div>

          {/* ── TABS ── */}
          <div className="mt-16">
            <div className="flex gap-0 overflow-x-auto" style={{ borderBottom: `1px solid ${BD}` }}>
              {TABS.map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className="relative pb-4 px-6 whitespace-nowrap transition-colors "
                  style={{
                    fontFamily: "serif",
                    fontSize: 11.5, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    color: tab === t ? TX : MT,
                  }}>
                  {t}{t === "Reviews" && ` (${p.reviews || 0})`}
                  {tab === t && <span className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: G }} />}
                </button>
              ))}
            </div>

            <div className="py-10">
              {tab === "Description" && (
                <div className="max-w-3xl">
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, lineHeight: 1.9, color: "#5c4f42", marginBottom: 20 }}>{p.description}</p>
                  {p.details?.length > 0 && (
                    <ul className="flex flex-col gap-3">
                      {p.details.map((d, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span style={{ color: G, marginTop: 3 }}>◆</span>
                          <span style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: "#5c4f42" }}>{d}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {tab === "Specifications" && (
                <div className="max-w-2xl rounded-2xl overflow-hidden" style={{ border: `1px solid ${BD}` }}>
                  {[["Material", p.material], ["SKU", p.sku], ["Weight", p.weight], ["Dimensions", p.dimensions], ["Category", p.category], ["Hallmark", "BIS 916 Hallmarked"], ["Country", "India"]].filter(([, v]) => v).map(([k, v], i) => (
                    <div key={k} className="flex" style={{ background: i % 2 === 0 ? "#fff" : "#faf6f0" }}>
                      <div className="w-1/3 px-5 py-3 font-semibold" style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: TX, borderRight: `1px solid ${BD}` }}>{k}</div>
                      <div className="flex-1 px-5 py-3" style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#5c4f42" }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
              {tab === "Shipping & Returns" && (
                <div className="max-w-2xl flex flex-col gap-6">
                  {[
                    { title: "Returns", body: "We do not offer returns or refunds once an order has been delivered. Each piece is crafted and finished in limited quantities, so all sales are final." },
                    { title: "Exchanges", body: "We offer a 7-day exchange from the date of delivery. The product must be unused and unworn, in its original packaging with all tags and accessories, and accompanied by the original invoice." },
                    { title: "Damaged or Incorrect Orders", body: "If you receive a damaged, defective, or incorrect item, contact us within 48 hours of delivery with your order number, clear photos, and an unboxing video. Once verified, we'll arrange a replacement at no additional cost." },
                    { title: "Exchange Conditions", body: "Exchanges are allowed only once per order. If the exchanged item costs more, you'll pay the difference; if it costs less, the remaining amount is issued as store credit." },
                  ].map((s) => (
                    <div key={s.title} className="flex gap-4">
                      <span style={{ color: G, fontSize: 18, lineHeight: 1, marginTop: 2 }}>✦</span>
                      <div>
                        <p style={{ fontSize: 17, fontWeight: 600, color: TX, marginBottom: 4 }}>{s.title}</p>
                        <p style={{ fontSize: 13.5, lineHeight: 1.8, color: "#5c4f42", textAlign: "justify" }}>{s.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {tab === "Reviews" && (
                <div id="reviews" className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
                  {/* Summary */}
                  <div>
                    <div className="text-center lg:text-left mb-6">
                      <p style={{ fontFamily: "var(--font-playfair)", fontSize: 56, fontWeight: 700, color: TX, lineHeight: 1 }}>{p.rating}</p>
                      <div className="flex justify-center lg:justify-start my-2"><Stars value={p.rating} size={18} /></div>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: MT }}>Based on {p.reviews} reviews</p>
                    </div>
                    <div className="flex flex-col gap-3 mb-6">
                      {RATING_DIST.map(({ stars, pct }) => (
                        <div key={stars} className="flex items-center gap-3">
                          <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: MT, width: 40 }}>{stars} star</span>
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: CRD }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${G}, ${GLT})` }} />
                          </div>
                          <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: MT, width: 32, textAlign: "right" }}>{pct}%</span>
                        </div>
                      ))}
                    </div>
                    <button className="w-full rounded-full py-3 text-sm font-semibold transition-all hover:brightness-110"
                      style={{ fontFamily: "var(--font-jost)", letterSpacing: "0.08em", textTransform: "uppercase", fontSize: 12, background: BRM, color: GLT }}>
                      Write a Review
                    </button>
                  </div>
                  {/* Review list */}
                  <div className="flex flex-col gap-6">
                    {SAMPLE_REVIEWS.map((r, i) => (
                      <div key={i} className="pb-6" style={{ borderBottom: i < SAMPLE_REVIEWS.length - 1 ? `1px solid ${BD}` : "none" }}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: CRD, fontFamily: "var(--font-playfair)", fontWeight: 700, color: G, fontSize: 14 }}>
                            {r.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600, color: TX }}>{r.name}</span>
                              {r.verified && <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#2d6a4f", fontWeight: 600 }}>✓ Verified</span>}
                              <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: MT }}>{r.date}</span>
                            </div>
                            <Stars value={r.rating} size={12} />
                          </div>
                        </div>
                        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 600, color: TX, marginBottom: 4 }}>{r.title}</p>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13.5, lineHeight: 1.8, color: "#5c4f42" }}>{r.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Related ── */}
          {/* ── Related ── */}
          {relatedProducts?.length > 0 && (
            <div className="mt-16 pt-12" style={{ borderTop: `1px solid ${BD}` }}>
              <div className="flex items-end justify-between mb-8">
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: G, marginBottom: 6 }}>You May Also Like</p>
                  <h2 style={{ fontSize: "clamp(1.7rem,2.6vw,2.3rem)", fontWeight: 600, color: TX }}>Related Products</h2>
                </div>
                <Link href="/shop" style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: TX, borderBottom: `1px solid ${G}`, paddingBottom: 4 }}>
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((rp) => (
                  <ProductCard
                    key={rp.id || rp.slug}
                    id={rp.id}
                    slug={rp.slug}
                    image={rp.image}
                    images={rp.images}
                    name={rp.name}
                    category={rp.category}
                    description={rp.description}
                    price={rp.price}
                    originalPrice={rp.originalPrice}
                    rating={rp.rating}
                    reviews={rp.reviews}
                    badge={rp.badge}
                    badgeColor={rp.badgeColor}
                    variants={rp.variants}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}