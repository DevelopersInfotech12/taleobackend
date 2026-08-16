"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import GoogleSignInButton from "../Components/auth/GoogleSignInButton";
import { useAuth, authFetch } from "../lib/AuthContext";
import { useCart } from "../lib/CartContext";
import { fmtPrice, fmtDate, imgUrl } from "../lib/api";

const C = {
  dark: "#1a0c06",
  brown: "#3d1f10",
  gold: "#b08850",
  goldLt: "#c9a96e",
  cream: "#f5efe8",
  border: "#e8ddd0",
  muted: "#8a7560",
  text: "#2a1a0e",
  white: "#ffffff",
};

function Field({ label, name, type = "text", value, onChange, required, autoComplete }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
        style={{ fontFamily: "var(--font-jost)", color: C.muted }}>
        {label}{required && <span style={{ color: C.gold }}> *</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={onChange}
        required={required} autoComplete={autoComplete}
        style={{
          fontFamily: "var(--font-jost)", fontSize: 14, color: C.text,
          background: C.white, border: `1.5px solid ${C.border}`,
          borderRadius: 12, padding: "13px 16px", width: "100%", outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => { e.target.style.borderColor = C.gold; e.target.style.boxShadow = `0 0 0 3px ${C.gold}22`; }}
        onBlur={(e) => { e.target.style.borderColor = C.border; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px" style={{ background: C.border }} />
      <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: C.muted, letterSpacing: "0.1em" }}>OR</span>
      <div className="flex-1 h-px" style={{ background: C.border }} />
    </div>
  );
}

function LoginForm({ onSwitch }) {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form);
      router.push("/account");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async (credential) => {
    setError("");
    setBusy(true);
    try {
      await loginWithGoogle(credential);
      router.push("/account");
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.1rem,2.1vw,1rem)", fontWeight: 600, color: C.text }}>
        Sign In to Your Account
      </h1>
      <div className="mb-2">
        <GoogleSignInButton onCredential={handleGoogle} />
      </div>
      <Divider />
      {error && <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#c0392b", marginBottom: 16 }}>{error}</p>}
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
        <Field label="Password" name="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="current-password" />
        <button type="submit" disabled={busy} className="w-full rounded-full py-3.5 text-[13px] font-bold uppercase tracking-[0.15em] transition-opacity mt-2 text-[#fff] font-poppins"
          style={{ background: `linear-gradient(135deg, ${C.brown} 0%, #5a2e16 100%)`, boxShadow: "0 4px 20px rgba(26,12,6,0.25)", opacity: busy ? 0.6 : 1 }}>
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: C.muted, marginTop: 24, textAlign: "center" }}>
        New here?{" "}
        <button onClick={onSwitch} style={{ color: C.gold, fontWeight: 600, textDecoration: "underline" }}>Create an account</button>
      </p>
    </>
  );
}

function RegisterForm({ onSwitch }) {
  const { register, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      router.push("/account");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async (credential) => {
    setError("");
    setBusy(true);
    try {
      await loginWithGoogle(credential);
      router.push("/account");
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="mb-4" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.1rem,2.1vw,1rem)", fontWeight: 600, color: C.text }}>
        Register Your Account
      </h1>
      <div className="mb-2">
        <GoogleSignInButton onCredential={handleGoogle} text="signup_with" />
      </div>
      <Divider />
      {error && <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#c0392b", marginBottom: 16 }}>{error}</p>}
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field label="Full Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
        <Field label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
        <Field label="Password" name="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="new-password" />
        <button type="submit" disabled={busy} className="w-full rounded-full py-3.5 text-[13px] font-bold uppercase tracking-[0.15em] transition-opacity mt-2 text-[#fff] font-poppins"
          style={{ background: `linear-gradient(135deg, ${C.brown} 0%, #5a2e16 100%)`, boxShadow: "0 4px 20px rgba(26,12,6,0.25)", opacity: busy ? 0.6 : 1 }}>
          {busy ? "Creating account…" : "Create Account"}
        </button>
      </form>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: C.muted, marginTop: 24, textAlign: "center" }}>
        Already have an account?{" "}
        <button onClick={onSwitch} style={{ color: C.gold, fontWeight: 600, textDecoration: "underline" }}>Sign in</button>
      </p>
    </>
  );
}

/* ─── Icons ──────────────────────────────────────── */
const Icon = {
  user: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>),
  bag: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>),
  box: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>),
  heart: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>),
  logout: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>),
  chevron: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>),
  trash: (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>),
};

