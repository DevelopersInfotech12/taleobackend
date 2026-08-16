"use client";
import { useEffect, useState, useRef, useCallback } from "react";

const INTERVAL = 6000;

const DEFAULT_SLIDES = [
    {
        desktop: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&fit=crop",
        mobile: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&fit=crop",
        label: "No. 01",
        heading: "The Art\nof Gold",
        meta: "Necklaces · Hand-forged in 22k",
        collection: "Necklaces",
        description: "Each necklace is a conversation between metal and skin — hand-forged from 22k gold, shaped by artisans who measure beauty in millimetres. Worn close to the heart, made to outlast a lifetime.",
        cta: "Explore Necklaces",
    },
    {
        desktop: "./bannner1.png",
        mobile: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80&fit=crop",
        label: "No. 02",
        heading: "Worn Like\na Secret",
        meta: "Rings · Limited to 40 pieces",
        collection: "Rings",
        description: "A ring is a promise — to yourself, to someone, to an idea. Our limited-edition rings are cast once per season, each stone chosen by hand, each band finished to a silence you can feel.",
        cta: "Explore Rings",
    },
    {
        desktop: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80&fit=crop",
        mobile: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80&fit=crop",
        label: "No. 03",
        heading: "Sculpted\nin Warmth",
        meta: "Earrings · Champagne stone",
        collection: "Earrings",
        description: "Earrings frame the face before a word is spoken. Sculpted in champagne-toned gold with hand-set stones, these pieces catch light the way memory catches detail — suddenly, and with precision.",
        cta: "Explore Earrings",
    },
];

