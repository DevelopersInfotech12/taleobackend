"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Checkout-style dark hero header for info pages.
 * Props: title, subtitle, label (small caps above), breadcrumb [{label, href?}]
 */
export default function PageHeader({ title, subtitle, label, breadcrumb = [] }) {
  return (
    <div>
      {/* Dark banner */}
      <div
        className="w-full py-14 md:py-20 flex flex-col items-center justify-center text-center"
        style={{ background: "linear-gradient(160deg,#1a0c06 0%,#3d1f10 60%,#1a0c06 100%)" }}
      >
        {label && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-[family-name:var(--font-jost)] uppercase text-[#c9a96e] mb-3"
            style={{ fontSize: "11px", letterSpacing: "0.35em", fontWeight: 600 }}
          >
            {label}
          </motion.p>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="font-[family-name:var(--font-playfair)] text-white"
          style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 700, lineHeight: 1.15 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="font-[family-name:var(--font-jost)] text-[#e8d5b0]/60 mt-3"
            style={{ fontSize: "14px", letterSpacing: "0.02em" }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Breadcrumb strip */}
      {breadcrumb.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="w-full bg-white border-b border-[#e8ddd0]"
        >
          <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center gap-2">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#b08850" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                )}
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="font-[family-name:var(--font-jost)] text-[#b08850] hover:text-[#3d1f10] transition-colors"
                    style={{ fontSize: "12px", letterSpacing: "0.04em" }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className="font-[family-name:var(--font-jost)] text-[#3d1f10]/50"
                    style={{ fontSize: "12px", letterSpacing: "0.04em" }}
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
