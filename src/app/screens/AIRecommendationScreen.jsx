"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import ProductCard from "../Components/shop/ProductCard";
import { Stagger, StaggerItem } from "../Components/motion/Reveal";

const DISPLAY = "var(--font-playfair), Georgia, serif";
const BODY = "var(--font-jost), system-ui, sans-serif";

const GOLD = "#a67c2e";
const GOLD_LIGHT = "#c9a96e";
const DARK = "#1a0c06";
const DARK2 = "#3d1f10";
const CREAM = "#faf7f2";
const BORDER = "#e8ddd0";
const TEXT = "#2c2c2c";
const MUTED = "#6b5d44";

const QUESTIONS = [
  {
    id: "recipient",
    text: "Who are you shopping for?",
    subtitle: "This helps us pick the right feel",
    icon: "🎁",
    options: ["Myself", "My Partner", "Mother / Family", "A Friend", "Corporate Gifting"],
  },
  {
    id: "occasion",
    text: "What's the occasion?",
    subtitle: "Every piece tells a different story",
    icon: "✨",
    options: ["Wedding / Engagement", "Anniversary", "Birthday", "Festival / Celebration", "Everyday Wear", "Just Because"],
  },
  {
    id: "category",
    text: "Which piece speaks to you?",
    subtitle: "Or let us surprise you",
    icon: "💍",
    options: ["Rings", "Necklaces", "Earrings", "Bracelets", "Surprise Me"],
  },
  {
    id: "metal",
    text: "Any metal you love?",
    subtitle: "The base of every design",
    icon: "🥇",
    options: ["Yellow Gold", "White Gold", "Rose Gold", "Platinum", "Silver 925", "No Preference"],
  },
  {
    id: "gemstone",
    text: "A stone that catches your eye?",
    subtitle: "Diamonds, colour, or clean metal",
    icon: "💎",
    options: ["Diamond", "Pearl", "Ruby", "Emerald", "Sapphire", "No Stone", "No Preference"],
  },
  {
    id: "style",
    text: "How would you describe your style?",
    subtitle: "So the piece feels like you",
    icon: "🎨",
    options: ["Minimal & Delicate", "Bold & Statement", "Vintage & Antique", "Modern & Geometric"],
  },
  {
    id: "budget",
    text: "What's your comfortable budget?",
    subtitle: "We'll keep every suggestion within reach",
    icon: "💰",
    options: ["Under ₹5,000", "₹5,000 – ₹15,000", "₹15,000 – ₹50,000", "₹50,000 – ₹1,00,000", "Above ₹1,00,000"],
  },
];

