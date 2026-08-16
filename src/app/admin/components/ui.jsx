"use client";
import { useEffect } from "react";

// ── Status Badge ───────────────────────────────────────────
const STATUS_MAP = {
  pending:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  placed:     "bg-yellow-50 text-yellow-700 border-yellow-200",
  confirmed:  "bg-sky-50 text-sky-700 border-sky-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered:  "bg-green-50 text-green-700 border-green-200",
  cancelled:  "bg-red-50 text-red-700 border-red-200",
  returned:   "bg-gray-50 text-gray-600 border-gray-200",
  paid:       "bg-green-50 text-green-700 border-green-200",
  failed:     "bg-red-50 text-red-700 border-red-200",
  refunded:   "bg-gray-50 text-gray-600 border-gray-200",
  active:     "bg-green-50 text-green-700 border-green-200",
  inactive:   "bg-gray-50 text-gray-600 border-gray-200",
  admin:      "bg-purple-50 text-purple-700 border-purple-200",
  customer:   "bg-gray-50 text-gray-600 border-gray-200",
};

export function Badge({ status, label }) {
  const key = (status || "").toString().toLowerCase();
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide whitespace-nowrap ${STATUS_MAP[key] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {label || status}
    </span>
  );
}

// ── Spinner ────────────────────────────────────────────────
export function Spinner({ label = "Loading…" }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[12px] text-[#9c8a78] uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────
export function EmptyState({ message = "No data found" }) {
  return <p className="text-[12px] text-[#b0a090] px-5 py-10 text-center">{message}</p>;
}

// ── Error Banner ───────────────────────────────────────────
export function ErrorBanner({ message }) {
  if (!message) return null;
  return <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-[12px] mb-4">{message}</div>;
}

// ── Toast (simple, auto-dismiss) ──────────────────────────
export function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = type === "error"
    ? "bg-red-600 text-white"
    : "bg-[#1a1008] text-[#e8d5b0]";

  return (
    <div className={`fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-lg shadow-lg text-[12px] font-medium ${colors} animate-fadeUp`}>
      {message}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, width = "max-w-2xl" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-fadeIn">
      <div className={`bg-white rounded-2xl shadow-xl border border-[#ede4d8] w-full ${width} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ede4d8] sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-[15px] font-semibold text-[#1a1008]" style={{ fontFamily: "Georgia, serif" }}>{title}</h2>
          <button onClick={onClose} className="text-[#9c8a78] hover:text-[#1a1008] text-lg leading-none">✕</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Confirm Dialog ─────────────────────────────────────────
export function ConfirmDialog({ open, title = "Are you sure?", message, onConfirm, onCancel, confirmLabel = "Delete", loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-[#ede4d8] w-full max-w-sm p-6">
        <h3 className="text-[15px] font-semibold text-[#1a1008] mb-2">{title}</h3>
        <p className="text-[12px] text-[#9c8a78] mb-5">{message}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="text-[12px] px-4 font-bold py-2 rounded-lg border border-[#e0d4c4] text-[#5c4f42] hover:bg-[#fdfaf6]">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="text-[12px] px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-bold disabled:opacity-60">
            {loading ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Pagination (matches Blog admin pager) ───────────────────
export function Pagination({ page, pages, onChange, total, limit = 10 }) {
  if (!pages || pages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-[#f0e8dc] bg-[#fdfaf6]" style={{ padding: "12px 16px" }}>
      <span className="text-[11px] text-[#b8a898] tracking-wide">
        {total != null ? `${Math.min((page - 1) * limit + 1, total)}–${Math.min(page * limit, total)} of ${total}` : ""}
      </span>
      <div className="flex gap-1">
        {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`h-7 min-w-[28px] px-2 rounded-[5px] text-[11px] font-semibold border transition-colors ${p === page
              ? "bg-[#1a1008] text-[#c9a84c] border-[#c9a84c]"
              : "bg-white text-[#7a6a5a] border-[#ede4d8] hover:border-[#c9a84c] hover:text-[#c9a84c]"
              }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Form field wrappers ────────────────────────────────────
export function Field({ label, children, span }) {
  return (
    <div className={span ? "col-span-2" : ""}>
      <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export const inputCls = "w-full border border-[#e0d4c4] rounded-lg px-3 py-2 text-[13px] text-[#1a1008] focus:outline-none focus:border-[#c9a84c] bg-[#fdfaf6]";
export const selectCls = inputCls + " appearance-none";

export function PrimaryButton({ children, ...props }) {
  return (
    <button {...props} className={`bg-[#1a1008] text-[#e8d5b0] px-4 py-2 rounded-lg text-[12px] uppercase tracking-widest font-medium hover:bg-[#3d2a1a] transition-colors disabled:opacity-60 ${props.className || ""}`}>
      {children}
    </button>
  );
}

// ── Blog-style page header (eyebrow + serif title, matches Blog admin) ──
export function PageHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
      <div>
        <p className="text-[11px] tracking-[0.2em] uppercase text-[#c9a84c] font-bold mb-1.5">
          {eyebrow || subtitle || "\u00A0"}
        </p>
        <h1
          className="text-[32px] font-bold text-[#1a1008] leading-none tracking-tight m-0"
          style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
        >
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}

// Gold gradient CTA button — exact match of Blog admin's "+ New Post"
export function HeaderButton({ children, ...props }) {
  return (
    <button
      {...props}
      className={`flex items-center gap-2 text-[#1a1008] font-bold text-[11px] tracking-[0.15em] uppercase px-[22px] h-10 rounded-md border-none cursor-pointer transition-opacity disabled:opacity-60 ${props.className || ""}`}
      style={{
        background: "linear-gradient(135deg, #c9a84c 0%, #e8c97a 50%, #c9a84c 100%)",
        boxShadow: "0 2px 12px rgba(201,168,76,0.35)",
      }}
      onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(201,168,76,0.5)"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(201,168,76,0.35)"; }}
    >
      {children}
    </button>
  );
}

// ── Blog-style stat strip (first card dark w/ gold top accent) ──
export function StatStrip({ stats }) {
  return (
    <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}>
      {stats.map(({ label, value }, i) => (
        <div
          key={label}
          className="relative overflow-hidden rounded-[10px] px-5 py-4 flex items-center justify-between"
          style={i === 0
            ? { background: "linear-gradient(135deg, #1a1008 0%, #2e1f0a 100%)", border: "1px solid #3d2a10" }
            : { background: "#fdfaf6", border: "1px solid #ede4d8" }}
        >
          {i === 0 && (
            <span
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: "linear-gradient(90deg, #c9a84c, #e8c97a, #c9a84c)" }}
            />
          )}
          <p className={`text-[10px] tracking-[0.15em] uppercase font-bold m-0 ${i === 0 ? "text-[#c9a84c]" : "text-[#9c8a78]"}`}>
            {label}
          </p>
          <p
            className="text-[28px] font-bold m-0 leading-none"
            style={{ fontFamily: "Georgia, serif", color: i === 0 ? "#f5ede0" : "#1a1008" }}
          >
            {value}
          </p>
        </div>
      ))}
    </div>
  );
}