/* ─── Status badge ──────────────────────────────────────── */
function StatusBadge({ status }) {
  const s = (status || "pending").toLowerCase();
  const map = {
    pending: { bg: "#fdf3e3", fg: "#a9762f" },
    processing: { bg: "#fdf3e3", fg: "#a9762f" },
    confirmed: { bg: "#eef3ee", fg: "#5c8a6a" },
    shipped: { bg: "#eaf1f7", fg: "#3f6f9c" },
    delivered: { bg: "#eef6ee", fg: "#4a8a4a" },
    cancelled: { bg: "#fbeceb", fg: "#c0392b" },
    refunded: { bg: "#f1eef6", fg: "#7d5fa6" },
  };
  const c = map[s] || map.pending;
  return (
    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ fontFamily: "var(--font-jost)", background: c.bg, color: c.fg }}>
      {s}
    </span>
  );
}

/* ─── Order card ──────────────────────────────────────── */
function OrderCard({ order, expanded, onToggle }) {
  const items = order.items || order.orderItems || [];
  const total = order.total ?? order.totalPrice ?? order.totalAmount ?? 0;
  const orderId = order.orderNumber || order._id?.slice(-8)?.toUpperCase();

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: C.white, border: `1.5px solid ${C.border}` }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.cream, color: C.gold }}>
            <Icon.box style={{ width: 20, height: 20 }} />
          </div>
          <div className="min-w-0">
            <p style={{ fontSize: 13, fontWeight: 700, color: C.text }} className="font-poppins">Order #{orderId}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: C.muted, marginTop: 2 }}>
              {fmtDate(order.createdAt)} • {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block"><StatusBadge status={order.status} /></div>
          <p style={{ fontSize: 16, fontWeight: 700, color: C.text }} className="font-poppins">{fmtPrice(total)}</p>
          <Icon.chevron style={{ width: 16, height: 16, color: C.muted, transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.2s" }} />
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-1" style={{ borderTop: `1px solid ${C.border}` }}>
          <div className="sm:hidden mb-3 mt-3"><StatusBadge status={order.status} /></div>
          <div className="flex flex-col gap-3 mt-3">
            {items.map((it, idx) => (
              <div key={it._id || idx} className="flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ background: C.cream, border: `1px solid ${C.border}` }}>
                  {it.image && <img src={imgUrl(it.image)} alt={it.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0 font-poppins">
                  <p style={{ fontSize: 13, fontWeight: 600, color: C.text }} className="truncate">{it.name}</p>
                  <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{[it.variant, it.size].filter(Boolean).join(" / ") || "—"} • Qty {it.qty}</p>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{fmtPrice((it.price || 0) * (it.qty || 1))}</p>
              </div>
            ))}
          </div>
          {order.shippingAddress && (
            <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Delivery Address</p>
              <p style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                {[order.shippingAddress.fullName, order.shippingAddress.address, order.shippingAddress.city,
                order.shippingAddress.state, order.shippingAddress.postalCode, order.shippingAddress.country].filter(Boolean).join(", ")}
              </p>
            </div>
          )}
          <div className="mt-4 pt-4 flex flex-col gap-2" style={{ borderTop: `1px solid ${C.border}` }}>
            {order.subtotal != null && <Row label="Subtotal" value={fmtPrice(order.subtotal)} />}
            {order.shippingCost != null && <Row label="Shipping" value={order.shippingCost ? fmtPrice(order.shippingCost) : "Free"} />}
            {order.discount > 0 && <Row label="Discount" value={`− ${fmtPrice(order.discount)}`} />}
            <Row label="Total" value={fmtPrice(total)} bold />
            {order.paymentMethod && <Row label="Payment Method" value={String(order.paymentMethod).toUpperCase()} />}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between font-poppins">
      <span style={{ fontSize: 13, color: bold ? C.text : C.muted, fontWeight: bold ? 700 : 500 }}>{label}</span>
      <span style={{ fontFamily: bold ? "var(--font-playfair)" : "var(--font-jost)", fontSize: bold ? 16 : 13, color: C.text, fontWeight: bold ? 700 : 600 }}>{value}</span>
    </div>
  );
}

/* ─── Orders tab ──────────────────────────────────────── */
function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch("/orders/my");
        setOrders(res.data?.orders ?? res.data ?? []);
      } catch (err) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: C.muted }}>Loading orders…</p>;
  if (error) return <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#c0392b" }}>{error}</p>;
  if (!orders.length) {
    return (
      <div className="text-center py-14 rounded-2xl font-poppins" style={{ background: C.white, border: `1.5px solid ${C.border}` }}>
        <Icon.box style={{ width: 36, height: 36, color: C.muted, margin: "0 auto 14px" }} />
        <p style={{ fontSize: 18, fontWeight: 600, color: C.text }}>No orders yet</p>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>When you place an order, it will show up here.</p>
        <Link href="/shop" className="inline-block mt-5 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.15em]"
          style={{ background: `linear-gradient(135deg, ${C.brown} 0%, #5a2e16 100%)`, color: C.goldLt }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((o) => (
        <OrderCard key={o._id} order={o} expanded={openId === o._id} onToggle={() => setOpenId(openId === o._id ? null : o._id)} />
      ))}
    </div>
  );
}

