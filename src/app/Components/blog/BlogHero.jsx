"use client";
import { useEffect, useState } from "react";

const DEFAULT_POST = {
    category: "Craft & Making",
    tags: ["Behind the Atelier"],
    issue: "Vol. IV · 2026",
    dropLetter: "T",
    headlineRest: "he Weight of Gold,\nMeasured in Hours",
    excerpt:
        "A single clasp can take three days. A stone setting, a week. We trace the quiet obsession behind our artisans' process — and why slowness is the only honest luxury.",
    author: "Meera Nair",
    authorInitials: "MN",
    date: "June 2026",
    readTime: "8 min read",
    cta: "Read story",
    alsoIn: ["The Gem Cutters", "Wax & Fire", "Patron Portraits"],
    imageCaption: "Atelier, Jaipur — 2024",
    desktop:
        "./blogbanner1.png",

    mobile:
        "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=800&q=80&fit=crop",
};

export default function BlogHero({
    category,
    tags,
    issue,
    dropLetter,
    headlineRest,
    excerpt,
    author,
    authorInitials,
    date,
    readTime,
    cta,
    alsoIn,
    imageCaption,
    desktopImage,
    mobileImage,
    breadcrumb = [],
    onCtaClick,
}) {
    const [isMob, setIsMob] = useState(false);
    const [entered, setEntered] = useState(false);

    const p = {
        category: category ?? DEFAULT_POST.category,
        tags: tags ?? DEFAULT_POST.tags,
        issue: issue ?? DEFAULT_POST.issue,
        dropLetter: dropLetter ?? DEFAULT_POST.dropLetter,
        headlineRest: headlineRest ?? DEFAULT_POST.headlineRest,
        excerpt: excerpt ?? DEFAULT_POST.excerpt,
        author: author ?? DEFAULT_POST.author,
        authorInitials: authorInitials ?? DEFAULT_POST.authorInitials,
        date: date ?? DEFAULT_POST.date,
        readTime: readTime ?? DEFAULT_POST.readTime,
        cta: cta ?? DEFAULT_POST.cta,
        alsoIn: alsoIn ?? DEFAULT_POST.alsoIn,
        imageCaption: imageCaption ?? DEFAULT_POST.imageCaption,
        desktop: desktopImage ?? DEFAULT_POST.desktop,
        mobile: mobileImage ?? DEFAULT_POST.mobile,
    };

    const imgSrc = isMob ? p.mobile : p.desktop;

    useEffect(() => {
        const fn = () => setIsMob(window.innerWidth < 768);
        fn();
        window.addEventListener("resize", fn);
        return () => window.removeEventListener("resize", fn);
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setEntered(true), 60);
        return () => clearTimeout(t);
    }, []);

    const BC = breadcrumb.map((c) =>
        typeof c === "string" ? { label: c, href: null } : c
    );

    const T = {
        sans: "'DM Sans', system-ui, sans-serif",
        serif: "'Playfair Display', Georgia, serif",
    };

    const fade = (delay = 0) => ({
        opacity: entered ? 1 : 0,
        transform: entered ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.65s ${delay}s, transform 0.65s ${delay}s`,
    });

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        .bh2 * { box-sizing: border-box; margin: 0; padding: 0; }
        .bh2-cta {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #1a0d07; background: #c9a96e;
          border: 0.5px solid rgba(201,169,110,0.4); border-radius: 100px;
          padding: 10px 22px; cursor: pointer; text-decoration: none;
          transition: background 0.2s;
        }
        .bh2-cta:hover { background: #d4b87e; }
        .bh2-pill {
          font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500;
          letter-spacing: 0.16em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 100px; white-space: nowrap;
        }
        .bh2-foot-tag {
          font-family: 'DM Sans', sans-serif; font-size: 11px;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: rgba(240, 230, 216, 0.81); padding: 4px 10px; background: rgba(255,255,255,0.07); border-radius: 6px; border: 0.5px solid rgba(255,255,255,0.1);
        }
        @media (prefers-reduced-motion: reduce) {
          .bh2 * { transition: none !important; }
        }
      `}</style>

            <section
                className="bh2"
                style={{
                    display: "flex",
                    flexDirection: isMob ? "column" : "row",
                    width: "100%",
                    overflow: "hidden",
                    background: "#fff",
                    minHeight: isMob ? "auto" : 480,
                    fontFamily: T.sans,
                    marginTop: 40,
                }}
            >
                {/* ── LEFT ── */}
                <div
                    style={{
                        flex: "0 0 52%",
                        display: "flex",
                        flexDirection: "column",
                        padding: isMob ? "32px 24px" : "40px 55px",
                        borderRight: "none",
                        borderBottom: "none",
                        background: "#1a0d07",
                    }}
                >
                    {/* Breadcrumb */}
                    {BC.length > 0 && (
                        <div
                            style={{
                                display: "flex", alignItems: "center", gap: 6,
                                marginBottom: 16, ...fade(0),
                            }}
                        >
                            {BC.map((c, i) => (
                                <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    {i > 0 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>›</span>}
                                    {c.href && i < BC.length - 1 ? (
                                        <a href={c.href} style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>{c.label}</a>
                                    ) : (
                                        <span style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: i === BC.length - 1 ? "#c9a96e" : "rgba(255,255,255,0.35)", fontWeight: 500 }}>{c.label}</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Category pills + issue */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap", ...fade(0.05) }}>
                        <span className="bh2-pill" style={{ background: "#c9a96e", color: "#1a0d07" }}>{p.category}</span>
                        {p.tags.map((t, i) => (
                            <span key={i} className="bh2-pill" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(240,230,216,0.6)", border: "0.5px solid rgba(255,255,255,0.1)" }}>{t}</span>
                        ))}
                        <span style={{ marginLeft: "auto", fontFamily: T.sans, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", whiteSpace: "nowrap" }}>{p.issue}</span>
                    </div>

                    {/* Rule */}
                    <div style={{ width: "100%", height: "0.5px", background: "rgba(255,255,255,0.08)", marginBottom: 24 }} />

                    {/* Drop cap + headline */}
                    <div style={{ marginBottom: 18, ...fade(0.1) }}>
                        <span style={{
                            float: "left",
                            fontFamily: T.serif,
                            fontSize: isMob ? 72 : 96,
                            fontWeight: 900,
                            lineHeight: 0.78,
                            margin: "8px 10px -4px 0",
                            color: "#c9a96e",
                        }}>
                            {p.dropLetter}
                        </span>
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontWeight: 700,
                            fontSize: isMob ? "clamp(1.5rem,6vw,1.9rem)" : "clamp(1.6rem,2.4vw,1.95rem)",
                            lineHeight: 1.12,
                            color: "#f0e6d8",
                            whiteSpace: "pre-line",
                        }}>
                            {p.headlineRest}
                        </h1>
                    </div>

                    {/* Excerpt */}
                    <p style={{
                        fontSize: 14, fontWeight: 300, lineHeight: 1.78,
                        color: "rgb(240, 230, 216)", maxWidth: 400, marginBottom: 28,
                        clear: "both", ...fade(0.18),
                    }}>
                        {p.excerpt}
                    </p>

                    {/* Author + CTA */}
                    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28, ...fade(0.24) }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: "50%",
                            background: "rgba(255, 255, 255, 0.47)", border: "0.5px solid rgba(255,255,255,0.12)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 500, color: "rgba(240,230,216,0.6)", marginRight: 12, flexShrink: 0,
                        }}>
                            {p.authorInitials}
                        </div>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: "#f0e6d8" }}>{p.author}</div>
                            <div style={{ fontSize: 12, color: "rgba(255, 255, 255, 0.53)", marginTop: 1 }}>{p.date} · {p.readTime}</div>
                        </div>
                        <div style={{ marginLeft: "auto" }}>
                            <button className="bh2-cta" onClick={onCtaClick}>
                                {p.cta}
                                <svg width="13" height="10" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                                    <line x1="0" y1="6" x2="15" y2="6" />
                                    <polyline points="9,1 15,6 9,11" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Also in this issue */}
                    {p.alsoIn.length > 0 && (
                        <div style={{ marginTop: "auto", ...fade(0.32) }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                                <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255, 255, 255, 0.79)", whiteSpace: "nowrap" }}>
                                    Also in this issue
                                </span>
                                <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
                            </div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", color: "rgba(255, 255, 255, 0.74)", paddingTop: 6, borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
                                {p.alsoIn.map((t, i) => (
                                    <span key={i} className="bh2-foot-tag">{t}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── RIGHT: image ── */}
                <div style={{ flex: 1, position: "relative", overflow: "hidden", height: isMob ? "58vw" : "36vw", minHeight: isMob ? 200 : undefined }}>
                    <img
                        src={imgSrc}
                        alt={`${p.author} – ${p.category}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                    />

                    {/* Read time badge */}
                    <div style={{
                        position: "absolute", top: 16, right: 16,
                        background: "rgba(255,255,255,0.92)",
                        borderRadius: 100, padding: "6px 14px",
                        display: "flex", alignItems: "center", gap: 6,
                        fontSize: 11, fontWeight: 500, letterSpacing: "0.12em",
                        textTransform: "uppercase", color: "#111",
                    }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#111", flexShrink: 0 }} />
                        {p.readTime}
                    </div>

                    {/* Caption */}
                    <div style={{
                        position: "absolute", bottom: 0, left: 0, right: 0,
                        padding: "32px 20px 16px",
                        background: "linear-gradient(transparent, rgba(0,0,0,0.52))",
                    }}>
                        <span style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: T.sans }}>
                            {p.imageCaption}
                        </span>
                    </div>
                </div>
            </section>
        </>
    );
}