"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { fmtPrice } from "../lib/api";
import { useCart } from "../lib/CartContext";
import { useAuth, authFetch } from "../lib/AuthContext";

/* ─── Brand tokens ─────────────────────── */
const C = {
  dark: "#1a0c06",
  brown: "#3d1f10",
  gold: "#b08850",
  goldLt: "#c9a96e",
  cream: "#f5efe8",
  creamDk: "#ede4d8",
  border: "#e8ddd0",
  muted: "#8a7560",
  text: "#2a1a0e",
  white: "#ffffff",
};

const STATES = ["Andhra Pradesh", "Delhi", "Gujarat", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];

/* ─── Shared input field ─────────────────── */
function Field({ label, name, type = "text", placeholder, value, onChange, required, half, select, options }) {
  const inputStyle = {
    color: C.text,
    background: C.white, border: `1.5px solid ${C.border}`,
    borderRadius: 12, padding: "13px 16px", width: "100%", outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };
  return (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block text-[12px] font-bold uppercase mb-1.5 font-poppins"
        style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em" }}>
        {label}{required && <span style={{ color: C.gold }}> *</span>}
      </label>
      {select ? (
        <select name={name} value={value} onChange={onChange} style={inputStyle} required={required}>
          <option value="">Select…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type} name={name} value={value} onChange={onChange}
          placeholder={placeholder} required={required} style={inputStyle}
          onFocus={(e) => { e.target.style.borderColor = C.gold; e.target.style.boxShadow = `0 0 0 3px ${C.gold}22`; }}
          onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
        />
      )}
    </div>
  );
}

