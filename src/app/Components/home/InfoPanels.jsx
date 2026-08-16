"use client";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY    = "'Inter', sans-serif";

const cards = [
  {
    title: "Cable Twist\nBracelets",
    subtitle: "Jewelry That Says Be Yourself.",
    href: "/collections/bracelets",
    img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=900&q=80&fit=crop",
    delay: 0,
  },
  {
    title: "Diamond Stud\nEarrings",
    subtitle: "A Wide Range Of Exquisite Earrings.",
    href: "/collections/earrings",
    img: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=900&q=80&fit=crop",
    delay: 100,
  },
  {
    title: "Bridal\nJewelry",
    subtitle: "Browse Collections And Designers.",
    href: "/collections/bridal",
    img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&q=80&fit=crop",
    delay: 200,
  },
];

export default function InfoPanels() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="w-full overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 w-full">
        {cards.map(({ title, subtitle, href, img, delay }, i) => (
          <Link
            key={i}
            href={href}
            className="group relative overflow-hidden block"
            style={{
              height: "clamp(200px, 28vw, 340px)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transition: `opacity 0.9s ease ${delay}ms, transform 0.9s ease ${delay}ms`,
            }}
          >
            <img
              src={img}
              alt={title.replace("\n", " ")}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.07]"
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to right, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.08) 100%)" }}
            />
            <div className="absolute inset-0 flex flex-col justify-between p-7 md:p-8">
              <div>
                {/* Title — Cormorant Garamond */}
                <h2
                  className="text-white leading-[1.1] whitespace-pre-line mb-3"
                  style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: "clamp(1.5rem, 2.4vw, 2rem)" }}
                >
                  {title}
                </h2>
                {/* Subtitle — Inter */}
                <p
                  className="text-white/70 leading-snug"
                  style={{ fontFamily: BODY, fontSize: "clamp(11px, 1.1vw, 13px)", fontWeight: 300, letterSpacing: "0.02em" }}
                >
                  {subtitle}
                </p>
              </div>
              <div>
                {/* CTA — Inter */}
                <span
                  className="inline-block border border-white/80 group-hover:border-white px-5 py-2.5 text-white transition-all duration-300 group-hover:bg-white/10"
                  style={{ fontFamily: BODY, fontSize: 11, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase" }}
                >
                  View More
                </span>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] bg-[#d4a96a] w-0 group-hover:w-full transition-all duration-700 ease-out" />
          </Link>
        ))}
      </div>
    </section>
  );
}
