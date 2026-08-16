"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

const CATEGORY = "VIRSA";
const INSTAGRAM_URL = "https://www.instagram.com/taleojewels/"; // update to real handle

const CHAPTERS = [
  {
    isIntro: true,
    category: CATEGORY,
    chapter: "Chapter 01",
    title: "Virsa",
    tagline: "Every Detail Had To Earn Its Place.",
    body: "Nothing here exists by chance. Taleo creates jewellery inspired by heritage, nostalgia, and the objects that have quietly shaped who we are. Every piece begins with an idea and takes form through intention. We'd rather make a few pieces worth remembering than thousands you'll forget.",
    footnote: "Each design is produced in a limited run of just 10 pieces. Once a chapter is sold through, it closes. We move forward to the next story.",
    image: "./virsa.png",
    mobileImage: "./virsamob.jpeg",
    cta: { label: "Explore Chapter 01", href: "/collections/virsa" },
  },
  {
    category: CATEGORY,
    chapter: "Chapter 01 — I",
    title: "Kanak",
    tagline: "Before every harvest comes patience.",
    body: "Inspired by fields of wheat swaying beneath the Punjabi sun — a tribute to growth, resilience, and all the beautiful things that take time to become.",
    image: "./kanak.png",
    mobileImage: "./kanakmob.jpeg",
    cta: { label: "Discover Kanak", href: "/collections/kanak" },
  },
  {
    category: CATEGORY,
    chapter: "Chapter 01 — II",
    title: "Raunak",
    tagline: "A celebration of colour and movement.",
    body: "The energy of ordinary, memorable celebrations — pieces drawn from symbols and stories that continue to hold meaning today.",
    image: "./raunak.png",
    mobileImage: "./raunakmob.jpeg",
    cta: { label: "Discover Raunak", href: "/collections/raunak" },
  },
  {
    category: CATEGORY,
    chapter: "Chapter 01 — III",
    title: "Mehfil",
    tagline: "Inspired by evenings that begin with conversation.",
    body: "And end with music, felt more in shimmer than sound — jewellery for the gatherings you remember.",
    image: "./mehfil.png",
    mobileImage: "./mehfilmob.jpeg",
    cta: { label: "Discover Mehfil", href: "/collections/mehfil" },
  },
  {
    category: CATEGORY,
    chapter: "Chapter 01 — IV",
    title: "Sehaj",
    tagline: "A reminder that peace often lives in stillness.",
    body: "Quiet pieces, made for the moments in between — where nothing needs to be proven.",
    image: "./sehaj.png",
    mobileImage: "./sehajmob.jpeg",
    cta: { label: "Discover Sehaj", href: "/collections/sehaj" },
  },
];

