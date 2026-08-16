"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'Inter', sans-serif";

// ─── Shared section-header token ───────────────────────────────────────────
// Eyebrow:  Inter 10px / 500 / tracking 0.32em / uppercase / gold #c9a96e
//           preceded by a 24px gold rule
// Heading:  Cormorant Garamond, weight 400–700 depending on context
//           color adapts to background (light bg → #2a1a0e, dark bg → #e8d9c4)
// Sub-line: Inter 11px / 400 / tracking 0.2em / uppercase / muted
// ────────────────────────────────────────────────────────────────────────────

const categories = [
 { name: "Sehaj", slug: "rings", img: "/sehajcateg.png" },
  { name: "Kanak", slug: "necklaces", img: "/kanakcateg.png" },
  { name: "Raunak", slug: "earrings", img: "/raunakcateg.png" },
  { name: "Mehfil", slug: "bracelets", img: "/mehfilcateg.png" },
  { name: "Virsa", slug: "gifts", img: "/virsa.png" },
];

export default function ShopByCategory() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const fadeUp = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(16px)",
    transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
  });
  const fade = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  return (
    <section ref={ref} className="py-12 md:py-20 bg-[#f5efe8]">
      <div className="max-w-[1320px] mx-auto px-4 md:px-6">

        {/* ── Section Header (unified pattern) ── */}
        <div className="flex flex-col items-center text-center mb-5 md:mb-6 ">

          {/* Eyebrow row: gold rule + label */}
          <div className="flex items-center gap-2 md:gap-3" style={fadeUp(0)}>
            <span style={{ display: "block", width: 24, height: 1, background: "#c9a96e" }} />
            <span
              className="text-[9px] md:text-[12px] tracking-[0.22em] md:tracking-[0.32em]"
              style={{ fontFamily: BODY, fontWeight: 700, textTransform: "uppercase", color: "#c9a96e" }}
            >
              Explore our collection
            </span>
          </div>

          {/* Heading */}
          <div style={fade(0.3)}>
            <h2
              style={{
                fontFamily: DISPLAY,
                fontSize: "clamp(2.1rem, 7vw, 3.2rem)",
                fontWeight: 700,
                lineHeight: 1.08,
                color: "#3d1f10",
                margin: 0,
                letterSpacing: "-0.02em",
              }}
            >
              New chapters {" "}
              <span
                style={{
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "#c9a96e",
                  letterSpacing: "-0.01em",
                }}
              >
                to explore
              </span>
            </h2>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-[10px] bg-[#f0e8df] p-3 md:p-8">
          {categories.map(({ name, slug, img }, i) => {
            const subtitles = ["Fine & bridal", "Pendants & chains", "Studs & drops", "Bangles & cuffs", "For every occasion"];
            return (
              <Link
                key={slug}
                href={`/collections/${slug}`}
                className={`group relative overflow-hidden ${i === 4 ? "col-span-2 sm:col-span-1" : ""}`}
                style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(30px)", transition: `opacity 0.6s ease ${0.1 + i * 0.08}s, transform 0.6s ease ${0.1 + i * 0.08}s` }}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <img src={img} alt={name} className="w-full h-full object-cover transition-all duration-[900ms] group-hover:scale-[1.08]" style={{ filter: "brightness(0.72) saturate(0.75)", transition: "transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.6s ease" }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(8,6,4,0.88) 0%, rgba(8,6,4,0.18) 55%, transparent 100%)" }} />
                  <div className="absolute inset-[6px] md:inset-[10px] border border-white/10 group-hover:border-[#c9a96e]/45 transition-colors duration-500 pointer-events-none" />

                  <div className="absolute top-[8px] left-[8px] right-[8px] md:top-[14px] md:left-[14px] md:right-[14px] flex justify-between items-start">
                    <span
                      className="text-[18px] md:text-[28px] group-hover:text-[#c9a96e]/50 transition-colors duration-400"
                      style={{ fontFamily: DISPLAY, fontWeight: 300, fontStyle: "italic", lineHeight: 1, color: "rgba(255,255,255,0.18)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="w-[5px] h-[5px] border-[0.5px] border-[#c9a96e]/50 rotate-45 mt-1.5 group-hover:bg-[#c9a96e]/50 transition-colors duration-400" />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 px-[8px] pb-[12px] pt-[12px] md:px-[14px]  md:pt-[4px] text-center">
                    <div className="w-5 md:w-6 group-hover:w-9 h-px bg-[#c9a96e]/50 group-hover:bg-[#c9a96e]/80 mx-auto mb-1.5 md:mb-2.5 transition-all duration-400" />
                    <span
                      className="text-[9px] md:text-[11px] tracking-[0.16em] md:tracking-[0.28em]"
                      style={{ fontFamily: BODY, textTransform: "uppercase", color: "rgba(255,255,255,0.9)", display: "block", marginBottom: 6 }}
                    >
                      {name}
                    </span>
                    <div className="relative min-h-[18px] md:min-h-[28px] flex items-center justify-center">
                      <div className="inline-flex items-center gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <span style={{ fontFamily: BODY, fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "#c9a96e" }}>Explore</span>
                        <div className="w-4 group-hover:w-6 h-px bg-[#c9a96e] transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}