// ── Blog-style filter bar ──────────────────────────────────
export const filterInputCls = "w-full h-[34px] border border-[#ddd5c8] rounded-md px-3 text-[12px] text-[#1a1008] bg-white focus:outline-none focus:border-[#c9a84c] box-border";
export const filterSelectCls = "h-[34px] border border-[#ddd5c8] rounded-md px-3 text-[12px] text-[#1a1008] bg-white focus:outline-none focus:border-[#c9a84c] cursor-pointer";

// Card container that wraps a row of filter fields, matching the Blog admin filter bar
export function FilterBar({ children }) {
  return (
    <div
      className="flex flex-wrap gap-2.5 items-end mb-4 rounded-[10px]"
      style={{ padding: "14px 16px", background: "#fdfaf6", border: "1px solid #ede4d8" }}
    >
      {children}
    </div>
  );
}

export function FilterLabel({ children }) {
  return <label className="block text-[9px] tracking-[0.18em] uppercase text-[#9c8a78] font-bold mb-[5px]">{children}</label>;
}

export function ResetButton({ onClick, children = "Clear" }) {
  return (
    <button
      onClick={onClick}
      className="h-[34px] px-4 bg-transparent border border-[#ddd5c8] rounded-md text-[10px] font-semibold tracking-[0.15em] uppercase text-[#7a6a5a] cursor-pointer transition-colors hover:border-[#c9a84c] hover:text-[#c9a84c]"
    >
      {children}
    </button>
  );
}

// ── Blog-style table shell ─────────────────────────────────
export function TableShell({ children }) {
  return (
    <div
      className="bg-white rounded-xl border border-[#ede4d8] overflow-hidden"
      style={{ boxShadow: "0 1px 3px rgba(26,16,8,0.04)" }}
    >
      {children}
    </div>
  );
}

export function Thead({ headers }) {
  return (
    <thead>
      <tr className="bg-[#fdfaf6] border-b border-[#ede4d8]">
        {headers.map(h => (
          <th key={h} className="text-left px-4 py-[11px] text-[11px] tracking-[0.18em] uppercase text-[#b8a898] font-bold">
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// Row wrapper: hover bg + gold accent bar revealed on first cell on hover
export const rowCls = "border-b border-[#f5ece0] last:border-0 hover:bg-[#fdfaf6] transition-colors group relative";
export function AccentCell({ children, className = "" }) {
  return (
    <td className={`px-4 py-3 relative ${className}`}>
      <span
        className="absolute left-0 top-0 bottom-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: "linear-gradient(180deg, #c9a84c, #e8c97a)" }}
      />
      {children}
    </td>
  );
}
export const editBtnCls = "text-[10.5px] font-bold text-[#c9a84c] hover:text-[#8b6914] uppercase tracking-[0.12em] transition-colors";
export const delBtnCls = "text-[10.5px] font-bold text-[#d4756a] hover:text-[#a34030] uppercase tracking-[0.12em] transition-colors";

export function SecondaryButton({ children, ...props }) {
  return (
    <button {...props} className={`border border-[#e0d4c4] text-[#5c4f42] px-4 py-2 rounded-lg text-[12px] uppercase tracking-widest font-medium hover:bg-[#fdfaf6] transition-colors disabled:opacity-60 ${props.className || ""}`}>
      {children}
    </button>
  );
}