/* ─── Step progress bar ──────────────────── */
function StepBar({ step }) {
  const steps = ["Bag", "Delivery", "Payment", "Confirmed"];
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-400 relative"
              style={{
                background: i < step
                  ? `linear-gradient(135deg, ${C.gold}, ${C.goldLt})`
                  : i === step
                    ? `linear-gradient(135deg, ${C.brown}, #5a2e16)`
                    : C.creamDk,
                color: i < step ? C.dark : i === step ? C.goldLt : C.muted,
                boxShadow: i === step ? `0 4px 16px rgba(61,31,16,0.3)` : "none",
                fontFamily: "var(--font-jost)",
              }}>
              {i < step ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20,6 9,17 4,12" /></svg>
              ) : i + 1}
            </div>
            <span className="text-[11px] uppercase tracking-wider hidden sm:block"
              style={{ fontFamily: "var(--font-jost)", color: i === step ? C.text : C.muted, fontWeight: i === step ? 700 : 600 }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="w-14 sm:w-24 h-px mx-1 sm:mx-2 mb-5 transition-all duration-500"
              style={{ background: i < step ? `linear-gradient(90deg, ${C.gold}, ${C.goldLt})` : C.border }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Order Summary sidebar ─────────────── */
function OrderSummary({ items, coupon, setCoupon, couponApplied, couponData, couponError, couponLoading, applyCoupon, removeCoupon }) {
  const subtotal = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 0), 0);

  // USE precomputedDiscount from backend directly
  const couponDiscount = (couponApplied && couponData?.precomputedDiscount)
    ? Math.min(couponData.precomputedDiscount, subtotal)
    : 0;

  const shipping = subtotal > 50000 ? 0 : 80;
  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const gst = Math.round(taxableAmount * 0.03);
  const total = Math.max(0, (subtotal || 0) - (couponDiscount || 0) + (shipping || 0) + (gst || 0));

  return (
    <div className="rounded-3xl overflow-hidden sticky top-32" style={{ background: C.white, border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(26,12,6,0.06)" }}>
      {/* Header */}
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
        {/* Items */}
        <div className="flex flex-col gap-4 mb-6 max-h-72 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.key} className="flex gap-3 items-start">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ background: C.creamDk, border: `1px solid ${C.border}` }}>
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: C.brown, color: C.goldLt }}>
                  {item.qty}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold leading-tight" style={{ fontFamily: "var(--font-jost)", color: C.text }}>{item.name}</p>
                <p className="text-[11px] mt-0.5" style={{ fontFamily: "var(--font-jost)", color: C.muted }}>{item.variant}</p>
              </div>
              <p className="text-[13px] font-semibold whitespace-nowrap" style={{ fontFamily: "var(--font-jost)", color: C.text }}>
                {fmtPrice((item.price || 0) * (item.qty || 0))}
              </p>
            </div>
          ))}
        </div>

        {/* Coupon */}
        <div className="flex gap-2 mb-2">
          <input placeholder="Coupon code" value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            disabled={couponApplied}
            className="flex-1 rounded-xl px-4 py-2.5 text-sm border outline-none"
            style={{ fontFamily: "var(--font-jost)", borderColor: C.border, background: couponApplied ? C.border : C.cream, color: C.text }}
            onFocus={(e) => e.target.style.borderColor = C.gold}
            onBlur={(e) => e.target.style.borderColor = C.border}
          />
          {couponApplied ? (
            <button onClick={removeCoupon}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover-lift"
              style={{ fontFamily: "var(--font-jost)", background: C.border, color: C.text }}>
              Remove
            </button>
          ) : (
            <button onClick={applyCoupon} disabled={couponLoading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all hover-lift"
              style={{ fontFamily: "var(--font-jost)", background: `linear-gradient(135deg, ${C.brown}, #5a2e16)`, color: C.goldLt, opacity: couponLoading ? 0.6 : 1 }}>
              {couponLoading ? "Checking…" : "Apply"}
            </button>
          )}
        </div>

        {couponApplied && couponData && (
          <p className="text-xs mb-4 flex items-center gap-1.5" style={{ fontFamily: "var(--font-jost)", color: C.gold, fontWeight: 600 }}>
            <span>✓</span> Code "{couponData.code || coupon.trim().toUpperCase()}" applied —{" "}
            {couponData.discountType === "percent"
              ? `${couponData.discountValue}% off (−${fmtPrice(couponDiscount)})`
              : `−${fmtPrice(couponDiscount)} off`}
          </p>
        )}
        {couponError && (
          <p className="text-xs mb-4 flex items-center gap-1.5" style={{ fontFamily: "var(--font-jost)", color: "#c0392b", fontWeight: 600 }}>
            {couponError}
          </p>
        )}

        {/* Price breakdown */}
        <div className="flex flex-col gap-2.5 pt-5 mt-2" style={{ borderTop: `1px solid ${C.border}` }}>
          {[
            ["Subtotal", fmtPrice(subtotal)],
            couponApplied && couponDiscount > 0 && ["Item Discount", `−${fmtPrice(couponDiscount)}`],
            ["Shipping", shipping === 0 ? "FREE" : fmtPrice(shipping)],
            ["GST (3%)", fmtPrice(gst)],
          ].filter(Boolean).map(([label, val]) => (
            <div key={label} className="flex justify-between items-center">
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: C.muted }} className="font-semibold">{label}</span>
              <span style={{
                fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600,
                color: (String(label).includes("Discount") || (label === "Shipping" && shipping === 0)) ? C.gold : C.text
              }}>
                {val}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center mt-2 rounded-xl px-4 py-4"
            style={{ background: C.brown }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 700, color: C.goldLt, textTransform: "uppercase", letterSpacing: "0.1em" }}>Total</span>
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 700, color: C.white }}>{fmtPrice(total)}</span>
          </div>
        </div>

        {shipping === 0 && (
          <p className="text-xs text-center mt-4 flex items-center justify-center gap-1.5" style={{ fontFamily: "var(--font-jost)", color: C.gold, fontWeight: 600 }}>
            <span>✓</span> You qualify for free shipping
          </p>
        )}

        {/* SSL trust */}
        <div className="flex items-center justify-center gap-2 mt-5 pt-5" style={{ borderTop: `1px solid ${C.border}` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8">
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: C.muted }}>256-bit SSL encrypted checkout</span>
        </div>
      </div>
    </div>
  );
}

