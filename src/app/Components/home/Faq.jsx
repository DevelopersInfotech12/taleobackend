"use client";
import { useRef, useState, useEffect } from "react";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'Inter', sans-serif";

const FAQS = [
  { q: "How long does shipping take?", a: "All orders ship free via insured courier and arrive within 3–7 business days domestically. International orders may take 7–14 days." },
  { q: "Is your gold hallmarked?", a: "Every piece is BIS 916 hallmarked, certifying purity and authenticity. A certificate accompanies each order." },
  { q: "Can I return or exchange an item?", a: "Yes — return any unworn piece in its original packaging within 30 days for a full refund or exchange." },
  { q: "Do you offer ring resizing?", a: "Rings are resized once free of charge within 60 days of purchase, subject to design constraints." },
  { q: "How do I care for my jewelry?", a: "Store pieces separately in a soft pouch, avoid contact with perfume or chlorine, and clean gently with a dry cloth." },
];

function FaqItem({ item, index, open, onToggle, fade }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (bodyRef.current) setHeight(open ? bodyRef.current.scrollHeight : 0);
  }, [open]);

  return (
    <div style={fade(0.15 + index * 0.08)} className="relative group">
      {/* growing gold accent bar */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 2,
          background: "linear-gradient(180deg,#c9a96e,#a67c2e)",
          transform: open ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "top",
          transition: "transform 0.5s cubic-bezier(.22,1,.36,1)",
        }}
      />
      <div className="border-b border-[#2a1a0e]/10">
        <button
          type="button"
          onClick={() => onToggle(index)}
          className="w-full flex items-center justify-between gap-6 py-5 pl-6 text-left bg-transparent border-none cursor-pointer"
        >
          <span
            style={{
              fontFamily: DISPLAY,
              fontSize: 19,
              fontWeight: 600,
              backgroundImage: "linear-gradient(90deg,#9b7020,#9b7020)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "0 100%",
              backgroundSize: open ? "100% 1.5px" : "0% 1.5px",
              transition: "background-size 0.5s cubic-bezier(.22,1,.36,1), color 0.3s ease",
              paddingBottom: 2,
            }}
            className={open ? "text-[#9b7020]" : "text-[#3d1f10]"}
          >
            {item.q}
          </span>

          <span
            className="shrink-0 relative flex items-center justify-center"
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "1px solid #a67c2e",
              background: open ? "#a67c2e" : "transparent",
              transition: "background 0.4s ease, transform 0.4s cubic-bezier(.22,1,.36,1), box-shadow 0.4s ease",
              transform: open ? "rotate(180deg) scale(1.05)" : "rotate(0deg) scale(1)",
              boxShadow: open ? "0 0 0 4px rgba(166,124,46,0.14)" : "0 0 0 0 rgba(166,124,46,0)",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={open ? "#faf7f2" : "#9b7020"} strokeWidth="2">
              <path d="M5 12h14" />
              <path
                d="M12 5v14"
                style={{
                  transformOrigin: "center",
                  transform: open ? "scaleY(0)" : "scaleY(1)",
                  transition: "transform 0.3s ease",
                }}
              />
            </svg>
          </span>
        </button>

        <div
          style={{
            height,
            overflow: "hidden",
            transition: "height 0.45s cubic-bezier(.22,1,.36,1)",
          }}
        >
          <div ref={bodyRef}>
            <p
              style={{
                fontFamily: BODY,
                fontSize: 14,
                lineHeight: 1.7,
                fontWeight: 500,
                margin: "0 0 22px",
                paddingLeft: 24,
                maxWidth: 560,
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(-6px)",
                transition: "opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s",
              }}
              className="text-[#7a6a5a]"
            >
              {item.a}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Faq() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const fade = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  const handleToggle = (i) => setOpenIndex((cur) => (cur === i ? -1 : i));

  return (
    <section
      ref={ref}
      className="py-20 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 15% 20%, rgba(201,169,110,0.10), transparent 45%), radial-gradient(circle at 85% 80%, rgba(166,124,46,0.08), transparent 50%), #faf7f2",
      }}
    >
      <div className="max-w-[900px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — heading block + image */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-3" style={fade(0)}>
              <span style={{ display: "block", width: 24, height: 1 }} className="bg-[#a67c2e]" />
              <span style={{ fontFamily: DISPLAY, fontSize: 11, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase" }} className="text-[#a67c2e]">
                Got Questions
              </span>
            </div>
            <div style={fade(0.1)}>
              <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem, 3.6vw, 2.8rem)", fontWeight: 700, color: "#3d1f10", lineHeight: 1.1, margin: 0, letterSpacing: "-0.02em" }}>
                Frequently{" "}
                <span style={{ fontWeight: 400, fontStyle: "italic", letterSpacing: "-0.01em" }} className="text-[#9b7020]">
                  asked
                </span>
              </h2>
            </div>
            <p style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.6, margin: "8px 0 0", fontWeight: 600, ...fade(0.2) }} className="text-[#7a6a5a]">
              Everything you need to know before your purchase.
            </p>

            <div
              className="sm:h-[290px] relative"
              style={{ ...fade(0.3), marginTop: 28, borderRadius: 18, overflow: "hidden", aspectRatio: "4/5" }}
            >
              <img src="./faq.png" alt="Gold jewelry close up" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 60%, rgba(61,31,16,0.35))",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  right: 16,
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "rgba(250,247,242,0.85)",
                  backdropFilter: "blur(6px)",
                  border: "1px solid rgba(166,124,46,0.25)",
                }}
              >
                <span style={{ fontFamily: DISPLAY, fontSize: 13, fontWeight: 600 }} className="text-[#3d1f10] mx-auto text-center block">
                  Doubts? Ask TALEO.
                </span>
              </div>
            </div>
          </div>

          {/* Right — accordion list */}
          <div>
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                index={i}
                open={openIndex === i}
                onToggle={handleToggle}
                fade={fade}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}