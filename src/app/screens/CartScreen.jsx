"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { useCart } from "../lib/CartContext";
import { useAuth } from "../lib/AuthContext";
import { fmtPrice } from "../lib/api";

const C = {
  dark:    "#1a0c06",
  brown:   "#3d1f10",
  gold:    "#b08850",
  goldLt:  "#c9a96e",
  cream:   "#f5efe8",
  creamDk: "#ede4d8",
  border:  "#e8ddd0",
  muted:   "#8a7560",
  text:    "#2a1a0e",
  white:   "#ffffff",
};

export default function CartScreen() {
  const { items, updateQty, removeItem, count, loading } = useCart();
  const { user } = useAuth();

  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0);
  const savings   = items.reduce((s, i) => s + ((i.originalPrice || i.price) - i.price) * i.qty, 0);
  const shipping  = subtotal > 50000 ? 0 : null; // null = "calculated at checkout"
  const gst       = Math.round(subtotal * 0.03);

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: C.cream }}>

        {/* ── Dark hero band (matches Checkout) ── */}
        <div style={{ background: C.brown, paddingTop: 114 }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10 text-center">
            <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 600, color: C.goldLt, marginTop: 8 }}>
              Your Bag
            </h1>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(245,239,232,0.6)", marginTop: 10, letterSpacing: "0.04em" }}>
              {loading ? "Loading…" : `${count} ${count === 1 ? "item" : "items"} in your bag`}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">

          {/* ── Step-like breadcrumb card (lifted, matches checkout card) ── */}
          <div className="relative z-10" style={{ marginTop: -32 }}>
            <div className="rounded-3xl px-6 py-5 sm:px-8 flex items-center justify-between"
              style={{ background: C.white, border: `1.5px solid ${C.border}`, boxShadow: "0 12px 40px rgba(26,12,6,0.08)" }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{  boxShadow: `0 4px 16px rgba(61,31,16,0.3)`, color:"#333232" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.goldLt} strokeWidth="2.5">
                    <path d="M6 6h15l-1.5 9h-12z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="9" cy="20" r="1" fill={C.goldLt} stroke="none" />
                    <circle cx="18" cy="20" r="1" fill={C.goldLt} stroke="none" />
                    <path d="M6 6L4 3H2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Bag
                </span>
              </div>

              {/* Faded next steps */}
              <div className="hidden sm:flex items-center gap-0">
                {["Delivery", "Payment", "Confirmed"].map((s, i) => (
                  <div key={s} className="flex items-center">
                    <div className="w-px h-5 mx-4" style={{ background: C.border }} />
                    <span className="" style={{ fontSize: 13, color: C.muted, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {s}
                    </span>
                  </div>
                ))}
              </div>

              {!user && (
                <Link href="/account?redirect=checkout"
                  style={{ fontSize: 15, color: C.gold, fontWeight: 700, letterSpacing: "0.05em" }}>
                  Sign in →
                </Link>
              )}
            </div>
          </div>

          {/* ── States ── */}
          {loading ? (
            <div className="text-center py-24">
              <div className="w-10 h-10 rounded-full mx-auto border-2 border-t-transparent animate-spin"
                style={{ borderColor: `${C.gold} transparent ${C.gold} ${C.gold}` }} />
            </div>
          ) : items.length === 0 ? (
            /* ── Empty bag ── */
            <div className="text-center py-24 mt-8">
              <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ background: C.creamDk }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.5">
                  <path d="M6 6h15l-1.5 9h-12z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="20" r="1" fill={C.gold} stroke="none" />
                  <circle cx="18" cy="20" r="1" fill={C.gold} stroke="none" />
                  <path d="M6 6L4 3H2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 600, color: C.text, marginBottom: 8 }}>
                Your bag is empty
              </p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: C.muted, marginBottom: 28 }}>
                Discover pieces made to be treasured.
              </p>
              <Link href="/shop"
                className="inline-block rounded-full px-9 py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover-lift font-poppins"
                style={{ background: `linear-gradient(135deg, ${C.brown} 0%, #5a2e16 100%)`, color: C.goldLt, boxShadow: "0 4px 20px rgba(61,31,16,0.25)" }}>
                Continue Shopping
              </Link>
            </div>
          ) : (
            /* ── Main grid ── */
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] mt-8">

              {/* ── Left: Items ── */}
              <div className="rounded-3xl p-6 sm:p-8"
                style={{ background: C.white, border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(26,12,6,0.05)" }}>

                <h2 style={{  fontSize: 13, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 24 }}>
                  {count} {count === 1 ? "Item" : "Items"}
                </h2>

                <div className="flex flex-col">
                  {items.map((item, idx) => (
                    <div key={item.key}
                      className="flex gap-4 sm:gap-5 items-start py-6"
                      style={{ borderBottom: idx < items.length - 1 ? `1px solid ${C.border}` : "none" }}>

                      {/* Thumbnail */}
                      <Link href={`/products/${item.slug}`}
                        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex-shrink-0 hover-lift"
                        style={{ background: C.cream, border: `1px solid ${C.border}` }}>
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />
                        )}
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link href={`/products/${item.slug}`}
                              className="line-clamp-2"
                              style={{  fontSize: 19, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>
                              {item.name}
                            </Link>
                            {(item.variant || item.size) && (
                              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: C.muted, marginTop: 4, letterSpacing: "0.02em" }}>
                                {[item.variant, item.size].filter(Boolean).join(" · ")}
                              </p>
                            )}
                            {/* Price row under name */}
                            <div className="flex items-center gap-2 mt-2">
                              <span style={{ fontFamily: "var(--font-jost)", fontSize: 15, fontWeight: 700, color: C.text }}>
                                {fmtPrice(item.price)}
                              </span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span style={{  fontSize: 12, color: C.muted, textDecoration: "line-through" }}>
                                  {fmtPrice(item.originalPrice)}
                                </span>
                              )}
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                                  style={{ background: "#fdf8f0", color: C.gold, border: `1px solid ${C.gold}44` }}>
                                  {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Remove */}
                          <button onClick={() => removeItem(item.key)}
                            aria-label="Remove item"
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-red-50"
                            style={{ background: C.cream, color: C.muted }}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                            </svg>
                          </button>
                        </div>

                        {/* Qty + line total */}
                        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                          <div className="flex items-center rounded-full overflow-hidden"
                            style={{ border: `1.5px solid ${C.border}`, background: C.cream }}>
                            <button onClick={() => updateQty(item.key, -1)}
                              className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-white"
                              style={{ color: C.brown, fontSize: 16 }}>−</button>
                            <span style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 600, color: C.text, minWidth: 36, textAlign: "center" }}>
                              {item.qty}
                            </span>
                            <button onClick={() => updateQty(item.key, 1)}
                              className="w-9 h-9 flex items-center justify-center transition-colors hover:bg-white"
                              style={{ color: C.brown, fontSize: 16 }}>+</button>
                          </div>

                          <p style={{ fontSize: 18, fontWeight: 700, color: C.text }}>
                            {fmtPrice(item.price * item.qty)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue shopping */}
                <div className="pt-6 mt-2" style={{ borderTop: `1px solid ${C.border}` }}>
                  <Link href="/shop"
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] transition-opacity hover:opacity-70"
                    style={{ fontFamily: "var(--font-jost)", color: C.gold }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* ── Right: Order Summary (matches checkout OrderSummary) ── */}
              <div className="rounded-3xl overflow-hidden h-fit lg:sticky lg:top-32"
                style={{ background: C.white, border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(26,12,6,0.06)" }}>

                {/* Dark header — same as checkout sidebar */}
                <div className="flex items-center gap-3 px-6 py-5" style={{ background: C.brown }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(201,169,110,0.15)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.goldLt} strokeWidth="2">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 600, color: C.goldLt }}>Order Summary</h3>
                </div>

                <div className="p-6">
                  {/* Price rows */}
                  <div className="flex flex-col gap-3 pb-5" style={{ borderBottom: `1px solid ${C.border}` }}>
                    {[
                      ["Subtotal", fmtPrice(subtotal + savings)],
                      savings > 0 && ["Item Discount", `−${fmtPrice(savings)}`],
                      ["Shipping", shipping === 0 ? "FREE" : "Calculated at checkout"],
                      ["GST (3%)", fmtPrice(gst)],
                    ].filter(Boolean).map(([label, val]) => (
                      <div key={label} className="flex justify-between items-center">
                        <span style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: C.muted, fontWeight: 600 }}>{label}</span>
                        <span style={{
                          fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600,
                          color: (String(label).includes("Discount") || (label === "Shipping" && shipping === 0)) ? C.gold : C.text,
                        }}>{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex justify-between items-center my-5 rounded-xl px-4 py-4"
                    style={{ background: C.brown }}>
                    <span style={{  fontSize: 14, fontWeight: 700, color: C.goldLt, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      Estimated Total
                    </span>
                    <span style={{  fontSize: 22, fontWeight: 700, color: C.white }}>
                      {fmtPrice(subtotal + gst)}
                    </span>
                  </div>

                  {/* Free shipping nudge */}
                  {subtotal < 50000 && (
                    <div className="mb-5 px-4 py-3 rounded-xl flex items-start gap-3"
                      style={{ background: "#fdf8f0", border: `1px solid ${C.gold}33` }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="2" className="mt-0.5 flex-shrink-0">
                        <rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" />
                        <circle cx="5.5" cy="18.5" r="1.5" /><circle cx="18.5" cy="18.5" r="1.5" />
                      </svg>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: C.muted }}>
                        Add <strong style={{ color: C.text }}>{fmtPrice(50000 - subtotal)}</strong> more for free shipping
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  <Link href="/checkout"
                    className="block text-center rounded-full py-4 text-xs font-bold uppercase tracking-[0.2em] hover-lift active:scale-95 transition-all font-poppins text-[#fff]"
                    style={{  background: `linear-gradient(135deg, ${C.brown} 0%, #5a2e16 100%)`, boxShadow: "0 4px 20px rgba(26,12,6,0.25)" }}>
                    Proceed to Checkout →
                  </Link>

                  <p style={{  fontSize: 11, color: C.muted, marginTop: 14, textAlign: "center", letterSpacing: "0.03em" }}>
                    Final price calculated at checkout
                  </p>

                  {/* SSL strip — same as checkout */}
                  <div className="flex items-center justify-center gap-2 mt-5 pt-5" style={{ borderTop: `1px solid ${C.border}` }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8">
                      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <span style={{ fontSize: 11, color: C.muted }}>256-bit SSL encrypted checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}