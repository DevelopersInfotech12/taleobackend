"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function Stars({ rating, size = 14 }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 12 12">
          <polygon
            points="6,1 7.5,4.5 11,5 8.5,7.5 9.2,11 6,9.2 2.8,11 3.5,7.5 1,5 4.5,4.5"
            fill={s <= Math.round(rating) ? "#c9a96e" : "#e8ddd0"}
          />
        </svg>
      ))}
    </span>
  );
}

function Breadcrumb({ product }) {
  return (
    <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: "#8a7560", fontFamily: "var(--font-jost)" }}>
      <Link href="/" className="hover:text-[#b08850] transition-colors">Home</Link>
      <span style={{ color: "#c9a96e" }}>›</span>
      <Link href="/shop" className="hover:text-[#b08850] transition-colors">Shop</Link>
      <span style={{ color: "#c9a96e" }}>›</span>
      <Link href={`/shop?category=${product.category}`} className="hover:text-[#b08850] transition-colors">
        {product.category}
      </Link>
      <span style={{ color: "#c9a96e" }}>›</span>
      <span style={{ color: "#2a1a0e" }}>{product.name}</span>
    </nav>
  );
}

function ImageGallery({ images, name }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  return (
    <div className="flex gap-4">
      <div className="hidden md:flex flex-col gap-3 w-20 shrink-0">
        {images.map((src, i) => (
          <button key={i} onClick={() => setActive(i)}
            className="relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200"
            style={{ borderColor: i === active ? "#b08850" : "#e8ddd0" }}>
            <Image src={src} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
      <div className="flex-1">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden cursor-zoom-in"
          onClick={() => setZoomed(!zoomed)} style={{ background: "#f0e9df" }}>
          <Image src={images[active]} alt={name} fill priority
            className="object-cover transition-transform duration-500"
            style={{ transform: zoomed ? "scale(1.18)" : "scale(1)" }}
            sizes="(max-width: 768px) 100vw, 50vw" />
          <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs backdrop-blur-sm"
            style={{ background: "rgba(29,14,6,0.55)", color: "#e8d5b0", fontFamily: "var(--font-jost)" }}>
            {zoomed ? "Click to reset" : "Click to zoom"}
          </div>
        </div>
        <div className="flex md:hidden gap-2 mt-3">
          {images.map((src, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="relative w-16 aspect-square rounded-lg overflow-hidden border-2 transition-all"
              style={{ borderColor: i === active ? "#b08850" : "#e8ddd0" }}>
              <Image src={src} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const TRUST = [
  { icon: "✦", label: "BIS Hallmarked" },
  { icon: "◈", label: "Free Shipping" },
  { icon: "⟳", label: "30-Day Returns" },
  { icon: "◎", label: "Certified Stones" },
];

// ── Mock reviews ──
const MOCK_REVIEWS = [
  { id: 1, name: "Priya S.", rating: 5, date: "12 May 2025", title: "Absolutely stunning!", body: "The craftsmanship is exceptional. Received so many compliments at the wedding. Packaging was also very luxurious.", avatar: "P" },
  { id: 2, name: "Meera R.", rating: 4, date: "3 Apr 2025", title: "Beautiful piece, fast delivery", body: "Exactly as described. The gold quality is excellent and it sits beautifully. Slightly smaller than I expected but still gorgeous.", avatar: "M" },
  { id: 3, name: "Ananya K.", rating: 5, date: "18 Feb 2025", title: "Worth every rupee", body: "My husband gifted this to me for our anniversary. I was speechless. The stone clarity is incredible.", avatar: "A" },
  { id: 4, name: "Deepa T.", rating: 4, date: "5 Jan 2025", title: "Great quality", body: "Very happy with the purchase. The finish is smooth and it feels premium. Would definitely buy again.", avatar: "D" },
];

function ReviewsSection({ product }) {
  const [shown, setShown] = useState(2);
  const ratingDist = [
    { stars: 5, pct: 68 },
    { stars: 4, pct: 22 },
    { stars: 3, pct: 7 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 },
  ];
  return (
    <section className="mt-20">
      <h2 className="text-2xl md:text-3xl mb-10"
        style={{ fontFamily: "var(--font-playfair)", color: "#1a0e07", fontWeight: 600 }}>
        Customer Reviews
      </h2>

      {/* Summary row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 p-6 rounded-2xl"
        style={{ background: "#fff", border: "1px solid #e8ddd0" }}>

        {/* Big rating */}
        <div className="flex flex-col items-center justify-center gap-2 border-b md:border-b-0 md:border-r pb-6 md:pb-0"
          style={{ borderColor: "#e8ddd0" }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontSize: 64, fontWeight: 700, color: "#1a0e07", lineHeight: 1 }}>
            {product.rating}
          </span>
          <Stars rating={product.rating} size={18} />
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#8a7560" }}>
            {product.reviews} reviews
          </span>
        </div>

        {/* Bar chart */}
        <div className="flex flex-col gap-2.5 col-span-2 justify-center">
          {ratingDist.map(({ stars, pct }) => (
            <div key={stars} className="flex items-center gap-3">
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#8a7560", width: 12, textAlign: "right" }}>{stars}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
                <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9.2,11 6,9.2 2.8,11 3.5,7.5 1,5 4.5,4.5" fill="#c9a96e" />
              </svg>
              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "#f0e9df" }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: "linear-gradient(90deg, #b08850, #c9a96e)" }} />
              </div>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#8a7560", width: 28 }}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="flex flex-col gap-4">
        {MOCK_REVIEWS.slice(0, shown).map((r) => (
          <div key={r.id} className="p-6 rounded-2xl" style={{ background: "#fff", border: "1px solid #e8ddd0" }}>
            <div className="flex items-start gap-4 mb-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                style={{ background: "#3d1f10", color: "#c9a96e", fontFamily: "var(--font-jost)" }}>
                {r.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span style={{ fontFamily: "var(--font-jost)", fontWeight: 600, fontSize: 14, color: "#1a0e07" }}>{r.name}</span>
                  <Stars rating={r.rating} size={12} />
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#a09080" }}>{r.date}</span>
                </div>
                <p className="font-semibold mt-0.5" style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: "#3d2510" }}>{r.title}</p>
              </div>
              {/* Verified badge */}
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: "#edf7f0", color: "#2d6a4f", fontFamily: "var(--font-jost)" }}>
                ✓ Verified
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, lineHeight: 1.7, color: "#5a4030" }}>{r.body}</p>
          </div>
        ))}
      </div>

      {shown < MOCK_REVIEWS.length && (
        <button onClick={() => setShown(MOCK_REVIEWS.length)}
          className="mt-6 w-full py-3 rounded-full border text-sm font-medium transition-all hover:bg-[#3d1f10] hover:text-[#c9a96e] hover:border-[#3d1f10]"
          style={{ fontFamily: "var(--font-jost)", color: "#5a4030", borderColor: "#d4c4b0" }}>
          Show all {MOCK_REVIEWS.length} reviews
        </button>
      )}
    </section>
  );
}

function RelatedCard({ product }) {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="rounded-2xl overflow-hidden border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_20px_50px_-10px_rgba(176,136,80,0.2)]"
        style={{ background: "#fff", borderColor: "#e8ddd0" }}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image src={product.image} alt={product.name} fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw" />
          {product.badge && (
            <div className="absolute top-2 left-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                style={{ background: "rgba(0,0,0,0.6)", color: product.badgeColor || "#c9a96e", fontFamily: "var(--font-jost)" }}>
                {product.badge}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="font-semibold text-sm truncate mb-0.5" style={{ color: "#1E0C04", fontFamily: "var(--font-jost)" }}>{product.name}</p>
          <p className="text-xs mb-2" style={{ color: "#8a7560", fontFamily: "var(--font-jost)" }}>{product.metal}</p>
          <div className="flex items-center justify-between">
            <span className="font-semibold" style={{ color: "#1E0C04", fontFamily: "var(--font-jost)" }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {discount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fdf6ef", color: "#b08850", fontFamily: "var(--font-jost)" }}>
                {discount}% off
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── MAIN ──
export default function ProductDetailScreen({ product, related }) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const sizes = product.type === "ring" ? ["12", "13", "14", "15", "16", "17", "18", "19", "20"] : null;

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    router.push(`/checkout?slug=${product.slug}&qty=${qty}&variant=${encodeURIComponent(selectedVariant)}`);
  };

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <Navbar />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb product={product} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
            {/* Left: Gallery */}
            <div className="animate-slideLeft">
              <ImageGallery images={product.images} name={product.name} />
            </div>

            {/* Right: Info */}
            <div className="animate-slideRight flex flex-col gap-5">

              {/* Category + Badge */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold"
                  style={{ color: "#8a7560", fontFamily: "var(--font-jost)" }}>
                  {product.category}
                </span>
                {product.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                    style={{ color: product.badgeColor || "#c9a96e", borderColor: (product.badgeColor || "#c9a96e") + "55", background: "rgba(0,0,0,0.04)", fontFamily: "var(--font-jost)" }}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-3xl md:text-4xl leading-tight"
                style={{ fontFamily: "var(--font-playfair)", color: "#1a0e07", fontWeight: 600 }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <Stars rating={product.rating} />
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#b08850", fontWeight: 600 }}>{product.rating}</span>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#8a7560" }}>({product.reviews} reviews)</span>
              </div>

              <div className="border-t" style={{ borderColor: "#e8ddd0" }} />

              {/* Price */}
              <div className="flex items-end gap-4">
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 32, fontWeight: 700, color: "#1a0e07", lineHeight: 1 }}>
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
                {product.originalPrice && (
                  <>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: 18, color: "#a08060", textDecoration: "line-through" }}>
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{ background: "#3d1f10", color: "#c9a96e", fontFamily: "var(--font-jost)" }}>
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Variant selector */}
              <div>
                <p className="text-xs uppercase tracking-widest mb-3"
                  style={{ fontFamily: "var(--font-jost)", color: "#8a7560", fontWeight: 600 }}>
                  Metal — <span style={{ color: "#2a1a0e", textTransform: "none", letterSpacing: 0 }}>{selectedVariant}</span>
                </p>
                {/* ALL 3 IN ONE ROW */}
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button key={v} onClick={() => setSelectedVariant(v)}
                      className="px-4 py-2 rounded-full text-sm border transition-all duration-200"
                      style={{
                        fontFamily: "var(--font-jost)", fontWeight: 500,
                        background: selectedVariant === v ? "#3d1f10" : "transparent",
                        color: selectedVariant === v ? "#c9a96e" : "#5a4030",
                        borderColor: selectedVariant === v ? "#3d1f10" : "#d4c4b0",
                      }}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ring size */}
              {sizes && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-jost)", color: "#8a7560", fontWeight: 600 }}>
                      Ring Size {selectedSize ? `— ${selectedSize}` : ""}
                    </p>
                    <button className="text-xs underline underline-offset-2 hover:text-[#b08850] transition-colors"
                      style={{ fontFamily: "var(--font-jost)", color: "#8a7560" }}>
                      Size guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button key={s} onClick={() => setSelectedSize(s)}
                        className="w-11 h-11 rounded-full text-sm border transition-all duration-200"
                        style={{
                          fontFamily: "var(--font-jost)", fontWeight: 500,
                          background: selectedSize === s ? "#3d1f10" : "transparent",
                          color: selectedSize === s ? "#c9a96e" : "#5a4030",
                          borderColor: selectedSize === s ? "#3d1f10" : "#d4c4b0",
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Qty + Wishlist IN ONE ROW ── */}
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-full border overflow-hidden" style={{ borderColor: "#d4c4b0" }}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-11 flex items-center justify-center text-lg hover:bg-[#f0e9df] transition-colors"
                    style={{ color: "#3d1f10" }}>−</button>
                  <span className="w-8 text-center text-sm font-semibold"
                    style={{ fontFamily: "var(--font-jost)", color: "#1a0e07" }}>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-11 flex items-center justify-center text-lg hover:bg-[#f0e9df] transition-colors"
                    style={{ color: "#3d1f10" }}>+</button>
                </div>

                <button onClick={() => setWishlisted((w) => !w)}
                  className="w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-200"
                  style={{ borderColor: wishlisted ? "#b08850" : "#d4c4b0", background: wishlisted ? "#fdf6ef" : "transparent" }}
                  aria-label="Wishlist">
                  <svg width="16" height="16" viewBox="0 0 24 22"
                    fill={wishlisted ? "#b08850" : "none"} stroke={wishlisted ? "#b08850" : "#8a7560"} strokeWidth="2">
                    <path d="M12 21C12 21 2 13.5 2 7a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 6.5-10 14-10 14z" />
                  </svg>
                </button>
              </div>

              {/* ── Add to Cart + Buy Now IN ONE ROW ── */}
              <div className="flex gap-3">
                <button onClick={handleAddToCart}
                  className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 active:scale-95"
                  style={{
                    fontFamily: "var(--font-jost)",
                    background: added ? "#2d6a4f" : "linear-gradient(135deg, #3d1f10 0%, #5a2e16 100%)",
                    color: added ? "#fff" : "#c9a96e",
                    letterSpacing: "0.06em",
                  }}>
                  {added ? (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20,6 9,17 4,12" /></svg>Added!</>
                  ) : (
                    <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>Add to Cart</>
                  )}
                </button>

                <button onClick={handleBuyNow}
                  className="flex-1 h-12 rounded-full flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 active:scale-95 border-2 hover:bg-[#3d1f10] hover:text-[#c9a96e] hover:border-[#3d1f10]"
                  style={{ fontFamily: "var(--font-jost)", color: "#3d1f10", borderColor: "#3d1f10", letterSpacing: "0.06em" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  Buy Now
                </button>
              </div>

              {/* Trust bar */}
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl"
                style={{ background: "#fff", border: "1px solid #e8ddd0" }}>
                {TRUST.map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span style={{ color: "#b08850", fontSize: 14 }}>{icon}</span>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#5a4030" }}>{label}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#a09080" }}>
                SKU: {product.sku} · Weight: {product.weight}
              </p>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="mt-20">
            <div className="flex gap-0 border-b mb-8" style={{ borderColor: "#e8ddd0" }}>
              {["details", "specifications", "care"].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className="relative px-6 py-3 text-sm font-medium capitalize transition-colors"
                  style={{ fontFamily: "var(--font-jost)", color: activeTab === tab ? "#1a0e07" : "#8a7560", letterSpacing: "0.05em" }}>
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#b08850" }} />
                  )}
                </button>
              ))}
            </div>

            <div className="max-w-3xl">
              {activeTab === "details" && (
                <div className="flex flex-col gap-6">
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 15, lineHeight: 1.8, color: "#3d2510" }}>{product.description}</p>
                  <ul className="flex flex-col gap-3">
                    {product.details.map((d, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span style={{ color: "#b08850", marginTop: 3 }}>◆</span>
                        <span style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: "#3d2510" }}>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {activeTab === "specifications" && (
                <table className="w-full text-sm" style={{ fontFamily: "var(--font-jost)" }}>
                  <tbody>
                    {[["Metal", product.metal], ["Stone", product.stone], ["Weight", product.weight], ["Dimensions", product.dimensions], ["SKU", product.sku], ["Category", product.category]].map(([label, value]) => (
                      <tr key={label} className="border-b" style={{ borderColor: "#e8ddd0" }}>
                        <td className="py-3 pr-8 font-medium w-40" style={{ color: "#8a7560" }}>{label}</td>
                        <td className="py-3" style={{ color: "#1a0e07" }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {activeTab === "care" && (
                <div className="flex flex-col gap-5">
                  {[
                    { title: "Cleaning", text: "Use a soft, lint-free cloth to gently wipe the surface. For deeper cleaning, use mild soapy water with a soft brush, then rinse and dry thoroughly." },
                    { title: "Storage", text: "Store in the provided velvet pouch or box, away from other jewellery to prevent scratches. Avoid direct sunlight and humidity." },
                    { title: "Wearing", text: "Remove before swimming, exercising, or using cleaning chemicals. Apply perfume and cosmetics before wearing jewellery." },
                    { title: "Service", text: "We recommend professional servicing once a year. Bring your piece to any Luxéor boutique for complimentary cleaning and inspection." },
                  ].map(({ title, text }) => (
                    <div key={title}>
                      <h4 className="font-semibold mb-1.5" style={{ fontFamily: "var(--font-playfair)", color: "#1a0e07", fontSize: 16 }}>{title}</h4>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, lineHeight: 1.75, color: "#5a4030" }}>{text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Reviews ── */}
          <ReviewsSection product={product} />

          {/* ── Related ── */}
          {related.length > 0 && (
            <section className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl"
                  style={{ fontFamily: "var(--font-playfair)", color: "#1a0e07", fontWeight: 600 }}>
                  You May Also Like
                </h2>
                <Link href="/shop" className="text-sm font-medium hover:text-[#b08850] transition-colors flex items-center gap-1"
                  style={{ fontFamily: "var(--font-jost)", color: "#8a7560" }}>
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((p) => <RelatedCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}