export default function OtherHero({
    title,
    subtitle,
    breadcrumb = [],
    desktopImages,
    mobileImages,
}) {
    const [cur, setCur] = useState(0);
    const [prev, setPrev] = useState(null);
    const [busy, setBusy] = useState(false);
    const [prog, setProg] = useState(0);
    const [isMob, setIsMob] = useState(false);
    const [entered, setEntered] = useState(false);
    const [descKey, setDescKey] = useState(0);
    const timerRef = useRef(null);
    const rafRef = useRef(null);
    const t0Ref = useRef(null);

    const slides = DEFAULT_SLIDES.map((s, i) => ({
        ...s,
        desktop: desktopImages?.[i] || s.desktop,
        mobile: mobileImages?.[i] || s.mobile,
        heading: s.heading,
        meta: s.meta,
    }));
    const total = slides.length;

    useEffect(() => {
        const fn = () => setIsMob(window.innerWidth < 768);
        fn(); window.addEventListener("resize", fn);
        return () => window.removeEventListener("resize", fn);
    }, []);

    useEffect(() => { const t = setTimeout(() => setEntered(true), 60); return () => clearTimeout(t); }, []);

    const startBar = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        setProg(0);
        t0Ref.current = performance.now();
        const tick = now => {
            const p = Math.min((now - t0Ref.current) / INTERVAL, 1);
            setProg(p);
            if (p < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
    }, []);

    const goTo = useCallback((next) => {
        if (busy || next === cur) return;
        clearInterval(timerRef.current);
        setBusy(true); setPrev(cur); setCur(next); startBar();
        setDescKey(k => k + 1);
        setTimeout(() => { setPrev(null); setBusy(false); }, 900);
    }, [busy, cur, startBar]);

    useEffect(() => {
        startBar();
        timerRef.current = setInterval(() => goTo((cur + 1) % total), INTERVAL);
        return () => { clearInterval(timerRef.current); cancelAnimationFrame(rafRef.current); };
    }, [cur]);

    const BC = breadcrumb.map(c => typeof c === "string" ? { label: c, href: null } : c);
    const s = slides[cur];
    const imgSrc = isMob ? s.mobile : s.desktop;

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&family=Inter:wght@300;400;500&display=swap');
        .oh2*{box-sizing:border-box;margin:0;padding:0}
        @keyframes oh2-imgIn  {from{opacity:0;transform:scale(1.06)}to{opacity:1;transform:scale(1)}}
        @keyframes oh2-imgOut {from{opacity:1;transform:scale(1)}   to{opacity:0;transform:scale(1.03)}}
        @keyframes oh2-up     {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes oh2-in     {from{opacity:0}to{opacity:1}}
        @keyframes oh2-desc   {from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .oh2-img-enter{animation:oh2-imgIn  .95s cubic-bezier(.22,1,.36,1) forwards}
        .oh2-img-leave {animation:oh2-imgOut .9s  cubic-bezier(.22,1,.36,1) forwards}
        .oh2-up1{animation:oh2-up .7s .05s cubic-bezier(.22,1,.36,1) both}
        .oh2-up2{animation:oh2-up .7s .18s cubic-bezier(.22,1,.36,1) both}
        .oh2-up3{animation:oh2-up .7s .30s cubic-bezier(.22,1,.36,1) both}
        .oh2-desc{animation:oh2-desc .65s .38s cubic-bezier(.22,1,.36,1) both}
        .oh2-fadein{animation:oh2-in .6s ease both}
        .oh2-cta{
          display:inline-flex;align-items:center;gap:10px;
          font-family:'Inter',sans-serif;font-size:10px;font-weight:500;
          letter-spacing:0.24em;text-transform:uppercase;
          color:#c9a96e;text-decoration:none;
          border-bottom:1px solid rgba(201,169,110,0.3);
          padding-bottom:3px;
          transition:border-color .25s,gap .25s;
          background:none;border-top:none;border-left:none;border-right:none;
          cursor:pointer;
        }
        .oh2-cta:hover{border-bottom-color:#c9a96e;gap:16px}
        @media(prefers-reduced-motion:reduce){
          .oh2-img-enter,.oh2-img-leave,.oh2-up1,.oh2-up2,.oh2-up3,.oh2-desc,.oh2-fadein{animation:none!important}
        }
      `}</style>

            <section className="oh2" style={{
                display: "flex", flexDirection: isMob ? "column" : "row",
                width: "100%", overflow: "hidden", background: "#1a0c06",
                height: isMob ? "auto" : "clamp(300px,40vw,560px)",
                minHeight: isMob ? 480 : undefined,
            }}>

                {/* ── LEFT PANEL ── */}
                <div style={{
                    flexShrink: 0,
                    width: isMob ? "100%" : "44%",
                    display: "flex", flexDirection: "column", justifyContent: "space-between",
                    padding: isMob ? "40px 28px 32px" : "clamp(32px,4vw,56px) clamp(32px,4vw,52px)",
                    position: "relative", zIndex: 2,
                    borderRight: isMob ? "none" : "1px solid rgba(255,255,255,0.06)",
                }}>

                    {/* Top: breadcrumb + label + heading + description */}
                    <div>
                        {BC.length > 0 && (
                            <div style={{
                                display: "flex", alignItems: "center", gap: 8, marginBottom: 20,
                                opacity: entered ? 1 : 0, transition: "opacity 0.8s 0.2s",
                            }}>
                                {BC.map((c, i) => (
                                    <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        {i > 0 && <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>›</span>}
                                        {c.href && i < BC.length - 1
                                            ? <a href={c.href} style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 400, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}>{c.label}</a>
                                            : <span style={{ fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: i === BC.length - 1 ? "#c9a96e" : "rgba(255,255,255,0.35)" }}>{c.label}</span>
                                        }
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Collection tag */}
                        <div key={`label-${cur}`} className="oh2-up1" style={{
                            display: "flex", alignItems: "center", gap: 10, marginBottom: isMob ? 16 : 20,
                        }}>
                            <span style={{ display: "block", width: 20, height: 1, background: "rgba(201,169,110,0.5)" }} />
                            <span style={{
                                fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 500,
                                letterSpacing: "0.32em", textTransform: "uppercase",
                                color: "rgba(201,169,110,0.75)",
                            }}>{s.collection}</span>
                        </div>

                        {/* Big heading */}
                        <h1 key={`h-${cur}`} className="oh2-up2 mt-12" style={{
                            fontFamily: "'Cormorant Garamond',Georgia,serif",
                            fontWeight: 800,
                            fontSize: isMob ? "clamp(2.2rem,9vw,3.2rem)" : "clamp(2.2rem,3.2vw,3.4rem)",
                            lineHeight: 1.05, letterSpacing: "-0.02em",
                            color: "#f0e6d8", whiteSpace: "nowrap",
                        }}>{s.heading}</h1>

                        {/* Divider + meta */}
                        <div key={`div-${cur}`} className="oh2-up3" style={{
                            display: "flex", alignItems: "center", gap: 14, marginTop: isMob ? 18 : 22, marginBottom: isMob ? 14 : 18,
                        }}>
                            <span style={{ display: "block", width: 36, height: 1, background: "#c9a96e", flexShrink: 0 }} />
                            <span style={{
                                fontFamily: "'Inter',sans-serif", fontSize: 11, fontWeight: 400,
                                letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)"
                            }}>
                                {s.meta}
                            </span>
                        </div>

                        {/* Description — animates on slide change */}
                        <p
                            key={`desc-${descKey}`}
                            className="oh2-desc"
                            style={{
                                fontFamily: "'Poppins', system-ui, sans-serif",

                                fontWeight: 500,
                                fontStyle: "normal",
                                fontSize: isMob
                                    ? "clamp(1rem,3.5vw,1.15rem)"
                                    : "clamp(1rem,1vw,1rem)",
                                lineHeight: 1.65,
                                color: "rgba(240,230,216,0.6)",
                                marginBottom: isMob ? 20 : 24,
                                maxWidth: 450,
                                textAlign: "justify",
                                textAlignLast: "left",
                            }}
                        >
                            {s.description}
                        </p>

                        {/* CTA */}
                        <div key={`cta-${descKey}`} className="oh2-desc" style={{ animationDelay: "0.5s" }}>
                            <button className="oh2-cta">
                                {s.cta}
                                <svg width="14" height="10" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <line x1="0" y1="7" x2="17" y2="7" />
                                    <polyline points="11,1 17,7 11,13" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Bottom: slide thumbnails + arrows */}
                    <div>
                        <div style={{
                            display: "flex", gap: isMob ? 10 : 12, marginBottom: 0,
                            opacity: entered ? 1 : 0, transition: "opacity 0.8s 0.5s",
                        }}>
                            {slides.map((sl, i) => (
                                <button key={i} onClick={() => goTo(i)} aria-label={`Slide ${i + 1}`} style={{
                                    flex: 1, height: isMob ? 52 : 60, border: "none", padding: 0, cursor: "pointer",
                                    position: "relative", overflow: "hidden",
                                    outline: i === cur ? "1.5px solid #c9a96e" : "1px solid rgba(255,255,255,0.1)",
                                    outlineOffset: "2px",
                                    transition: "outline-color .3s",
                                    borderRadius: 2,
                                }}>
                                    <img src={isMob ? sl.mobile : sl.desktop} alt="" style={{
                                        width: "100%", height: "100%", objectFit: "cover",
                                        filter: i === cur ? "brightness(0.85) saturate(0.8)" : "brightness(0.45) saturate(0.4)",
                                        transition: "filter .4s",
                                    }} />
                                    <span style={{
                                        position: "absolute", bottom: 4, left: 6,
                                        fontFamily: "'Inter',sans-serif", fontSize: 9, fontWeight: 500,
                                        letterSpacing: "0.18em", color: i === cur ? "#c9a96e" : "rgba(255,255,255,0.4)",
                                        textTransform: "uppercase", transition: "color .3s",
                                    }}>0{i + 1}</span>
                                    {i === cur && (
                                        <div style={{
                                            position: "absolute", bottom: 0, left: 0,
                                            width: `${prog * 100}%`, height: 2,
                                            background: "#c9a96e", transition: "width 0.1s linear",
                                        }} />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Arrow row */}
                        <div style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            marginTop: 16,
                            opacity: entered ? 1 : 0, transition: "opacity 0.8s 0.6s",
                        }}>
                            <span style={{
                                fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 400,
                                letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase"
                            }}>
                                {String(cur + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                            </span>
                            <div style={{ display: "flex", gap: 4 }}>
                                {[-1, 1].map(d => (
                                    <button key={d} onClick={() => goTo((cur + d + total) % total)}
                                        aria-label={d < 0 ? "Previous" : "Next"}
                                        style={{
                                            width: 34, height: 34,
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            background: "transparent", cursor: "pointer",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            borderRadius: 0,
                                            transition: "border-color .25s",
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.borderColor = "#c9a96e55"}
                                        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" aria-hidden="true">
                                            {d < 0 ? <polyline points="15,18 9,12 15,6" /> : <polyline points="9,18 15,12 9,6" />}
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PANEL: image ── */}
                <div style={{
                    flex: 1, position: "relative", overflow: "hidden",
                    height: isMob ? "56vw" : "100%",
                    minHeight: isMob ? 200 : undefined,
                }}>
                    {[cur, prev].map(idx => {
                        if (idx === null) return null;
                        const isActive = idx === cur;
                        const src = isMob ? slides[idx].mobile : slides[idx].desktop;
                        return (
                            <div key={idx} className={isActive ? "oh2-img-enter" : "oh2-img-leave"}
                                style={{ position: "absolute", inset: 0, zIndex: isActive ? 2 : 1 }}>
                                <img src={src} alt="" style={{
                                    width: "100%", height: "100%", objectFit: "cover", objectPosition: "center",
                                    // filter: "brightness(0.88) saturate(0.75)", 
                                    display: "block",
                                }} />
                            </div>
                        );
                    })}



                    {/* Top-right corner label */}
                    <div className="oh2-fadein" style={{
                        position: "absolute", top: isMob ? 14 : 20, right: isMob ? 14 : 20,
                        zIndex: 4, display: "flex", alignItems: "center", gap: 8,
                    }}>
                        <span style={{ display: "block", width: 16, height: 1, background: "rgba(201,169,110,0.5)" }} />
                        <span style={{
                            fontFamily: "'Inter',sans-serif", fontSize: 10, fontWeight: 400,
                            letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)"
                        }}>
                            Fine Jewellery
                        </span>
                    </div>


                </div>

            </section>
        </>
    );
}