/* ─── STEP 1: Bag ─────────────────────────── */
function BagStep({ items, onNext }) {
  const { updateQty, removeItem } = useCart();

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-jost)", fontSize: 24, fontWeight: 600, color: C.text, marginBottom: 4 }}>Your Bag</h2>
      <p className="text-sm mb-7" style={{ fontFamily: "var(--font-jost)", color: C.muted }}>{items.length} {items.length === 1 ? "item" : "items"}</p>

      <div className="flex flex-col gap-4 mb-8">
        {items.map((item) => (
          <div key={item.key} className="rounded-2xl p-4 flex gap-4 transition-all hover:shadow-sm"
            style={{ background: C.white, border: `1.5px solid ${C.border}` }}>
            <Link href={`/products/${item.slug}`} className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0"
              style={{ background: C.creamDk }}>
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="96px" />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link href={`/products/${item.slug}`}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 16, fontWeight: 600, color: C.text }}>{item.name}</p>
                  </Link>
                  {(item.variant || item.size) && (
                    <p className="text-xs mt-0.5" style={{ fontFamily: "var(--font-jost)", color: C.muted }}>{[item.variant, item.size].filter(Boolean).join(" · ")}</p>
                  )}
                  {item.originalPrice && item.originalPrice > item.price && (
                    <p className="text-xs mt-1" style={{ fontFamily: "var(--font-jost)", color: C.muted, textDecoration: "line-through" }}>{fmtPrice(item.originalPrice)}</p>
                  )}
                  <p className="font-bold text-base mt-1" style={{ fontFamily: "var(--font-jost)", color: C.text }}>{fmtPrice(item.price)}</p>
                </div>
                <button onClick={() => removeItem(item.key)} className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: C.cream, color: C.muted }}>✕</button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center rounded-full border overflow-hidden" style={{ borderColor: C.border, background: C.cream }}>
                  <button onClick={() => updateQty(item.key, -1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-white transition-colors"
                    style={{ color: C.brown, fontSize: 16 }}>−</button>
                  <span className="w-7 text-center text-sm font-semibold" style={{ fontFamily: "var(--font-jost)", color: C.text }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.key, 1)}
                    className="w-9 h-9 flex items-center justify-center hover:bg-white transition-colors"
                    style={{ color: C.brown, fontSize: 16 }}>+</button>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 17, fontWeight: 700, color: C.text }}>{fmtPrice((item.price || 0) * (item.qty || 0))}</p>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ background: C.white, border: `1.5px solid ${C.border}` }}>
            <p style={{ fontFamily: "var(--font-jost)", color: C.muted, marginBottom: 12 }}>Your bag is empty.</p>
            <Link href="/shop" style={{ fontFamily: "var(--font-jost)", color: C.gold, fontWeight: 600 }}>Continue shopping →</Link>
          </div>
        )}
      </div>

      <button onClick={onNext} disabled={items.length === 0}
        className="w-full py-4 rounded-full font-bold text-xs uppercase transition-all active:scale-95 hover-lift"
        style={{ fontFamily: "var(--font-jost)", background: `linear-gradient(135deg, ${C.brown} 0%, #5a2e16 100%)`, color: C.goldLt, letterSpacing: "0.2em", opacity: items.length === 0 ? 0.5 : 1, boxShadow: "0 4px 20px rgba(61,31,16,0.25)" }}>
        Continue to Delivery →
      </button>
    </div>
  );
}

/* ─── STEP 2: Delivery ─────────────────── */
function DeliveryStep({ form, setForm, onNext, onBack }) {
  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const valid = form.firstName && form.lastName && form.email && form.phone && form.address && form.city && form.state && form.pin;

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-jost)", fontSize: 24, fontWeight: 600, color: C.text, marginBottom: 4 }}>Delivery Details</h2>
      <p className="text-sm mb-7" style={{ fontFamily: "var(--font-jost)", color: C.muted }}>Where should we send your order?</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Field half label="First Name" name="firstName" value={form.firstName} onChange={handle} placeholder="Aanya" required />
        <Field half label="Last Name" name="lastName" value={form.lastName} onChange={handle} placeholder="Kapoor" required />
        <Field label="Email" name="email" value={form.email} onChange={handle} placeholder="you@example.com" required type="email" />
        <Field label="Phone" name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210" required type="tel" />
        <Field label="Address" name="address" value={form.address} onChange={handle} placeholder="House no., Street, Locality" required />
        <Field half label="City" name="city" value={form.city} onChange={handle} placeholder="Delhi" required />
        <Field half label="State" name="state" value={form.state} onChange={handle} select options={STATES} required />
        <Field half label="PIN Code" name="pin" value={form.pin} onChange={handle} placeholder="110001" required />
        <Field half label="Landmark (optional)" name="landmark" value={form.landmark} onChange={handle} placeholder="Near…" />
      </div>

      {/* Delivery speed */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: "var(--font-jost)", color: C.muted }}>
          Delivery Speed
        </p>
        <div className="flex flex-col gap-3">
          {[
            { id: "standard", label: "Standard Delivery", desc: "5–7 business days", price: "FREE" },
            { id: "express", label: "Express Delivery", desc: "2–3 business days", price: "₹499" },
          ].map((opt) => (
            <label key={opt.id}
              className="flex items-center justify-between rounded-2xl px-5 py-4 cursor-pointer transition-all"
              style={{
                border: `1.5px solid ${form.delivery === opt.id ? C.gold : C.border}`,
                background: form.delivery === opt.id ? "#fdf8f0" : C.white,
                boxShadow: form.delivery === opt.id ? `0 2px 12px ${C.gold}20` : "none",
              }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.creamDk }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.brown} strokeWidth="1.8">
                    {opt.id === "express"
                      ? <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" strokeLinejoin="round" />
                      : <><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="1.5" /><circle cx="18.5" cy="18.5" r="1.5" /></>}
                  </svg>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 600, color: C.text }}>{opt.label}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: C.muted }}>{opt.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 700, color: opt.price === "FREE" ? C.gold : C.text }}>{opt.price}</span>
                <input type="radio" name="delivery" value={opt.id} checked={form.delivery === opt.id} onChange={handle}
                  style={{ accentColor: C.gold, width: 16, height: 16 }} />
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="px-6 py-4 rounded-full font-bold text-xs uppercase transition-all hover:bg-[#f0e9df]"
          style={{ fontFamily: "var(--font-jost)", border: `1.5px solid ${C.border}`, color: C.brown, letterSpacing: "0.15em" }}>
          ← Back
        </button>
        <button onClick={onNext} disabled={!valid}
          className="flex-1 py-4 rounded-full font-bold text-xs uppercase transition-all active:scale-95 hover-lift"
          style={{ fontFamily: "var(--font-jost)", background: `linear-gradient(135deg, ${C.brown} 0%, #5a2e16 100%)`, color: C.goldLt, letterSpacing: "0.2em", opacity: valid ? 1 : 0.5, boxShadow: "0 4px 20px rgba(61,31,16,0.25)" }}>
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}

