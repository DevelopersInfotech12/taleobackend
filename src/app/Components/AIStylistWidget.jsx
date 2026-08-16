"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

function Widget() {
  const router = useRouter();
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "92px", // sits right above the 56px WhatsApp FAB (24px + 56px + 12px gap)
        right: "24px",
        zIndex: 999998,
      }}
    >
      {/* pulse ring */}
      <div
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: "50%",
          background: "rgba(201,169,110,0.35)",
          animation: "ai-fab-pulse 2.2s infinite",
        }}
      />
      <style>{`
        @keyframes ai-fab-pulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          70%  { transform: scale(1.4); opacity: 0; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes ai-fab-float {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-3px); }
        }
      `}</style>

      {/* tooltip (desktop hover) */}
      <div
        style={{
          position: "absolute",
          right: "68px",
          top: "50%",
          transform: `translateY(-50%) translateX(${hover ? "0" : "6px"})`,
          opacity: hover ? 1 : 0,
          pointerEvents: "none",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          background: "#1a0c06",
          color: "#f5e9d3",
          fontFamily: "var(--font-jost), system-ui, sans-serif",
          fontSize: 12.5,
          fontWeight: 500,
          padding: "7px 12px",
          borderRadius: 8,
          whiteSpace: "nowrap",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        }}
        className="hidden sm:block"
      >
        ✨ AI Jewellery Stylist
      </div>

      <button
        onClick={() => router.push("/ai-recommendation")}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label="AI Jewellery Stylist"
        style={{
          position: "relative",
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e8c874 0%, #a67c2e 55%, #6b5119 100%)",
          boxShadow: "0 4px 20px rgba(166,124,46,0.55)",
          animation: "ai-fab-float 2.6s ease-in-out infinite",
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2.5c.35 0 .66.23.76.57l1.36 4.6 4.6 1.36c.34.1.57.41.57.76s-.23.66-.57.76l-4.6 1.36-1.36 4.6a.79.79 0 0 1-1.52 0l-1.36-4.6-4.6-1.36a.79.79 0 0 1 0-1.52l4.6-1.36 1.36-4.6c.1-.34.41-.57.76-.57Z"
            fill="#fff"
          />
          <path
            d="M19 14.5c.28 0 .53.18.6.46l.5 1.9 1.9.5a.62.62 0 0 1 0 1.2l-1.9.5-.5 1.9a.62.62 0 0 1-1.2 0l-.5-1.9-1.9-.5a.62.62 0 0 1 0-1.2l1.9-.5.5-1.9c.07-.28.32-.46.6-.46Z"
            fill="#fff"
            opacity="0.9"
          />
        </svg>
      </button>
    </div>
  );
}

export default function AIStylistWidget() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(<Widget />, document.body);
}
