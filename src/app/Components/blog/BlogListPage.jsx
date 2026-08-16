"use client";
// Public blog listing — ported 1:1 from CBG's BlogScreen.jsx layout AND
// spacing/breakpoints: one lead story + a secondary-stories rail, a
// double-image feature band, then a "Latest Articles" grid. Uses the same
// .container-shell + Tailwind responsive classes as CBG (not fixed inline
// widths) so it collapses to a single column on mobile instead of
// overflowing/cutting off thumbnails. Colors/fonts re-skinned to Taleo.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "../motion/Reveal";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const SERIF = "'Cormorant Garamond', Georgia, serif";
const SANS = "'Inter', 'DM Sans', sans-serif";

const FALLBACK_BLOGS = [];

function TagLabel({ tag }) {
  return (
    <span style={{ fontFamily: SERIF, fontSize: 12.5, fontWeight: 700, color: "var(--gold)" }}>
      {tag}
    </span>
  );
}

function Avatar({ name }) {
  const initial = (name || "T").trim().charAt(0).toUpperCase();
  return (
    <span
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full"
      style={{ background: "var(--brown)", color: "var(--gold-lt, #f0e0c0)", fontFamily: SANS, fontSize: 12, fontWeight: 700 }}
    >
      {initial}
    </span>
  );
}

function Byline({ author, sub }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar name={author} />
      <div className="leading-tight">
        {author && <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{author}</div>}
        <div style={{ fontFamily: SANS, fontSize: 12, color: "var(--text-muted)" }}>{sub}</div>
      </div>
    </div>
  );
}

function SecondaryStoryRow({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex items-center gap-4 border-b py-4 first:pt-0 last:border-b-0 last:pb-0"
      style={{ borderColor: "var(--border-color)", textDecoration: "none" }}
    >
      <div className="min-w-0 flex-1">
        <TagLabel tag={post.tag} />
        <h4
          className="mt-1.5 line-clamp-2 transition-colors group-hover:opacity-80"
          style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, lineHeight: 1.35, color: "var(--text)" }}
        >
          {post.title}
        </h4>
        <div className="mt-2 flex items-center gap-1.5" style={{ fontFamily: SANS, fontSize: 12, color: "var(--text-muted)" }}>
          <Clock className="h-3 w-3" aria-hidden="true" />
          {post.readTime}
        </div>
      </div>
      <div className="h-24 w-28 shrink-0 overflow-hidden rounded-lg sm:h-32 sm:w-32" style={{ background: "var(--cream-dk, #eee2cf)" }}>
        {(post.heroImg || post.img) && (
          <img
            src={post.heroImg || post.img}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        )}
      </div>
    </Link>
  );
}

function MiddleFeatureCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group relative block aspect-[16/11] overflow-hidden rounded-2xl" style={{ background: "var(--cream-dk, #eee2cf)" }}>
      {(post.heroImg || post.img) && (
        <img
          src={post.heroImg || post.img}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,12,5,0.05) 0%, rgba(20,12,5,0.15) 45%, rgba(20,12,5,0.85) 100%)" }} />
      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-md px-2.5 py-1 backdrop-blur" style={{ background: "rgba(255,255,255,0.92)", fontFamily: SANS, fontSize: 11, fontWeight: 700 }}>
        <span style={{ color: "var(--gold)" }}>{post.tag}</span>
        <span style={{ color: "var(--text-muted)" }}>· {post.readTime}</span>
      </div>
      <h3 className="absolute inset-x-4 bottom-4" style={{ fontFamily: SERIF, fontSize: 19, fontWeight: 700, lineHeight: 1.35, color: "#f5efe8", margin: 0 }}>
        {post.title}
      </h3>
    </Link>
  );
}

function LatestCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block" style={{ textDecoration: "none" }}>
      <div className="overflow-hidden rounded-xl" style={{ background: "var(--cream-dk, #eee2cf)" }}>
        {(post.heroImg || post.img) && (
          <img
            src={post.heroImg || post.img}
            alt={post.title}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        )}
      </div>
      <div className="mt-3">
        <Byline author={post.author} sub={post.date} />
        <h4 className="mt-2.5 line-clamp-2" style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 700, lineHeight: 1.35, color: "var(--text)" }}>
          {post.title}
        </h4>
        <div className="mt-2 flex items-center gap-1.5" style={{ fontFamily: SANS, fontSize: 12 }}>
          <TagLabel tag={post.tag} />
          <span style={{ color: "var(--text-muted)" }}>· {post.readTime}</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [allBlogs, setAllBlogs] = useState(FALLBACK_BLOGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/blogs/published`, { cache: "no-store" });
        const data = await res.json();
        if (data.success) setAllBlogs(data.data || []);
      } catch {
        // keep local fallback content
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = useMemo(() => ["All", ...new Set(allBlogs.map((p) => p.tag).filter(Boolean))], [allBlogs]);

  const filtered = useMemo(
    () => (activeCategory === "All" ? allBlogs : allBlogs.filter((p) => p.tag === activeCategory)),
    [activeCategory, allBlogs]
  );

  const featured = filtered[0] || null;
  const rest = filtered.slice(1);
  const secondary = rest.slice(0, 4);
  const remainder = rest.slice(4);
  const middleBand = remainder.length >= 2 ? remainder.slice(0, 2) : [];
  const latest = remainder.length >= 2 ? remainder.slice(2) : remainder;

  return (
    <main style={{ background: "var(--cream)" }}>
      <div className="container-shell pt-10 pb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const on = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className="relative inline-flex min-h-[38px] cursor-pointer items-center rounded-full px-4 transition-all duration-300"
                style={{
                  fontFamily: SANS, fontSize: 13, fontWeight: 600,
                  border: on ? "1px solid var(--brown)" : "1px solid var(--border-color)",
                  background: on ? "var(--brown)" : "#fff",
                  color: on ? "var(--cream)" : "var(--text)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="container-shell grid gap-10 pb-24 lg:grid-cols-[1fr_360px]">
          <div className="h-[380px] animate-pulse rounded-2xl" style={{ background: "var(--cream-dk, #eee2cf)" }} />
          <div className="h-[380px] animate-pulse rounded-2xl" style={{ background: "var(--cream-dk, #eee2cf)" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="container-shell py-24 text-center" style={{ fontFamily: SANS, color: "var(--text-muted)" }}>
          No articles yet in this category — check back soon.
        </div>
      ) : (
        <>
          <section className="pb-14">
            <div className="container-shell grid gap-10 lg:grid-cols-[1fr_360px]">
              {featured && (
                <Reveal>
                  <Byline author={featured.author} sub="Author" />
                  <Link href={`/blog/${featured.slug}`} className="group mt-4 block" style={{ textDecoration: "none" }}>
                    <h1
                      className="leading-[1.15] transition-colors"
                      style={{ fontFamily: SERIF, fontSize: "clamp(1.7rem,3.2vw,2.6rem)", fontWeight: 700, color: "var(--text)" }}
                    >
                      {featured.title}
                    </h1>
                  </Link>
                  <div className="mt-3 flex items-center gap-2" style={{ fontFamily: SANS, fontSize: 13 }}>
                    <TagLabel tag={featured.tag} />
                    <span style={{ color: "var(--text-muted)" }}>· {featured.readTime}</span>
                  </div>
                  <Link href={`/blog/${featured.slug}`} className="group mt-6 block overflow-hidden rounded-2xl" style={{ background: "var(--cream-dk, #eee2cf)" }}>
                    {(featured.heroImg || featured.img) && (
                      <img
                        src={featured.heroImg || featured.img}
                        alt={featured.title}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    )}
                  </Link>
                </Reveal>
              )}

              {secondary.length > 0 && (
                <div className="flex flex-col lg:pt-[52px]">
                  {secondary.map((post) => <SecondaryStoryRow key={post.slug} post={post} />)}
                </div>
              )}
            </div>
          </section>

          {middleBand.length > 0 && (
            <section className="pb-16">
              <div className="container-shell">
                <Stagger className={`grid gap-5 ${middleBand.length > 1 ? "sm:grid-cols-2" : ""}`}>
                  {middleBand.map((post) => (
                    <StaggerItem key={post.slug}><MiddleFeatureCard post={post} /></StaggerItem>
                  ))}
                </Stagger>
              </div>
            </section>
          )}

          {latest.length > 0 && (
            <section className="pb-24">
              <div className="container-shell">
                <div className="mb-8 flex items-center justify-between">
                  <h2 style={{ fontFamily: SERIF, fontSize: "1.4rem", fontWeight: 700, color: "var(--text)" }}>Latest Articles</h2>
                  <Link href="/blog" className="group inline-flex items-center gap-1" style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: "var(--gold)", textDecoration: "none" }}>
                    Show More
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
                <motion.div layout className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                  <AnimatePresence mode="popLayout">
                    {latest.map((post) => (
                      <motion.div key={post.slug} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                        <LatestCard post={post} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}