/* ─── Wishlist tab ──────────────────────────────────────── */
function WishlistTab() {
  const { addToCart } = useCart();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch("/wishlist");
        setItems(res.data ?? []);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const removeItem = async (productId) => {
    try {
      await authFetch(`/wishlist/${productId}`, { method: "POST" }); // toggle = remove
      setItems((prev) => prev.filter((p) => p._id !== productId));
    } catch { }
  };

  const handleAddToCart = (p) => {
    addToCart(
      { id: p._id, slug: p.slug, name: p.name, image: p.images?.[0] || "", price: p.price, originalPrice: p.comparePrice },
      { variant: "", size: "", qty: 1 }
    );
  };

  if (loading) return <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: C.muted }}>Loading wishlist…</p>;

  if (!items.length) {
    return (
      <div className="text-center py-14 rounded-2xl font-poppins" style={{ background: C.white, border: `1.5px solid ${C.border}` }}>
        <Icon.heart style={{ width: 36, height: 36, color: C.muted, margin: "0 auto 14px" }} />
        <p style={{ fontSize: 18, fontWeight: 600, color: C.text }}>No saved items</p>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>Tap the heart on any product to save it here.</p>
        <Link href="/shop" className="inline-block mt-5 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.15em]"
          style={{ background: `linear-gradient(135deg, ${C.brown} 0%, #5a2e16 100%)`, color: C.goldLt }}>
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map((p) => (
        <div key={p._id} className="rounded-2xl overflow-hidden flex gap-4 p-4"
          style={{ background: C.white, border: `1.5px solid ${C.border}` }}>
          {/* Image */}
          <Link href={`/products/${p.slug}`} className="shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden" style={{ background: C.cream }}>
              {p.images?.[0] && (
                <img src={imgUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover" />
              )}
            </div>
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0 font-poppins">
            <Link href={`/products/${p.slug}`} style={{ textDecoration: "none" }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.text }} className="truncate">{p.name}</p>
            </Link>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.text, marginTop: 4 }}>{fmtPrice(p.price)}</p>
            {p.comparePrice > 0 && (
              <p style={{ fontSize: 11, color: C.muted, textDecoration: "line-through" }}>{fmtPrice(p.comparePrice)}</p>
            )}

            <div className="flex gap-2 mt-3">
              <button onClick={() => handleAddToCart(p)}
                className="flex-1 rounded-full py-1.5 text-xs font-bold uppercase tracking-wider"
                style={{ background: `linear-gradient(135deg, ${C.brown} 0%, #5a2e16 100%)`, color: C.goldLt }}>
                Add to Cart
              </button>
              <button onClick={() => removeItem(p._id)} aria-label="Remove"
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: C.cream, border: `1px solid ${C.border}` }}>
                <Icon.trash style={{ width: 14, height: 14, color: "#c0392b" }} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Cart tab ──────────────────────────────────────── */
