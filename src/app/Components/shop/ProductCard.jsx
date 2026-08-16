"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useCart } from "../../lib/CartContext";
import { useAuth, authFetch } from "../../lib/AuthContext";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'Inter', sans-serif";

export default function ProductCard({
  id,
  slug,
  image = "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
  images,
  name = "Royal Heritage Necklace",
  category = "22K Gold · Handcrafted",
  description = "An heirloom-grade piece crafted by hand in small batches — made to be worn and remembered.",
  price = 45999,
  originalPrice = 52999,
  rating = 4.9,
  reviews = 124,
  badge = "NEW",
  badgeColor = "#8fbc8b",
  variants,
  onAddToCart,
}) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishBusy, setWishBusy] = useState(false);

  // Sync wishlist state from user object
  useEffect(() => {
    if (user?.wishlist && id) {
      setWishlisted(user.wishlist.some((w) => (w._id || w) === id));
    }
  }, [user, id]);

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAdded(true);
    addToCart(
      { id, slug, name, image: images?.[0] || image, price, originalPrice },
      { variant: variants?.[0] || "", size: "", qty: 1 }
    );
    onAddToCart?.();
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = "/account";
      return;
    }
    if (wishBusy) return;
    setWishBusy(true);
    try {
      const res = await authFetch(`/wishlist/${id}`, { method: "POST" });
      setWishlisted(res.data?.action === "added");
    } catch {
      // silent fail
    } finally {
      setWishBusy(false);
    }
  };

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative w-full overflow-hidden rounded-2xl flex flex-col h-full transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-15px_rgba(76,42,25,0.2)] bg-white dark:bg-[#1a1a1a]"
      style={{ background: "var(--cream-dk)", border: "1px solid var(--border-color, #e8ddd0)" }}
    >
      {/* ── Image ── */}
      <div className="relative h-72 sm:h-72 overflow-hidden flex-shrink-0">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, 384px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <span
            className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full"
            style={{
              fontFamily: BODY,
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              background: "rgba(0,0,0,0.6)",
              color: badgeColor,
              border: `1px solid ${badgeColor}55`,
            }}
          >
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full" style={{ background: badgeColor }} />
            {badge}
          </span>
        </div>

        {/* Discount pill */}
        {discount > 0 && (
          <div className="absolute top-2 right-8 sm:top-3 sm:right-10">
            <span
              className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 shadow-lg"
              style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, background: "#4C2A19", color: "#E8CDBC" }}
            >
              {discount}% OFF
            </span>
          </div>
        )}

        {/* Wishlist button */}
        <button
          aria-label="Add to wishlist"
          onClick={handleWishlist}
          disabled={wishBusy}
          className="absolute right-2 top-2 sm:right-3 sm:top-3 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: wishlisted ? "rgba(176,56,56,0.85)" : "rgba(0,0,0,0.4)",
            border: wishlisted ? "1px solid rgba(255,100,100,0.4)" : "none",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 22" fill={wishlisted ? "#fff" : "none"} stroke={wishlisted ? "#fff" : "#ccc"} strokeWidth="2">
            <path d="M12 21C12 21 2 13.5 2 7a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 6.5-10 14-10 14z" />
          </svg>
        </button>
      </div>

      {/* ── Details ── */}
      <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 flex-1">

        <div className="flex items-start justify-between gap-1.5">
          <div className="min-w-0 flex-1">
            <p
              className="line-clamp-2 font-poppins"
              style={{ fontFamily: BODY, fontSize: 16, fontWeight: 700, color: "var(--text)", lineHeight: 1.3 }}
            >
              {name}
            </p>
            <p style={{ fontFamily: BODY, fontSize: 10, color: "var(--text)", opacity: 0.55, marginTop: 2 }}>
              {category}
            </p>
          </div>

          <div
            className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0"
            style={{ background: "var(--cream)", border: "1px solid var(--border-color, #e8ddd0)" }}
          >
            <svg width="9" height="9" viewBox="0 0 12 12" fill="#c9a96e">
              <polygon points="6,1 7.5,4.5 11,5 8.5,7.5 9.2,11 6,9.2 2.8,11 3.5,7.5 1,5 4.5,4.5" />
            </svg>
            <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, color: "#c9a96e" }}>{rating}</span>
            <span className="hidden sm:inline" style={{ fontFamily: BODY, fontSize: 11, color: "var(--text)", opacity: 0.6 }}>({reviews})</span>
          </div>
        </div>

        {/* Description — hidden on mobile */}
        <p
          className="hidden sm:block text-justify"
          style={{
            fontFamily: BODY,
            fontSize: 12,
            lineHeight: "1.6",
            color: "var(--text)",
            opacity: 0.9,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {description}
        </p>

        <div className="border-t mt-auto" style={{ borderColor: "var(--border-color, #e8ddd0)" }} />
        <div className="flex items-center justify-between gap-1">
          <div className="min-w-0">
            <p style={{ fontFamily: BODY, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text)", opacity: 0.55, fontWeight: 500 }}>
              Price
            </p>
            <div className="flex items-baseline gap-1 flex-wrap">
              <span style={{ fontFamily: BODY, fontSize: 18, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>
                ₹{price.toLocaleString("en-IN")}
              </span>
              {originalPrice && (
                <span style={{ fontFamily: BODY, fontSize: 10, color: "var(--text)", opacity: 0.4, textDecoration: "line-through" }}>
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-full transition-all hover:brightness-125 active:scale-95 shrink-0"
            style={{
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: 11,
              background: added ? "#2d6a4f" : "#4C2A19",
              color: added ? "#fff" : "#ccbc9d",
              border: `1px solid ${added ? "transparent" : "#e0d0bc"}`,
            }}
          >
            {added ? (
              "✓"
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                <span className="hidden sm:inline">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 hidden sm:flex items-end pb-[72px] justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <span
          className="px-5 py-2 rounded-full text-xs font-semibold tracking-wider"
          style={{
            background: "rgba(29,14,6,0.80)",
            color: "#c9a96e",
            fontFamily: BODY,
            backdropFilter: "blur(4px)",
          }}
        >
          VIEW DETAILS →
        </span>
      </div>
    </motion.div>
  );

  if (slug) {
    return (
      <Link href={`/products/${slug}`} className="block w-full h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}