async function getRecommendations(answers) {
  const res = await fetch("/api/ai-recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export default function AIRecommendationScreen() {
  const router = useRouter();

  const [answered, setAnswered] = useState([]);
  const [curQ, setCurQ] = useState(0);
  const [phase, setPhase] = useState("questions"); // questions | loading | result
  const [result, setResult] = useState(null);
  const [animState, setAnimState] = useState("in");
  const [displayedQ, setDisplayedQ] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [busy, setBusy] = useState(false);

  function advance(answer) {
    if (busy) return;
    setBusy(true);

    const rec = [...answered, { answer }];
    setAnimState("out");

    setTimeout(() => {
      setAnswered(rec);
      setHovered(null);

      const nextQ = curQ + 1;
      if (nextQ < QUESTIONS.length) {
        setCurQ(nextQ);
        setDisplayedQ(nextQ);
        setAnimState("in");
        setBusy(false);
      } else {
        const map = {};
        rec.forEach((r, i) => {
          map[QUESTIONS[i].id] = r.answer;
        });

        setDisplayedQ(nextQ);
        setPhase("loading");
        setAnimState("in");
        setBusy(false);

        getRecommendations(map)
          .then((data) => {
            setResult(data);
            setPhase("result");
          })
          .catch(() => {
            setResult({
              aiSummary:
                "Here's a curated edit while we reconnect — take a look at what's trending in our collection.",
              source: "rules",
              highlights: [],
              suggestion: {},
              viewAllHref: "/shop",
              products: [],
            });
            setPhase("result");
          });
      }
    }, 260);
  }

  function restart() {
    setAnimState("out");
    setTimeout(() => {
      setAnswered([]);
      setCurQ(0);
      setDisplayedQ(0);
      setPhase("questions");
      setResult(null);
      setHovered(null);
      setAnimState("in");
    }, 260);
  }

  const progress =
    phase === "result" || phase === "loading"
      ? phase === "result"
        ? 100
        : 95
      : Math.round((curQ / QUESTIONS.length) * 100);

  const q = QUESTIONS[displayedQ] || QUESTIONS[QUESTIONS.length - 1];

  return (
    <div style={{ minHeight: "100vh", background: CREAM, fontFamily: BODY }}>
      <style>{`
        .q-card-in  { opacity:1; transform:translateY(0);    transition:opacity 0.26s ease, transform 0.26s ease; }
        .q-card-out { opacity:0; transform:translateY(-10px); transition:opacity 0.26s ease, transform 0.26s ease; pointer-events:none; }
        .opt-chip { transition:border-color 0.15s, background 0.15s, color 0.15s, box-shadow 0.15s, transform 0.12s; }
        .opt-chip:active { transform:scale(0.97); }
        @keyframes slideUp      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseDot     { 0%,100%{opacity:1} 50%{opacity:0.45} }
        @keyframes spinSlow     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes typingBounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-7px)} }
        .result-in  { animation:slideUp 0.4s ease forwards; }
        .cta-btn:hover  { transform:translateY(-1px); box-shadow:0 6px 20px rgba(166,124,46,0.35) !important; }
        .skip-btn:hover { color:${GOLD} !important; border-color:${GOLD} !important; }
        .restart-btn:hover { color:${GOLD} !important; border-color:${GOLD} !important; }
      `}</style>

      <Navbar />

      {/* Sticky progress header — sits just below the fixed Navbar (104px = announcement 34px + nav 70px) */}
      <div className="mt-[104px]">
      <div
        style={{
          position: "sticky",
          top: 104,
          zIndex: 40,
          background: `linear-gradient(135deg,${DARK} 0%,${DARK2} 100%)`,
          padding: "18px 24px 14px",
          boxShadow: "0 4px 20px rgba(26,12,6,0.3)",
        }}
      >
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "rgba(201,169,110,0.18)", border: `1px solid ${GOLD_LIGHT}55`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                }}
              >
                ✨
              </div>
              <div>
                <div style={{ fontFamily: DISPLAY, fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                  AI Jewellery Stylist
                </div>
                <div style={{ fontFamily: BODY, fontSize: 10.5, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD_LIGHT, display: "inline-block", animation: "pulseDot 2s infinite" }} />
                  {phase === "result" ? "Your edit is ready ✓" : phase === "loading" ? "Styling your edit…" : `Question ${curQ + 1} of ${QUESTIONS.length}`}
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push("/shop")}
              style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.22)",
                color: "#fff", borderRadius: 8, padding: "6px 14px",
                fontFamily: BODY, fontSize: 11.5, fontWeight: 500, cursor: "pointer",
              }}
            >
              Browse Shop →
            </button>
          </div>

          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, height: 5, overflow: "hidden" }}>
            <div
              style={{
                height: "100%", borderRadius: 6, background: GOLD_LIGHT,
                width: `${progress}%`, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "26px 16px 90px" }}>
        <div className={animState === "in" ? "q-card-in" : "q-card-out"}>
          {/* Question card */}
          {phase === "questions" && q && (
            <div
              style={{
                background: "#fff", borderRadius: 20, border: `1px solid ${BORDER}`,
                boxShadow: "0 8px 32px rgba(60,40,20,0.08)", overflow: "hidden",
              }}
            >
              <div style={{ background: `linear-gradient(135deg,${DARK} 0%,${DARK2} 100%)`, padding: "24px 26px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span
                    style={{
                      background: "rgba(255,255,255,0.14)", color: "#fff",
                      fontFamily: BODY, fontSize: 10.5, fontWeight: 600,
                      padding: "3px 11px", borderRadius: 20, letterSpacing: "0.05em",
                    }}
                  >
                    QUESTION {curQ + 1} OF {QUESTIONS.length}
                  </span>
                  <span style={{ fontSize: 24 }}>{q.icon}</span>
                </div>
                <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.1rem,2.6vw,1.4rem)", fontWeight: 700, color: "#fff", lineHeight: 1.35, margin: "0 0 6px" }}>
                  {q.text}
                </h2>
                <p style={{ fontFamily: BODY, fontSize: 12.5, fontWeight: 400, color: "rgba(255,255,255,0.7)", margin: 0 }}>
                  {q.subtitle}
                </p>
              </div>

              <div style={{ padding: "22px 24px 24px" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      disabled={busy}
                      onClick={() => advance(opt)}
                      onMouseEnter={() => setHovered(opt)}
                      onMouseLeave={() => setHovered(null)}
                      className="opt-chip"
                      style={{
                        padding: "11px 18px", borderRadius: 24,
                        border: `1.5px solid ${hovered === opt ? GOLD : BORDER}`,
                        background: hovered === opt ? "#f5efe2" : "#fff",
                        color: hovered === opt ? GOLD : MUTED,
                        fontFamily: BODY, fontSize: 13.5, fontWeight: 500,
                        cursor: busy ? "default" : "pointer",
                        boxShadow: hovered === opt ? "0 2px 10px rgba(166,124,46,0.18)" : "none",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {curQ > 0 && (
                  <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px dashed ${BORDER}` }}>
                    <button
                      disabled={busy}
                      onClick={() => !busy && advance("No Preference")}
                      className="skip-btn"
                      style={{
                        background: "none", border: `1px solid ${BORDER}`,
                        borderRadius: 10, padding: "7px 18px", fontSize: 12.5,
                        color: MUTED, cursor: busy ? "default" : "pointer",
                        fontFamily: BODY, transition: "all 0.18s",
                      }}
                    >
                      ⏭ Skip this question
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Loading */}
          {phase === "loading" && (
            <div
              style={{
                background: "#fff", borderRadius: 20, border: `1px solid ${BORDER}`,
                boxShadow: "0 8px 32px rgba(60,40,20,0.08)", padding: "56px 24px", textAlign: "center",
                animation: "slideUp 0.35s ease",
              }}
            >
              <div
                style={{
                  width: 68, height: 68, borderRadius: "50%", margin: "0 auto 18px",
                  background: `linear-gradient(135deg,${DARK},${DARK2})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, animation: "spinSlow 2.4s linear infinite",
                }}
              >
                💫
              </div>
              <h3 style={{ fontFamily: DISPLAY, fontSize: 19, fontWeight: 700, color: TEXT, margin: "0 0 8px" }}>
                Curating your edit…
              </h3>
              <p style={{ fontFamily: BODY, fontSize: 13.5, color: MUTED, margin: "0 0 24px", lineHeight: 1.6 }}>
                Matching your taste with pieces from the Taleo collection.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 9, height: 9, borderRadius: "50%", background: GOLD,
                      animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {phase === "result" && result && (
            <div className="result-in">
              <div
                style={{
                  background: `linear-gradient(135deg,${DARK},${DARK2})`,
                  borderRadius: 20, padding: "26px", marginBottom: 20, textAlign: "center",
                }}
              >
                <div style={{ fontSize: 34, marginBottom: 10 }}>💎</div>
                <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(1.1rem,3vw,1.5rem)", fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>
                  Your Personal Edit
                </h2>
                <p style={{ fontFamily: BODY, fontSize: 13.5, color: "rgba(255,255,255,0.82)", margin: 0, lineHeight: 1.6, maxWidth: 480, marginInline: "auto" }}>
                  {result.aiSummary}
                </p>
              </div>

              {result.highlights?.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: 10,
                    marginBottom: 22,
                  }}
                >
                  {result.highlights.map((h) => (
                    <div
                      key={h.title}
                      style={{
                        background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 14,
                        padding: "14px 16px", display: "flex", alignItems: "center", gap: 10,
                      }}
                    >
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{h.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#a89880" }}>
                          {h.title}
                        </div>
                        <div style={{ fontFamily: DISPLAY, fontSize: 14.5, fontWeight: 600, color: TEXT, lineHeight: 1.3 }}>
                          {h.subtitle}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.products?.length > 0 ? (
                <Stagger className="grid grid-cols-2 sm:grid-cols-2 gap-4 mb-6">
                  {result.products.map((p) => (
                    <StaggerItem key={p.id}>
                      <ProductCard
                        id={p.id}
                        slug={p.slug}
                        name={p.name}
                        category={p.category}
                        description={p.description}
                        price={p.price}
                        originalPrice={p.originalPrice}
                        rating={p.rating}
                        reviews={p.reviews}
                        badge={p.badge}
                        badgeColor={p.badgeColor}
                        image={p.image}
                        images={p.images}
                        variants={p.variants}
                      />
                    </StaggerItem>
                  ))}
                </Stagger>
              ) : (
                <p style={{ textAlign: "center", fontFamily: BODY, fontSize: 13.5, color: MUTED, marginBottom: 20 }}>
                  We couldn't find an exact match — but our full collection has plenty to fall in love with.
                </p>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "10px 14px",
                    background: result.source === "gemini" ? "#f5efe2" : "#f0f6ef",
                    borderRadius: 12,
                    border: result.source === "gemini" ? `1px solid ${GOLD_LIGHT}66` : "1px solid #b8d8b8",
                  }}
                >
                  <span style={{ fontSize: 14 }}>{result.source === "gemini" ? "✨" : "🧠"}</span>
                  <span style={{ fontFamily: BODY, fontSize: 11.5, fontWeight: 500, color: result.source === "gemini" ? GOLD : "#3a7a3a" }}>
                    {result.source === "gemini" ? "Styled by AI" : "Styled by our Taleo Engine"}
                  </span>
                </div>

                <a
                  href={result.viewAllHref || "/shop"}
                  className="cta-btn"
                  style={{
                    padding: "12px 20px", borderRadius: 12, background: GOLD, color: "#fff",
                    fontWeight: 600, fontSize: 13.5, fontFamily: BODY, textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(166,124,46,0.28)", transition: "all 0.2s", whiteSpace: "nowrap",
                  }}
                >
                  View Full Collection →
                </a>
              </div>

              <div style={{ textAlign: "center" }}>
                <button
                  onClick={restart}
                  className="restart-btn"
                  style={{
                    background: "#fff", border: `1.5px solid ${BORDER}`,
                    borderRadius: 10, padding: "10px 26px", fontSize: 14, fontWeight: 500,
                    color: MUTED, cursor: "pointer", fontFamily: BODY, transition: "all 0.2s",
                  }}
                >
                  ↺ Start Over
                </button>
              </div>
            </div>
          )}
        </div>

        <p style={{ textAlign: "center", fontFamily: BODY, fontSize: 11, color: "#a89880", marginTop: 20 }}>
          Suggestions are a starting point — every piece can be tailored to you.
        </p>
      </div>
      </div>

      <Footer />
    </div>
  );
}