const AUTOPLAY_MS = 6000;

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const startAutoplay = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % CHAPTERS.length);
    }, AUTOPLAY_MS);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(timerRef.current);
  }, [startAutoplay]);

  const goTo = (index) => {
    setActive(index);
    startAutoplay();
  };

  const goPrev = () => goTo((active - 1 + CHAPTERS.length) % CHAPTERS.length);
  const goNext = () => goTo((active + 1) % CHAPTERS.length);

  return (
    <section
      className="relative w-full overflow-hidden h-[91vh] min-h-[560px] lg:h-[100vh] lg:min-h-[680px] lg:max-h-[880px]"
      style={{ background: "#1a0c06" }}
    >
      {CHAPTERS.map((c, i) => (
        <div
          key={c.title}
          className="absolute inset-0"
          style={{ opacity: active === i ? 1 : 0, transition: "opacity 1.1s ease", zIndex: 0 }}
          aria-hidden={active !== i}
        >
          <img
            src={c.image}
            alt={c.title}
            className="hidden lg:block w-full h-full object-cover"
            style={{ transform: active === i ? "scale(1.04)" : "scale(1)", transition: "transform 7s ease" }}
          />
          <img
            src={c.mobileImage}
            alt={c.title}
            className="block lg:hidden w-full h-full object-cover"
            style={{ transform: active === i ? "scale(1.04)" : "scale(1)", transition: "transform 7s ease" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(15,8,4,0.82) 0%, rgba(15,8,4,0.55) 38%, rgba(15,8,4,0.15) 62%, rgba(15,8,4,0.05) 100%), linear-gradient(0deg, rgba(15,8,4,0.55) 0%, rgba(15,8,4,0) 35%)",
            }}
          />
        </div>
      ))}

      <div className="relative z-10 h-full max-w-[1320px] mx-auto pl-14 pr-6 lg:px-16 lg:mt-6 flex items-center">
        <div className="max-w-[550px] w-full">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.title}
              style={{
                display: active === i ? "block" : "none",
                paddingLeft: c.isIntro ? 22 : 0,
                borderLeft: c.isIntro ? "1px solid rgba(201,169,110,0.4)" : "none",
              }}
              className={c.isIntro ? "mt-16 sm:mt-0" : ""}
            >
              {!c.isIntro && <CategoryLabel label={c.category} visible={visible} />}
              {!c.isIntro && <ChapterEyebrow label={c.chapter} visible={visible} />}
              <ChapterTitle title={c.title} big={c.isIntro} visible={visible} />
              <ChapterTagline text={c.tagline} visible={visible} />
              <ChapterBody text={c.body} wide={c.isIntro} visible={visible} />
              {c.footnote && <ChapterFootnote text={c.footnote} visible={visible} />}
              <ChapterCTA cta={c.cta} outline={c.isIntro} visible={visible} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={goPrev}
        aria-label="Previous chapter"
        className="hidden md:flex absolute left-12 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-7 h-7 rounded-full border border-white/30 text-white/80 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors duration-300"
      >
        ‹
      </button>
      <button
        onClick={goNext}
        aria-label="Next chapter"
        className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-8 h-8 rounded-full border border-white/30 text-white/80 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors duration-300"
      >
        ›
      </button>

      <InstagramSideTab />

      <div className="absolute bottom-7 left-0 right-0 z-20 flex items-center justify-center gap-3">
        {CHAPTERS.map((c, i) => (
          <button key={c.title} onClick={() => goTo(i)} aria-label={`Go to ${c.title}`} className="group flex items-center gap-2">
            <span
              style={{
                display: "block",
                height: 1,
                width: active === i ? 28 : 14,
                background: active === i ? "#c9a96e" : "rgba(255,255,255,0.35)",
                transition: "all 0.4s ease",
              }}
            />
            <span
              className="hidden lg:inline"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: active === i ? "#c9a96e" : "rgba(255,255,255,0.45)",
                transition: "color 0.4s ease",
              }}
            >
              {c.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

/** Small parent-category tag, shown above the chapter eyebrow on sub-chapter slides only */
function CategoryLabel({ label, visible }) {
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: "rgba(230,211,179,0.55)",
        marginBottom: 6,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {label} <span style={{ opacity: 0.5 }}>/</span>
    </div>
  );
}

function ChapterEyebrow({ label, visible }) {
  return (
    <div
      className="flex w-fit items-center gap-2.5 mb-5 px-3 py-1.5 rounded-full backdrop-blur-md"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(201,169,110,0.35)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "opacity 0.6s cubic-bezier(.22,1,.36,1) 0.05s, transform 0.6s cubic-bezier(.22,1,.36,1) 0.05s",
      }}
    >
      <span
        style={{
          display: "block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#c9a96e",
          boxShadow: "0 0 8px 2px rgba(201,169,110,0.6)",
        }}
      />
      <span
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#e6d3b3",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function ChapterTitle({ title, big, visible }) {
  return (
    <h1
      className={big ? "leading-[1.0] text-[4.2rem] lg:text-[clamp(4.6rem,8vw,8rem)]" : "leading-[1.02] text-[3.6rem] lg:text-[clamp(3.6rem,6.5vw,6.5rem)]"}
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        fontWeight: 500,
        letterSpacing: big ? "0.06em" : "0.02em",
        backgroundImage: "linear-gradient(135deg, #ffffff 30%, #e6d3b3 70%, #c9a96e 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        filter: visible ? "blur(0px)" : "blur(6px)",
        transition: "opacity 0.9s cubic-bezier(.22,1,.36,1) 0.15s, transform 0.9s cubic-bezier(.22,1,.36,1) 0.15s, filter 0.9s ease 0.15s",
      }}
    >
      {title}
    </h1>
  );
}

