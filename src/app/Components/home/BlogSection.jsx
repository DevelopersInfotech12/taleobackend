"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'Inter', sans-serif";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Local fallback — shown only until the API responds, or if it fails/returns empty.
const FALLBACK_POSTS = [
  { id: 1, category: "Jewellery Care", title: "How to Keep Your Fine Jewellery Radiant for Generations", excerpt: "Discover the rituals behind preserving the brilliance of your most cherished pieces — from diamond rings to delicate chains.", date: "June 2, 2025", readTime: "4 min read", img: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=700&q=80&fit=crop", slug: "keep-jewellery-radiant" },
  { id: 2, category: "Behind the Craft", title: "The Art of Stone Setting: Where Precision Meets Poetry", excerpt: "Our master craftsmen share the patience and precision behind every prong, bezel, and pavé setting that holds your stone in place.", date: "May 18, 2025", readTime: "6 min read", img: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=700&q=80&fit=crop", slug: "art-of-stone-setting" },
  { id: 3, category: "Gift Guide", title: "Beyond the Ring: Jewellery Gifts That Tell a Story", excerpt: "Whether marking a milestone or simply celebrating someone you love, the right piece speaks when words fall short.", date: "May 5, 2025", readTime: "5 min read", img: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=80&fit=crop", slug: "jewellery-gifts-guide" },
];

// Map a raw API blog doc → the shape this card grid renders.
const mapPost = (b, i) => ({
  id: b._id || b.slug || i,
  category: b.tag || "Journal",
  title: b.title,
  excerpt: b.excerpt,
  date: b.date,
  readTime: b.readTime || "5 min read",
  img: b.heroImg || b.img,
  slug: b.slug,
});

export default function BlogSection() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [posts, setPosts] = useState(FALLBACK_POSTS);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/blogs/published`, { cache: "no-store" });
        const data = await res.json();
        const list = data?.data || [];
        if (list.length) setPosts(list.slice(0, 3).map(mapPost));
      } catch {
        // keep local fallback content
      }
    })();
  }, []);

  const fade = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(22px)",
    transition: `opacity 0.75s ease ${delay}s, transform 0.75s ease ${delay}s`,
  });

  return (
    <section ref={ref} className="w-full px-4 sm:px-8 py-16 bg-[#faf7f2] transition-colors duration-300">
      <div className="max-w-6xl mx-auto">

        {/* ── Section Header (unified pattern) ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12" style={fade(0.05)}>
          <div className="flex flex-col gap-2">
            {/* Eyebrow row: gold rule + label — Inter */}
            <div className="flex items-center gap-3 ">
              <span style={{ display: "block", width: 24, height: 1 }} className="bg-[#a67c2e] dark:bg-[#c9a96e]" />
              <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase" }} className="text-[#a67c2e] dark:text-[#c9a96e]">
                The Journal
              </span>
            </div>
            {/* Heading */}
            <div style={fade(0.3)}>
              <h2
                style={{
                  fontFamily: DISPLAY,
                  fontSize: "clamp(2.4rem, 4.2vw, 3.2rem)",
                  fontWeight: 700,
                  lineHeight: 1.08,
                  margin: 0,
                   color: "#3d1f10",
                  letterSpacing: "-0.02em",
                }}
                className=""
              >
                Stories of Craft{" "}
                <span
                  style={{
                    fontWeight: 400,
                    fontStyle: "italic",
                    letterSpacing: "-0.01em",
                  }}
                  className="text-[#9b7020] dark:text-[#c9a96e]"
                >
                  Beauty
                </span>
              </h2>
            </div>
          </div>

          {/* CTA — Inter */}
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2.5 self-start sm:self-auto shrink-0 transition-all duration-300 text-[#8a7560] dark:text-[#bdab8a] border-b border-[#2e2318] dark:border-[#c9a96e]/40"
            style={{ fontFamily: BODY, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.22em", textDecoration: "none", paddingBottom: 3 }}
          >
            View All Articles
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform duration-300">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-[#1e1510] border border-[#e8d5b0]/40 dark:border-[#2e2318] transition-colors duration-300"
              style={{ ...fade(0.12 + i * 0.12), textDecoration: "none" }}
            >
              <div className="relative overflow-hidden" style={{ aspectRatio: "16/10" }}>
                <img
                  src={post.img} alt={post.title}
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.82) saturate(0.8)", transition: "transform 0.7s ease" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                />
                {/* Category badge — Inter */}
                <span className="absolute top-4 left-4 px-2.5 py-1"
                  style={{ fontFamily: BODY, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.3em", background: "rgba(12,6,2,0.65)", color: "#c9a96e", border: "1px solid #c9a96e44" }}>
                  {post.category}
                </span>
              </div>

              <div className="flex flex-col flex-1 p-5 gap-3">
                {/* Meta — Inter */}
                <div className="flex items-center gap-2.5">
                  <span style={{ fontFamily: BODY, fontWeight: 400, fontSize: 11 }} className="text-[#7c7062] dark:text-[#9c8f7f]">{post.date}</span>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", display: "inline-block" }} className="bg-[#c2b9ab] dark:bg-[#3a2c1e]" />
                  <span style={{ fontFamily: BODY, fontWeight: 400, fontSize: 11 }} className="text-[#7c7062] dark:text-[#9c8f7f]">{post.readTime}</span>
                </div>

                {/* Title — Cormorant Garamond */}
                <h3
                  className="group-hover:text-[#a67c2e] dark:group-hover:text-[#c9a96e] transition-colors duration-300 text-[#2c2317] dark:text-[#e8d9c4]"
                  style={{ fontFamily: DISPLAY, fontSize: "1.1rem", fontWeight: 600, lineHeight: 1.25, margin: 0 }}
                >
                  {post.title}
                </h3>

                {/* Excerpt — Inter */}
                <p style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.8, margin: 0, fontWeight: 600, textAlign: "justify" }} className="text-[#8a7560] dark:text-[#c9a96e]">
                  {post.excerpt}
                </p>

                <div style={{ flex: 1 }} />
                <div style={{ height: 1 }} className="bg-[#e8e0d0] dark:bg-[#2e2318]" />

                {/* Read more — Inter */}
                <div className="inline-flex items-center gap-1.5 w-fit transition-colors duration-300 bg-[#3d1f10] dark:bg-[#c9a96e]"
                  style={{ padding: "9px 12px", borderRadius: 4 }}>
                  <span className="text-white dark:text-[#1a0c06]"
                    style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.25em" }}>
                    Read Article
                  </span>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white dark:text-[#1a0c06] group-hover:translate-x-1 transition-transform duration-300">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}