/* ─── STEP 3: Payment ──────────────────── */
function PaymentStep({ payment, setPayment, onNext, onBack, placing, placeError }) {
  const setMethod = (m) => setPayment((p) => ({ ...p, method: m }));
  const handle = (e) => setPayment((p) => ({ ...p, [e.target.name]: e.target.value }));

  const methods = [
    {
      id: "prepaid", label: "Pay Online", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
      )
    },
    {
      id: "cod", label: "Cash on Delivery", icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9.5h3.5a1.5 1.5 0 010 3H9a1.5 1.5 0 000 3h4" /></svg>
      )
    },
  ];
  const valid = !!payment.method;

  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 600, color: C.text, marginBottom: 4 }}>Payment</h2>
      <p className="text-sm mb-7" style={{ fontFamily: "var(--font-jost)", color: C.muted }}>Choose your preferred payment method</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {methods.map((m) => (
          <button key={m.id} onClick={() => setMethod(m.id)}
            className="flex items-center gap-3 rounded-2xl px-4 py-4 transition-all text-left"
            style={{
              border: `1.5px solid ${payment.method === m.id ? C.gold : C.border}`,
              background: payment.method === m.id ? "#fdf8f0" : C.white,
              boxShadow: payment.method === m.id ? `0 2px 12px ${C.gold}22` : "none",
              color: payment.method === m.id ? C.brown : C.muted,
            }}>
            {m.icon}
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600, color: C.text }}>{m.label}</span>
          </button>
        ))}
      </div>

      {payment.method === "prepaid" && (
        <div className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3" style={{ background: "#fdf8f0", border: `1px solid ${C.border}` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></svg>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: C.muted }}>You'll be redirected to Razorpay to pay securely via Card, UPI, Netbanking, or Wallet.</p>
        </div>
      )}
      {payment.method === "cod" && (
        <div className="mb-6 rounded-2xl px-5 py-4 flex items-center gap-3" style={{ background: "#fdf8f0", border: `1px solid ${C.border}` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.gold} strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9.5h3.5a1.5 1.5 0 010 3H9a1.5 1.5 0 000 3h4" /></svg>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: C.muted }}>Pay in cash when your order is delivered. A small COD fee may apply.</p>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl" style={{ background: C.creamDk }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.brown} strokeWidth="1.8">
          <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#5a2e16" }}>Your payment information is encrypted and secure.</span>
      </div>

      {placeError && (
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#c0392b", marginBottom: 12 }}>{placeError}</p>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="px-6 py-4 rounded-full font-bold text-xs uppercase transition-all hover:bg-[#f0e9df]"
          style={{ fontFamily: "var(--font-jost)", border: `1.5px solid ${C.border}`, color: C.brown, letterSpacing: "0.15em" }}>
          ← Back
        </button>
        <button onClick={onNext} disabled={!valid || placing}
          className="flex-1 py-4 rounded-full font-bold text-xs uppercase transition-all active:scale-95 hover-lift"
          style={{ fontFamily: "var(--font-jost)", background: `linear-gradient(135deg, ${C.brown} 0%, #5a2e16 100%)`, color: C.goldLt, letterSpacing: "0.2em", opacity: (valid && !placing) ? 1 : 0.5, boxShadow: "0 4px 20px rgba(61,31,16,0.25)" }}>
          {placing ? "Placing Order…" : "Place Order →"}
        </button>
      </div>
    </div>
  );
}

/* ─── STEP 4: Confirmation ─────────────── */
function ConfirmStep({ form, total, orderId }) {
  return (
    <div className="text-center py-8 max-w-lg mx-auto">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${C.brown}, #5a2e16)`, boxShadow: "0 8px 32px rgba(61,31,16,0.35)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.goldLt} strokeWidth="2.5">
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </div>
        <div className="absolute -inset-2 rounded-full border-2 border-dashed" style={{ borderColor: C.gold + "66" }} />
      </div>

      <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: 30, fontWeight: 600, color: C.text, marginBottom: 8 }}>
        Thank you, {form.firstName}!
      </h2>
      <p className="mb-8 leading-relaxed" style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: C.muted }}>
        Your order has been placed. A confirmation has been sent to{" "}
        <strong style={{ color: C.text }}>{form.email}</strong>.
      </p>

      <div className="rounded-3xl p-6 mb-8 text-left" style={{ background: C.white, border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(26,12,6,0.06)" }}>
        <div className="grid grid-cols-3 gap-4">
          {[
            ["Order ID", orderId],
            ["Est. Delivery", form.delivery === "express" ? "2–3 days" : "5–7 days"],
            ["Total Paid", fmtPrice(total)],
          ].map(([label, val]) => (
            <div key={label} className="text-center p-3 rounded-xl" style={{ background: C.creamDk }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: C.muted, marginBottom: 4 }}>{label}</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 700, color: C.text }}>{val}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/shop"
          className="px-8 py-4 rounded-full font-bold text-xs uppercase transition-all hover-lift active:scale-95"
          style={{ fontFamily: "var(--font-jost)", background: `linear-gradient(135deg, ${C.brown}, #5a2e16)`, color: C.goldLt, letterSpacing: "0.2em", boxShadow: "0 4px 20px rgba(61,31,16,0.25)" }}>
          Continue Shopping
        </Link>
        <Link href="/account"
          className="px-8 py-4 rounded-full font-bold text-xs uppercase transition-all hover:bg-[#f0e9df]"
          style={{ fontFamily: "var(--font-jost)", border: `1.5px solid ${C.border}`, color: C.brown, letterSpacing: "0.15em" }}>
          View Order
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════ */
export default function CheckoutScreen() {
  const { items: cartItems, setItems: setCartItems, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const items = cartItems;
  const setItems = setCartItems;
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [orderId] = useState(`LX${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/account?redirect=checkout");
    }
  }, [authLoading, user, router]);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", pin: "", landmark: "",
    delivery: "standard",
  });
  const [payment, setPayment] = useState({ method: "prepaid" });
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState("");
  const [orderResult, setOrderResult] = useState(null);

  const subtotal = items.reduce((s, i) => s + (i.price || 0) * (i.qty || 0), 0);

  const applyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    setCouponError("");
    if (!code) return;
    setCouponLoading(true);
    try {
      const res = await authFetch("/coupons/validate", {
        method: "POST",
        body: JSON.stringify({ code, orderValue: subtotal }),
      });
      const data = res.data ?? res;

      // Normalize: backend returns { coupon, discount }
      const normalized = {
        discountType: data.coupon.discountType,
        discountValue: data.coupon.discountValue,
        maxDiscount: data.coupon.maxDiscount,
        code: data.coupon.code,
        precomputedDiscount: data.discount,
      };

      setCouponData(normalized);
      setCouponApplied(true);
      setCouponError("");
    } catch (err) {
      setCouponApplied(false);
      setCouponData(null);
      setCouponError(err.message || "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setCouponApplied(false);
    setCouponData(null);
    setCouponError("");
  };

  // USE precomputedDiscount from backend directly
  const couponDiscount = (couponApplied && couponData?.precomputedDiscount)
    ? Math.min(couponData.precomputedDiscount, subtotal)
    : 0;

  const shipping = form.delivery === "express" ? 499 : subtotal > 50000 ? 0 : 80;
  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const gst = Math.round(taxableAmount * 0.03);
  const total = Math.max(0, (subtotal || 0) - (couponDiscount || 0) + (shipping || 0) + (gst || 0));

  const placeOrder = async () => {
    setPlaceError("");
    setPlacing(true);
    try {
      const res = await authFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: items.map((i) => ({
            product: i.id,
            quantity: i.qty,
            variantLabel: i.variant || undefined,
          })),
          shippingAddress: {
            name: `${form.firstName} ${form.lastName}`.trim(),
            phone: form.phone,
            line1: form.address,
            line2: form.landmark || undefined,
            city: form.city,
            state: form.state,
            pincode: form.pin,
          },
          paymentMethod: payment.method === "cod" ? "cod" : "prepaid",
          couponCode: couponApplied ? coupon.trim().toUpperCase() : undefined,
        }),
      });
      const newOrder = res.data;

      if (payment.method === "cod") {
        setOrderResult(newOrder);
        await clearCart();
        setStep(3);
        setPlacing(false);
        return;
      }

      if (typeof window === "undefined" || !window.Razorpay) {
        setPlaceError("Payment gateway failed to load. Please refresh and try again.");
        setPlacing(false);
        return;
      }

      const rpRes = await authFetch("/payments/razorpay/order", {
        method: "POST",
        body: JSON.stringify({ orderId: newOrder._id }),
      });
      const { razorpayOrderId, amount, currency, keyId } = rpRes.data;

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency,
        order_id: razorpayOrderId,
        name: "Luxéor Fine Jewellery",
        description: `Order ${newOrder.orderNumber}`,
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#3d1f10" },
        handler: async (response) => {
          try {
            await authFetch("/payments/razorpay/verify", {
              method: "POST",
              body: JSON.stringify({
                orderId: newOrder._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            setOrderResult(newOrder);
            await clearCart();
            setStep(3);
          } catch (err) {
            setPlaceError(err.message || "Payment verification failed. Please contact support.");
          } finally {
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPlaceError("Payment cancelled. You can try again.");
            setPlacing(false);
          },
        },
      });

      rzp.open();
    } catch (err) {
      setPlaceError(err.message || "Failed to place order. Please try again.");
      setPlacing(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: C.cream }}>
        <div style={{ background: C.brown, paddingTop: 114 }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-10 text-center">
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, letterSpacing: "0.3em", color: C.gold, fontWeight: 600, textTransform: "uppercase" }}>
              Secure Checkout
            </span>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 600, color: C.goldLt, marginTop: 8 }}>
              Checkout
            </h1>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "rgba(245,239,232,0.6)", marginTop: 10, letterSpacing: "0.04em" }}>
              Your information is protected with SSL encryption
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
          <div className="relative z-10" style={{ marginTop: -32 }}>
            <div className="rounded-3xl px-6 pt-12 sm:px-8 flex items-center justify-center" style={{ background: C.white, border: `1.5px solid ${C.border}`, boxShadow: "0 12px 40px rgba(26,12,6,0.08)" }}>
              <StepBar step={step} />
            </div>
          </div>

          <div className={step === 3 ? "max-w-2xl mx-auto mt-8" : "grid gap-8 lg:grid-cols-[1fr_360px] mt-8 items-start"}>
            <div className="rounded-3xl p-6 sm:p-8"
              style={{
                background: step === 3 ? "transparent" : C.white,
                border: step === 3 ? "none" : `1.5px solid ${C.border}`,
                boxShadow: step === 3 ? "none" : "0 8px 40px rgba(26,12,6,0.05)",
              }}>
              {step === 0 && <BagStep items={items} onNext={() => setStep(1)} />}
              {step === 1 && <DeliveryStep form={form} setForm={setForm} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
              {step === 2 && <PaymentStep payment={payment} setPayment={setPayment} onNext={placeOrder} onBack={() => setStep(1)} placing={placing} placeError={placeError} />}
              {step === 3 && <ConfirmStep form={form} total={total} orderId={orderResult?.orderNumber || orderId} />}
            </div>

            {step !== 3 && (
              <OrderSummary
                items={items} coupon={coupon} setCoupon={setCoupon}
                couponApplied={couponApplied} couponData={couponData} couponError={couponError}
                couponLoading={couponLoading} applyCoupon={applyCoupon} removeCoupon={removeCoupon}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}