"use client";
import { useEffect, useRef, useState } from "react";

const badges = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: "Ethically Sourced",
    sub:   "Conflict-free diamonds and gemstones",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
    title: "Worldwide Shipping",
    sub:   "Complimentary shipping on all orders",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    title: "Secure Payments",
    sub:   "Safe and encrypted checkout",
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/>
        <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
      </svg>
    ),
    title: "Luxury Packaging",
    sub:   "Signature packaging for every piece",
  },
];

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY    = "'Inter', sans-serif";

export default function TrustBar() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#f0e8dc] border-y border-[#2a1a0e]/10">
      <div className="max-w-[1320px] mx-auto px-6 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map(({ icon, title, sub }, i) => (
            <div
              key={title}
              className="flex items-start gap-4"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`,
              }}
            >
              <div className="text-[#b08850] shrink-0 mt-0.5">{icon}</div>
              <div>
                <p style={{ fontFamily: BODY, fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{title}</p>
                <p style={{ fontFamily: BODY, fontWeight: 400, fontSize: 12, color: "rgba(107,76,53,0.7)", lineHeight: 1.6 }}>{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
