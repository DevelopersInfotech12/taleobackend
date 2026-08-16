"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../lib/CartContext";
import { fmtPrice } from "../lib/api";

const C = {
  dark:   "#1a0c06",
  brown:  "#3d1f10",
  gold:   "#b08850",
  goldLt: "#c9a96e",
  cream:  "#f5efe8",
  border: "#e8ddd0",
  muted:  "#8a7560",
  text:   "#2a1a0e",
  white:  "#ffffff",
};

export default function CartDrawer() {
  const { items, count, isOpen, closeCart, updateQty, removeItem, loading } = useCart();

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(26,12,6,0.45)" }}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[101] h-full w-full sm:w-[380px] flex flex-col transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: C.cream, boxShadow: "-8px 0 40px rgba(26,12,6,0.2)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3"
          style={{ background: C.brown, color: C.goldLt }}>
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <div>
              <p style={{ fontFamily: "var(--font-jost)",  fontSize: 24, fontWeight: 600 }}>Your Bag</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, opacity: 0.8 }}>
                {count} {count === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          <button onClick={closeCart} aria-label="Close cart"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: C.muted, textAlign: "center", marginTop: 40 }}>
              Loading your bag…
            </p>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: C.muted, marginBottom: 16 }}>
                Your bag is empty.
              </p>
              <button onClick={closeCart}
                className="rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-[0.15em]"
                style={{ fontFamily: "var(--font-jost)", border: `1.5px solid ${C.border}`, color: C.text, background: C.white }}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {items.map((item) => (
                <div key={item.key} className="flex gap-3 items-start pb-5"
                  style={{ borderBottom: `1px solid ${C.border}` }}>
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0" style={{ background: C.white }}>
                    {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.slug}`} onClick={closeCart}
                      style={{ fontSize: 15, fontWeight: 700, color: "#302e2e" }} className="font-poppins">
                      {item.name}
                    </Link>
                    {(item.variant || item.size) && (
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#726f6e", marginTop: 2 }}>
                        {[item.variant, item.size].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <p style={{  fontSize: 13, fontWeight: 700, color: "#00000096", marginTop: 4 }} className="font-poppins">
                      {fmtPrice(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center rounded-full border overflow-hidden" style={{ borderColor: C.border }}>
                        <button onClick={() => updateQty(item.key, -1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#f0e9df] transition-colors"
                          style={{ color: C.brown, fontSize: 13 }}>−</button>
                        <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: C.text, minWidth: 24, textAlign: "center" }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.key, 1)}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#f0e9df] transition-colors"
                          style={{ color: C.brown, fontSize: 13 }}>+</button>
                      </div>
                      <button onClick={() => removeItem(item.key)} aria-label="Remove item"
                        className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f0e9df] transition-colors"
                        style={{ color: "#c0392b" }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-4 rounded-t-3xl"
            style={{ background: C.brown, color: C.goldLt }}>
            <div className="flex justify-between items-center mb-3"
              style={{ fontFamily: "var(--font-jost)", fontSize: 16 }}>
              <span style={{ color: C.goldLt, opacity: 0.75 }}>Subtotal</span>
              <span style={{ fontFamily: "var(--font-jost)", color: C.white, fontWeight: 700, fontSize: 20 }}>{fmtPrice(subtotal)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart}
              className="block text-center rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.15em] mb-3 hover-lift"
              style={{ fontFamily: "var(--font-jost)", background: `linear-gradient(135deg, ${C.gold} 0%, ${C.goldLt} 100%)`, color: C.dark, boxShadow: "0 4px 20px rgba(0,0,0,0.25)" }}>
              Proceed to Checkout →
            </Link>
            <Link href="/cart" onClick={closeCart}
              className="block text-center rounded-full py-3.5 text-xs font-bold uppercase tracking-[0.15em]"
              style={{ fontFamily: "var(--font-jost)", border: `1.5px solid rgba(201,169,110,0.35)`, color: C.goldLt, background: "transparent" }}>
              View Bag
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}