function ChapterTagline({ text, visible }) {
  return (
    <div className="flex items-center gap-3 mt-5">
      <span
        style={{
          display: "block",
          width: visible ? 36 : 0,
          height: 1,
          background: "linear-gradient(90deg, #c9a96e, transparent)",
          transition: "width 0.8s cubic-bezier(.22,1,.36,1) 0.4s",
        }}
      />
      <p
        className="text-[#e6d3b3] text-[16px] lg:text-[19px] italic"
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontWeight: 400,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(-14px)",
          transition: "opacity 0.7s ease 0.32s, transform 0.7s ease 0.32s",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function ChapterBody({ text, wide, visible }) {
  return (
    <p
      className={wide ? "text-white text-[14.5px] leading-[1.85] max-w-2xl mt-5 mb-5" : "text-white text-[14.5px] leading-[1.85] max-w-sm mt-5 mb-5"}
      style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 700,
        textAlign: "justify",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.8s ease 0.48s, transform 0.8s ease 0.48s",
      }}
    >
      {text}
    </p>
  );
}

/** Italic closing line, used on the Virsa intro slide only */
function ChapterFootnote({ text, visible }) {
  return (
    <p
      className="text-[#c9a96e]/90 text-[13px] italic mb-9"
      style={{
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(14px)",
        transition: "opacity 0.8s ease 0.55s, transform 0.8s ease 0.55s",
        fontWeight: 700,
      }}
    >
      {text}
    </p>
  );
}

function ChapterCTA({ cta, outline, visible }) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: "opacity 0.8s ease 0.6s, transform 0.8s ease 0.6s",
      }}
    >
      <Link
        href={cta.href}
        className="group relative inline-flex items-center gap-3 overflow-hidden"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 600,
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: outline ? "#f2e8d5" : "#1a0c06",
          background: outline ? "transparent" : "#f2e8d5",
          border: outline ? "1px solid #c9a96e" : "none",
          padding: outline ? "14px 24px" : "15px 24px",
          borderRadius: 2,
        }}
      >
        {!outline && (
          <span
            className="absolute inset-0 -translate-x-full transition-transform duration-450 group-hover:translate-x-0"
            style={{ background: "linear-gradient(90deg, #c9a96e, #f2e8d5)" }}
          />
        )}
        <span
          className="relative font-bold"
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: outline ? "#f2e8d5" : "#1a0c06",
            padding: "1px 2px",
            borderRadius: 2,
          }}
        >
          {cta.label}
        </span>
        <span className="relative transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
          →
        </span>
      </Link>
    </div>
  );
}

/** Fixed vertical Instagram tab, docked to the left edge of the hero.
 *  Visible on all breakpoints (mobile + desktop). */
function InstagramSideTab() {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Follow us on Instagram"
      className="flex absolute left-0 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-1.5 group"
      style={{
        background: "rgba(26,12,6,0.55)",
        border: "1px solid rgba(242,232,213,0.25)",
        borderLeft: "none",
        padding: "18px 10px",
        borderRadius: "0 6px 6px 0",
        backdropFilter: "blur(6px)",
        transition: "border-color 0.3s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c9a96e")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(242,232,213,0.25)")}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f2e8d5"
        strokeWidth="1.8"
        className="group-hover:stroke-[#c9a96e] transition-colors"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
      </svg>
      <span
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#f2e8d5",
        }}
        className="group-hover:text-[#c9a96e] transition-colors"
      >
        Instagram
      </span>
    </a>
  );
}