"use client";
import { useEffect, useRef, useState, useCallback } from "react";

function HeartIcon({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#e0445a" : "none"} stroke={filled ? "#e0445a" : "currentColor"} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
function CommentIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
function BookmarkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function formatCount(n) {
  if (!n && n !== 0) return "–";
  const num = typeof n === "string" ? parseInt(n.replace(/,/g, ""), 10) : n;
  if (isNaN(num)) return "–";
  return num >= 1000
    ? (num / 1000).toFixed(1).replace(/\.0$/, "") + "k"
    : String(num);
}

// Path to your local logo file — drop the file in /public and update this path.
const DEFAULT_LOGO = "/logonew.png";

// Real Instagram web app font stack (not Inter)
const IG_FONT =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// Card width used by the slider transform math. Kept here so FeedCard/Skeleton
// and the slider drag math always agree, even on small phone screens.
const CARD_WIDTH = 300;
const CARD_GAP = 16;

function FeedCard({ photo, handle, logoUrl }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  const likes = typeof photo.like_count !== "undefined" ? photo.like_count : photo.likes;
  const comments = photo.comments_count ?? photo.comments;

  const postImageSrc = photo.cover_url || photo.media_url || photo.img;
  const avatarSrc = photo.profile_pic_url || logoUrl || DEFAULT_LOGO;

  return (
    <a
      href={photo.permalink || "https://instagram.com"}
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 rounded-2xl overflow-hidden flex flex-col no-underline bg-white dark:bg-[#1c1310] border border-[#efefef] dark:border-[#2e2318] transition-colors duration-300"
      style={{
        width: `min(${CARD_WIDTH}px, 80vw)`,
        fontFamily: IG_FONT,
        textDecoration: "none",
        color: "inherit",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <div
          className="w-8 h-8 rounded-full p-[2px]"
          style={{ background: "linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)" }}
        >
          <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-[#1c1310] p-[1.5px]">
            {avatarError ? (
              <div
                className="w-full h-full rounded-full"
                style={{ background: "linear-gradient(135deg, #c9a96e, #8b5e3c)" }}
              />
            ) : (
              <img
                src={avatarSrc}
                alt={handle || "profile"}
                className="w-full h-full object-cover rounded-full"
                draggable={false}
                onError={() => setAvatarError(true)}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col leading-tight">
          <span style={{ fontSize: 12, fontWeight: 700 }} className="text-[#1e110a] dark:text-[#e8d9c4]">{handle || "taleojewels"}</span>
          <span style={{ fontSize: 10 }} className="text-[#8a8a8a] dark:text-[#9c8f7f]">New Delhi, India</span>
        </div>
        <div className="ml-auto">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#1e110a] dark:text-[#e8d9c4]">
            <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
          </svg>
        </div>
      </div>

      {/* Media: video for Reels, image otherwise */}
      <div style={{ aspectRatio: "1", overflow: "hidden", position: "relative" }} className="bg-[#ece4d6] dark:bg-[#2a1810]">
        {photo.media_type === "VIDEO" && photo.video_url ? (
          <>
            <video
              ref={videoRef}
              src={photo.video_url}
              poster={photo.cover_url || photo.thumbnail_url}
              className="w-full h-full object-cover"
              muted={muted}
              loop
              playsInline
              autoPlay
              preload="metadata"
              // NOTE: no "controls" attribute — that's what was drawing the
              // native play/time/volume/fullscreen/menu bar you saw before.
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMuted((m) => !m);
              }}
            />
            {/* Small IG-style mute toggle only — nothing else visible */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMuted((m) => !m); }}
              className="absolute bottom-2 right-2 w-6 h-6 rounded-full flex items-center justify-center bg-black/40 border-none cursor-pointer"
              style={{ backdropFilter: "blur(2px)" }}
            >
              {muted ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M11 5 6 9H2v6h4l5 4z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                  <path d="M11 5 6 9H2v6h4l5 4z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </svg>
              )}
            </button>
          </>
        ) : imgError || !postImageSrc ? (
          <div className="w-full h-full flex items-center justify-center text-[11px] text-[#8a8a8a] dark:text-[#9c8f7f]">
            Image unavailable
          </div>
        ) : (
          <img
            src={postImageSrc}
            alt={photo.caption || photo.alt || "Instagram post"}
            className="w-full h-full object-cover"
            draggable={false}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Actions */}
      <div className="px-3 pt-2.5 pb-1 flex items-center gap-3" onClick={(e) => e.preventDefault()}>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLiked((l) => !l); }}
          className={`transition-transform active:scale-90 bg-transparent border-none cursor-pointer p-0 ${liked ? "text-[#e0445a]" : "text-[#1e110a] dark:text-[#e8d9c4]"}`}
        >
          <HeartIcon filled={liked} />
        </button>
        <button className="bg-transparent border-none cursor-pointer p-0 text-[#1e110a] dark:text-[#e8d9c4]"><CommentIcon /></button>
        <button className="bg-transparent border-none cursor-pointer p-0 text-[#1e110a] dark:text-[#e8d9c4]"><ShareIcon /></button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSaved((s) => !s); }}
          className="ml-auto bg-transparent border-none cursor-pointer p-0 text-[#1e110a] dark:text-[#e8d9c4]"
          style={{ opacity: saved ? 1 : 0.75 }}
        >
          <BookmarkIcon />
        </button>
      </div>

      {/* Likes — inherits real IG font from card, no override */}
      <div className="px-3 pb-1">
        <span style={{ fontSize: 12, fontWeight: 700 }} className="text-[#1e110a] dark:text-[#e8d9c4]">
          {formatCount(liked ? (likes || 0) + 1 : likes)} likes
        </span>
      </div>

      {/* Caption — inherits real IG font from card, no override */}
      <div className="px-3 pb-2">
        <p style={{ fontSize: 12.5, lineHeight: 1.5, margin: 0 }} className="text-[#1e110a] dark:text-[#e8d9c4]">
          <span style={{ fontWeight: 700 }}>{handle || "luxeor.jewellery"} </span>
          {photo.caption
            ? photo.caption.length > 80
              ? photo.caption.slice(0, 80) + "…"
              : photo.caption
            : ""}
        </p>
      </div>

      {/* Comments */}
      <div className="px-3 pb-3">
        <span style={{ fontSize: 11, fontWeight: 700 }} className="text-[#8a8a8a] dark:text-[#9c8f7f]">
          {comments != null ? `View all ${formatCount(comments)} comments` : "View post on Instagram"}
        </span>
      </div>
    </a>
  );
}

function SkeletonCard() {
  return (
    <div
      className="shrink-0 rounded-2xl overflow-hidden animate-pulse bg-[#ece4d6] dark:bg-[#2a1810] border border-[#e0d6c5] dark:border-[#3a2015]"
      style={{ width: `min(${CARD_WIDTH}px, 80vw)` }}
    >
      <div className="bg-[#e0d6c5] dark:bg-[#3a2015]" style={{ height: 52 }} />
      <div className="bg-[#e0d6c5] dark:bg-[#3a2015]" style={{ aspectRatio: "1" }} />
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="bg-[#d8cdb8] dark:bg-[#4a2a1a]" style={{ height: 12, width: "40%", borderRadius: 6 }} />
        <div className="bg-[#d8cdb8] dark:bg-[#4a2a1a]" style={{ height: 10, width: "80%", borderRadius: 6 }} />
        <div className="bg-[#d8cdb8] dark:bg-[#4a2a1a]" style={{ height: 10, width: "60%", borderRadius: 6 }} />
      </div>
    </div>
  );
}

export default function InstagramSlider() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState("Taleojewels");
  const [current, setCurrent] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(null);
  const dragDelta = useRef(0);

  // How many cards fit per "page" — recalculated on resize so mobile
  // (1 card visible) and desktop (4 cards visible) both work correctly.
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      const cardW = Math.min(CARD_WIDTH, w * 0.8) + CARD_GAP;
      const count = Math.max(1, Math.floor((w - 32) / cardW));
      setVisibleCount(count);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  const maxIndex = Math.max(0, posts.length - visibleCount);

  // Clamp current index whenever visibleCount/posts change (e.g. rotating
  // phone, or resizing) so we never end up stuck past the new maxIndex.
  useEffect(() => {
    setCurrent((c) => Math.min(c, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const FALLBACK_POSTS = [
      { id: "fb1", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80", alt: "Gold bangles", caption: "Timeless bangles, handcrafted in 22K gold. ✨ #GoldJewellery #Handcrafted", likes: 1240, comments: 38, permalink: "https://instagram.com" },
      { id: "fb2", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", alt: "Gold necklace", caption: "Heirloom necklaces made to be worn and remembered. 💛 #GoldNecklace #Taleo", likes: 987, comments: 24, permalink: "https://instagram.com" },
      { id: "fb3", img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", alt: "Gold earrings", caption: "Drop earrings with temple-inspired motifs. 🌸 #Earrings #22KGold", likes: 856, comments: 19, permalink: "https://instagram.com" },
      { id: "fb4", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80", alt: "Cocktail ring", caption: "Bold Kundan rings for every celebration. 💍 #Ring #Kundan", likes: 1103, comments: 31, permalink: "https://instagram.com" },
      { id: "fb5", img: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80", alt: "Jewellery flat", caption: "Each piece tells a story. What's yours? 🌿 #FineJewellery #Artisan", likes: 762, comments: 14, permalink: "https://instagram.com" },
      { id: "fb6", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", alt: "Gold chain", caption: "Sculpted in warmth. Worn like a secret. ✦ #TaleoJewellery #HeirloomGold", likes: 934, comments: 22, permalink: "https://instagram.com" },
    ];

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
    fetch(`${apiBase}/instagram/posts?limit=12`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.posts?.length) {
          setPosts(json.data.posts);
          const igHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE;
          if (igHandle) setHandle(igHandle);
        } else {
          setPosts(FALLBACK_POSTS);
        }
      })
      .catch(() => setPosts(FALLBACK_POSTS))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (posts.length === 0) return;
    const t = setInterval(() => setCurrent((c) => (c >= maxIndex ? 0 : c + 1)), 4000);
    return () => clearInterval(t);
  }, [maxIndex, posts.length]);

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(maxIndex, c + 1)), [maxIndex]);

  const handlePointerDown = (e) => { dragStart.current = e.clientX; dragDelta.current = 0; setIsDragging(true); };
  const handlePointerMove = (e) => { if (!isDragging) return; dragDelta.current = e.clientX - dragStart.current; };
  const handlePointerUp = () => {
    if (isDragging) {
      if (dragDelta.current < -50) next();
      else if (dragDelta.current > 50) prev();
    }
    setIsDragging(false);
    dragStart.current = null;
  };

  const displayItems = loading
    ? Array.from({ length: 6 }, (_, i) => ({ id: `sk-${i}`, _skeleton: true }))
    : posts;

  return (
    <section
      ref={ref}
      className="w-full py-16 overflow-hidden bg-[#faf7f2] dark:bg-[#1a0c06] transition-colors duration-300"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8">

        {/* ── Section Header (unified pattern) ── */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
          style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
        >
          <div className="flex flex-col gap-2">
            {/* Eyebrow row: gold rule + label — Inter */}
            <div className="flex items-center gap-3 ">
              <span style={{ display: "block", width: 24, height: 1 }} className="bg-[#a67c2e] dark:bg-[#c9a96e]" />
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase" }} className="text-[#a67c2e] dark:text-[#c9a96e]">
                Connect With Us
              </span>
            </div>
            {/* Heading with IG icon — Cormorant Garamond */}
            <div className="flex items-center gap-3">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="ig2" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f9ce34" />
                    <stop offset="40%" stopColor="#ee2a7b" />
                    <stop offset="100%" stopColor="#6228d7" />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig2)" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" stroke="url(#ig2)" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1" fill="url(#ig2)" />
              </svg>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)", fontWeight: 400, margin: 0, letterSpacing: "-0.01em" }} className="text-[#2c2317] dark:text-[#e8d9c4]">
                @{handle}
              </h2>
            </div>
          </div>

          {/* Follow CTA — Inter */}
          <a
            href={`https://instagram.com/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start sm:self-auto inline-flex items-center gap-2 transition-all duration-300 hover:opacity-80"
            style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", background: "linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)", color: "#fff", borderRadius: 6, textDecoration: "none", padding: "10px 20px" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="#fff" stroke="none" />
            </svg>
            Follow Us
          </a>
        </div>

        {/* Slider */}
        <div
          className="relative"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.2s" }}
        >
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            style={{ touchAction: "pan-y" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div
              className="flex"
              style={{
                gap: CARD_GAP,
                transform: `translateX(calc(-${current} * (min(${CARD_WIDTH}px, 80vw) + ${CARD_GAP}px)))`,
                transition: isDragging ? "none" : "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
              }}
            >
              {displayItems.map((post) =>
                post._skeleton ? (
                  <SkeletonCard key={post.id} />
                ) : (
                  <FeedCard key={post.id} photo={post} handle={handle} logoUrl={DEFAULT_LOGO} />
                )
              )}
            </div>
          </div>

          {/* Arrows */}
          {!loading && posts.length > visibleCount && (
            <>
              <button
                onClick={prev}
                disabled={current === 0}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-20 disabled:cursor-not-allowed rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] bg-white dark:bg-[#1c1310] border border-[#e5e5e5] dark:border-[#2e2318] text-[#1e110a] dark:text-[#e8d9c4]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
              </button>
              <button
                onClick={next}
                disabled={current >= maxIndex}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110 disabled:opacity-20 disabled:cursor-not-allowed rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.1)] bg-white dark:bg-[#1c1310] border border-[#e5e5e5] dark:border-[#2e2318] text-[#1e110a] dark:text-[#e8d9c4]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {!loading && posts.length > visibleCount && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`border-none cursor-pointer p-0 transition-all duration-300 ${current === i ? "bg-[#a67c2e] dark:bg-[#c9a96e]" : "bg-[#e5e5e5] dark:bg-[#3a2c1e]"}`}
                style={{
                  width: current === i ? 24 : 6,
                  height: 4,
                  borderRadius: 2,
                }}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}