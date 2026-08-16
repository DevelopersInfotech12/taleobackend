"use client";
import { useState, useEffect } from "react";
import { apiFetch, fmtCurrency, fmtDateTime, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Modal, Badge, PrimaryButton, SecondaryButton, inputCls, selectCls } from "./ui";

const STATUSES = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"];

export default function OrderDetailModal({ open, onClose, orderId, onSaved, showToast }) {
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [tracking, setTracking] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !orderId) return;
    setLoading(true);
    setError("");
    (async () => {
      try {
        const res = await apiFetch(`/orders/${orderId}`, token);
        setOrder(res.data);
        setStatus(res.data.status);
        setTracking(res.data.trackingNumber || "");
        setNotes(res.data.notes || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, orderId, token]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await apiFetch(`/orders/${orderId}`, token, {
        method: "PUT",
        body: JSON.stringify({ status, trackingNumber: tracking, notes }),
      });
      showToast("Order updated");
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={order ? `Order ${order.orderNumber}` : "Order"} width="max-w-2xl">
      {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">{error}</div>}
      {loading ? (
        <p className="text-[12px] text-[#9c8a78] py-8 text-center">Loading…</p>
      ) : order && (
        <div className="space-y-5">
          {/* Customer + shipping */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#fdfaf6] rounded-lg p-3 border border-[#ede4d8]">
              <p className="text-[10px] uppercase tracking-widest text-[#9c8a78] mb-1">Customer</p>
              <p className="text-[13px] text-[#1a1008] font-medium">{order.user?.name}</p>
              <p className="text-[11px] text-[#9c8a78]">{order.user?.email}</p>
              <p className="text-[11px] text-[#9c8a78]">{order.user?.phone}</p>
            </div>
            <div className="bg-[#fdfaf6] rounded-lg p-3 border border-[#ede4d8]">
              <p className="text-[10px] uppercase tracking-widest text-[#9c8a78] mb-1">Shipping Address</p>
              <p className="text-[12px] text-[#1a1008]">{order.shippingAddress?.name}, {order.shippingAddress?.phone}</p>
              <p className="text-[11px] text-[#9c8a78]">{order.shippingAddress?.line1}{order.shippingAddress?.line2 ? `, ${order.shippingAddress.line2}` : ""}</p>
              <p className="text-[11px] text-[#9c8a78]">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-[12px] text-[#5c4f42]">
            <p>Placed: <span className="text-[#1a1008]">{fmtDateTime(order.createdAt)}</span></p>
            <p>Payment: <Badge status={order.paymentMethod === "cod" ? "pending" : "paid"} label={order.paymentMethod?.toUpperCase()} /></p>
            <p>Payment Status: <Badge status={order.paymentStatus} /></p>
            {order.couponCode && <p>Coupon: <span className="text-[#1a1008] font-poppins">{order.couponCode}</span></p>}
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#9c8a78] mb-2">Items</p>
            <div className="border border-[#ede4d8] rounded-lg overflow-hidden">
              {order.items.map((it, i) => (
                <div key={i} className={`flex items-center gap-3 px-3 py-2 ${i % 2 ? "bg-[#fdfaf6]" : ""}`}>
                  {it.image ? <img src={imgUrl(it.image)} alt="" className="w-10 h-10 rounded object-cover border border-[#ede4d8]" /> : <div className="w-10 h-10 rounded bg-[#f0e8dc]" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-[#1a1008] truncate">{it.name}{it.variantLabel ? ` — ${it.variantLabel}` : ""}</p>
                    <p className="text-[10px] text-[#9c8a78] font-poppins">Qty: {it.quantity} × {fmtCurrency(it.price)}</p>
                  </div>
                  <p className="text-[12px] font-medium font-poppins text-[#1a1008]">{fmtCurrency(it.price * it.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="bg-[#fdfaf6] rounded-lg p-3 border border-[#ede4d8] space-y-1 text-[12px] font-poppins">
            <div className="flex justify-between text-[#5c4f42]"><span>Subtotal</span><span>{fmtCurrency(order.subtotal)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-{fmtCurrency(order.discount)}</span></div>}
            <div className="flex justify-between text-[#5c4f42]"><span>Shipping</span><span>{order.shippingCharge ? fmtCurrency(order.shippingCharge) : "Free"}</span></div>
            <div className="flex justify-between text-[#1a1008] font-semibold pt-1 border-t border-[#ede4d8]"><span>Total</span><span>{fmtCurrency(order.total)}</span></div>
          </div>

          {/* Update form */}
          <form onSubmit={submit} className="space-y-4 pt-2 border-t border-[#ede4d8]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-1.5">Order Status</label>
                <select className={selectCls} value={status} onChange={e => setStatus(e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-1.5">Tracking Number</label>
                <input className={inputCls} value={tracking} onChange={e => setTracking(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-1.5">Notes</label>
              <textarea rows={2} className={inputCls} value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <SecondaryButton type="button" onClick={onClose}>Close</SecondaryButton>
              <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : "Update Order"}</PrimaryButton>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