function CartTab() {
  const { items, updateQty, removeItem, count } = useCart();
  const subtotal = items.reduce((s, i) => s + (i.price || 0) * i.qty, 0);

  if (!items.length) {
    return (
      <div className="text-center py-14 rounded-2xl font-poppins" style={{ background: C.white, border: `1.5px solid ${C.border}` }}>
        <Icon.bag style={{ width: 36, height: 36, color: C.muted, margin: "0 auto 14px" }} />
        <p style={{ fontSize: 18, fontWeight: 600, color: C.text }}>Your bag is empty</p>
        <p style={{ fontSize: 13, color: C.muted, marginTop: 6 }}>Add something beautiful to it.</p>
        <Link href="/shop" className="inline-block mt-5 rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[0.15em]"
          style={{ background: `linear-gradient(135deg, ${C.brown} 0%, #5a2e16 100%)`, color: C.goldLt }}>
          Browse Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl overflow-hidden" style={{ background: C.white, border: `1.5px solid ${C.border}` }}>
        {items.map((it, idx) => (
          <div key={it.key} className="flex items-center gap-4 px-5 py-4"
            style={{ borderTop: idx === 0 ? "none" : `1px solid ${C.border}` }}>
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ background: C.cream, border: `1px solid ${C.border}` }}>
              {it.image && <img src={imgUrl(it.image)} alt={it.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0 font-poppins">
              <p style={{ fontSize: 14, fontWeight: 600, color: C.text }} className="truncate">{it.name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: C.muted, marginTop: 2 }}>
                {[it.variant, it.size].filter(Boolean).join(" / ") || "—"}
              </p>
              <p style={{ fontSize: 15, fontWeight: 700, color: C.text, marginTop: 4 }}>{fmtPrice(it.price)}</p>
            </div>
            <div className="flex items-center rounded-full border overflow-hidden flex-shrink-0 font-poppins" style={{ borderColor: C.border, background: C.cream }}>
              <button onClick={() => updateQty(it.key, -1)} className="w-8 h-8 flex items-center justify-center text-base" style={{ color: C.text }}>−</button>
              <span className="w-8 text-center text-sm font-semibold" style={{ color: C.text }}>{it.qty}</span>
              <button onClick={() => updateQty(it.key, 1)} className="w-8 h-8 flex items-center justify-center text-base" style={{ color: C.text }}>+</button>
            </div>
            <button onClick={() => removeItem(it.key)} aria-label="Remove"
              className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0" style={{ color: C.muted }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
            </button>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-5 flex items-center justify-between font-poppins" style={{ background: C.white, border: `1.5px solid ${C.border}` }}>
        <div>
          <p style={{ fontSize: 12, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{count} item{count !== 1 ? "s" : ""}</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: C.text, marginTop: 2 }}>{fmtPrice(subtotal)}</p>
        </div>
        <Link href="/checkout" className="rounded-full px-7 py-3.5 text-xs font-bold uppercase tracking-[0.15em]"
          style={{ background: `linear-gradient(135deg, ${C.brown} 0%, #5a2e16 100%)`, color: C.goldLt, boxShadow: "0 4px 20px rgba(26,12,6,0.25)" }}>
          Checkout →
        </Link>
      </div>
    </div>
  );
}

/* ─── Profile tab ──────────────────────────────────────── */
function ProfileTab() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl p-6" style={{ background: C.white, border: `1.5px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-5 font-poppins">
          <p style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700 }}>Personal Details</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-5 font-poppins">
          <div>
            <p style={{ fontWeight: 700, fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Full Name</p>
            <p style={{ fontSize: 17, fontWeight: 600, color: C.text, marginTop: 4 }}>{user.name}</p>
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Email Address</p>
            <p style={{ fontSize: 17, fontWeight: 600, color: C.text, marginTop: 4 }}>{user.email}</p>
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Phone Number</p>
            <p style={{ fontSize: 17, fontWeight: 600, color: C.text, marginTop: 4 }}>{user.phone || "Not set"}</p>
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Member Since</p>
            <p style={{ fontSize: 17, fontWeight: 600, color: C.text, marginTop: 4 }}>{fmtDate(user.createdAt) || "—"}</p>
          </div>
        </div>
      </div>
      {Array.isArray(user.addresses) && user.addresses.length > 0 && (
        <div className="rounded-2xl p-6" style={{ background: C.white, border: `1.5px solid ${C.border}` }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "0.15em", fontWeight: 700, marginBottom: 14 }}>Saved Addresses</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {user.addresses.map((a, i) => (
              <div key={a._id || i} className="rounded-xl p-4" style={{ background: C.cream, border: `1px solid ${C.border}` }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: C.text }}>{a.fullName || user.name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: C.muted, marginTop: 4, lineHeight: 1.6 }}>
                  {[a.address, a.city, a.state, a.postalCode, a.country].filter(Boolean).join(", ")}
                </p>
                {a.phone && <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: C.muted, marginTop: 4 }}>📞 {a.phone}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Sidebar nav ──────────────────────────────────────── */
function SideNav({ tab, setTab, user, onLogout, cartCount, ordersCount, wishlistCount }) {
  const items = [
    { id: "profile", label: "Profile", icon: Icon.user },
    { id: "orders", label: "Orders", icon: Icon.box, count: ordersCount },
    { id: "wishlist", label: "Wishlist", icon: Icon.heart, count: wishlistCount },
    { id: "cart", label: "My Cart", icon: Icon.bag, count: cartCount },
  ];

  return (
    <div className="rounded-3xl p-5 sm:p-6 flex flex-col gap-1 sticky top-32"
      style={{ background: C.white, border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(26,12,6,0.05)" }}>
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ background: C.brown }}>
          {user.avatar
            ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            : <span className="w-full h-full flex items-center justify-center text-lg font-semibold"
              style={{ color: C.goldLt, fontFamily: "var(--font-playfair)" }}>
              {user.name?.[0]?.toUpperCase()}
            </span>
          }
        </div>
        <div className="min-w-0 font-poppins">
          <p style={{ fontSize: 15, fontWeight: 700, color: C.text }} className="truncate">{user.name}</p>
          <p style={{ fontSize: 11, color: C.muted }} className="truncate">{user.email}</p>
        </div>
      </div>

      {items.map((it) => (
        <button key={it.id} onClick={() => setTab(it.id)}
          className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl text-left transition-colors"
          style={{ fontSize: 13, fontWeight: 700, background: tab === it.id ? C.cream : "transparent", color: tab === it.id ? C.text : C.muted }}>
          <span className="flex items-center gap-3">
            <it.icon style={{ width: 17, height: 17, color: tab === it.id ? C.gold : C.muted }} />
            {it.label}
          </span>
          {!!it.count && (
            <span className="text-[10px] font-bold rounded-full px-2 py-0.5"
              style={{ background: tab === it.id ? C.gold : C.border, color: tab === it.id ? C.dark : C.muted }}>
              {it.count}
            </span>
          )}
        </button>
      ))}

      <div className="h-px my-2" style={{ background: C.border }} />

      <button onClick={onLogout} className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-left font-poppins"
        style={{ fontSize: 13, fontWeight: 700, color: "#c0392b" }}>
        <Icon.logout style={{ width: 17, height: 17 }} />
        Log Out
      </button>
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────── */
function Dashboard() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const router = useRouter();
  const [tab, setTab] = useState("profile");
  const [ordersCount, setOrdersCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [ordRes, wishRes] = await Promise.all([
          authFetch("/orders/my"),
          authFetch("/wishlist"),
        ]);
        const orders = ordRes.data?.orders ?? ordRes.data ?? [];
        setOrdersCount(Array.isArray(orders) ? orders.length : 0);
        setWishlistCount(Array.isArray(wishRes.data) ? wishRes.data.length : 0);
      } catch { }
    })();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const tabLabels = { profile: "My Profile", orders: "My Orders", wishlist: "My Wishlist", cart: "My Cart" };

  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
      <SideNav tab={tab} setTab={setTab} user={user} onLogout={handleLogout}
        cartCount={count} ordersCount={ordersCount} wishlistCount={wishlistCount} />
      <div>
        <h1 className="mb-6 mt-16" style={{ fontSize: "clamp(1.6rem,2.8vw,2.2rem)", fontWeight: 600, color: C.text }}>
          {tabLabels[tab]}
        </h1>
        {tab === "profile" && <ProfileTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "wishlist" && <WishlistTab />}
        {tab === "cart" && <CartTab />}
      </div>
    </div>
  );
}

/* ─── Main export ──────────────────────────────────────── */
export default function AccountScreen() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState("login");

  return (
    <>
      <Navbar />
      <main className="min-h-screen" style={{ background: C.cream }}>
        <div style={{ background: C.brown, paddingTop: 114 }}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 text-center">
            <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 600, color: C.goldLt, marginTop: 8 }}>
              {user ? "My Account" : "Welcome to Taleo"}
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, color: C.muted, textAlign: "center" }}>Loading…</p>
          </div>
        ) : user ? (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16" style={{ marginTop: -32 }}>
            <Dashboard />
          </div>
        ) : (
          <div className="max-w-md mx-auto px-4 sm:px-6 pb-16" style={{ marginTop: -90 }}>
            <div className="rounded-3xl p-6 sm:p-10"
              style={{ background: C.white, border: `1.5px solid ${C.border}`, boxShadow: "0 8px 40px rgba(26,12,6,0.05)" }}>
              {mode === "login"
                ? <LoginForm onSwitch={() => setMode("register")} />
                : <RegisterForm onSwitch={() => setMode("login")} />}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}