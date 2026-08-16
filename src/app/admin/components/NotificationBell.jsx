"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { apiFetch, fmtCurrency, fmtDate } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";

export default function NotificationBell() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  const fetchPending = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiFetch("/dashboard/pending-shipments?limit=8", token);
      setOrders(res.data.orders || []);
      setCount(res.data.count || 0);
    } catch {
      /* silent — non-critical widget */
    }
  }, [token]);

  useEffect(() => {
    fetchPending();
    const t = setInterval(fetchPending, 60000);
    return () => clearInterval(t);
  }, [fetchPending]);

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors text-[18px]"
        aria-label="Notifications"
      >
        🔔
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-[#ede4d8] shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#ede4d8] flex items-center justify-between">
            <p className="text-[12px] font-semibold text-[#1a1008]">Pending Shipments</p>
            <span className="text-[10px] text-[#9c8a78]">{count} not yet shipped</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {orders.length === 0 ? (
              <p className="text-[12px] text-[#b0a090] px-4 py-6 text-center">All orders are shipped 🎉</p>
            ) : orders.map(o => (
              <div key={o._id} className="px-4 py-2.5 border-b border-[#f5ece0] last:border-0 hover:bg-[#fdfaf6]">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11.5px] font-semibold text-[#1a1008] font-poppins">{o.orderNumber}</p>
                  <p className="text-[11px] text-[#1a1008] font-medium">{fmtCurrency(o.total)}</p>
                </div>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-[10.5px] text-[#9c8a78] truncate">{o.user?.name || "—"} · {o.status}</p>
                  <p className="text-[10px] text-[#b0a090]">{fmtDate(o.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/admin/orders"
            onClick={() => setOpen(false)}
            className="block text-center text-[11px] uppercase tracking-widest text-[#c9a84c] hover:text-[#8b6914] py-2.5 border-t border-[#ede4d8]"
          >
            View all orders →
          </Link>
        </div>
      )}
    </div>
  );
}
