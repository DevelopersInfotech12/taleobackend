"use client";
import { useRef, useState, useEffect } from "react";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY    = "'Inter', sans-serif";

export default function NewsletterBar() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = () => {
    if (!email.trim() || !email.includes("@")) { setError(true); return; }
    setDone(true); setEmail(""); setError(false);
  };

  const fade = (delay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
  });

  return (
    <section
      ref={ref}
      className="py-10 bg-[#0d0702] border-y border-[#2a1a0e]/10"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
    >
      <div className="max-w-[900px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div className="flex flex-col gap-1.5">
            {/* Eyebrow — Inter */}
             <div className="flex items-center gap-3 ">
              <span style={{ display: "block", width: 24, height: 1, background: "#c9a96e" }} />
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase", color: "#c9a96e" }}>
                Let's Stay in Touch
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
      color: "#ffffffe5",
      margin: 0,
      letterSpacing: "-0.02em",
      whiteSpace: "nowrap",
    }}
  >
    Join {" "}
    <span
      style={{
        fontWeight: 400,
        fontStyle: "italic",
        color: "#9b7020",
        letterSpacing: "-0.01em",
      }}
    >
      TALEO
    </span>
  </h2>
</div>
            {/* Body — Inter */}
            <p style={{ fontFamily: BODY, fontSize: 14, color: "#948577", lineHeight: 1.6, maxWidth: 300, margin: 0, fontWeight: 600 }}>
              First access to new collections, exclusive offers, and stories that endure.
            </p>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4">
            {done ? (
              <div className="flex items-center gap-2.5 px-4 py-3.5 bg-[#c9a96e]/8 border border-[#c9a96e]/30"
                   style={{ fontFamily: BODY, fontSize: 13, color: "#2a1a0e" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                You're on the list — watch your inbox.
              </div>
            ) : (
              <div className={`flex border bg-white transition-colors ${error ? "border-red-400" : "border-[#2a1a0e]/20 focus-within:border-[#c9a96e]"}`}>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(false); }}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="Your email address"
                  className="flex-1 border-none outline-none bg-transparent px-4 py-3.5 placeholder-[#6b4c35]/90"
                  style={{ fontFamily: BODY, fontSize: 13, color: "#998779" }}
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-[#2a1a0e] hover:bg-[#c9a96e] text-white transition-colors duration-300 shrink-0 px-6 py-3.5"
                  style={{ fontFamily: BODY, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}
                >
                  Subscribe
                </button>
              </div>
            )}

            <div className="flex gap-5">
              {[
                { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10", label: "No spam" },
                { icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z", label: "Early access" },
                { icon: "M20 12v10H4V12M22 7H2v5h20V7zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z", label: "Member offers" },
              ].map(({ icon, label }) => (
                <span key={label} className="flex items-center gap-1.5" style={{ fontFamily: BODY, fontSize: 12, color: "#aca299" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#bdab8a" strokeWidth="1.5"><path d={icon} /></svg>
                  {label}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
