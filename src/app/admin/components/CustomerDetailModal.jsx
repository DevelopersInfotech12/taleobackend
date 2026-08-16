"use client";
import { useState, useEffect } from "react";
import { apiFetch, fmtCurrency, fmtDate } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Modal, Badge, EmptyState, Thead, rowCls, AccentCell, editBtnCls } from "./ui";
import OrderDetailModal from "./OrderDetailModal";

export default function CustomerDetailModal({ open, onClose, customerId, showToast }) {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewOrderId, setViewOrderId] = useState(null);

  const fetchCustomer = async () => {
    if (!open || !customerId) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(`/users/customers/${customerId}`, token);
      setData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomer(); /* eslint-disable-next-line */ }, [open, customerId, token]);

  const initials = (name) => (name || "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <>
      <Modal open={open} onClose={onClose} title={data ? data.customer.name : "Customer"} width="max-w-3xl">
        {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">{error}</div>}
        {loading ? (
          <p className="text-[12px] text-[#9c8a78] py-8 text-center">Loading…</p>
        ) : data && (
          <div className="space-y-5">
            {/* Profile */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#e8d5b0] text-[#8b6914] flex items-center justify-center text-[16px] font-semibold flex-shrink-0">
                {initials(data.customer.name)}
              </div>
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-[#1a1008]">{data.customer.name}</p>
                <p className="text-[12px] text-[#9c8a78]">{data.customer.email}</p>
                <p className="text-[12px] text-[#9c8a78]">{data.customer.phone || "No phone on file"}</p>
              </div>
              <div className="ml-auto">
                <Badge status={data.customer.isActive ? "active" : "inactive"} label={data.customer.isActive ? "Active" : "Inactive"} />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#fdfaf6] rounded-lg p-3 border border-[#ede4d8] text-center">
                <p className="text-[18px] font-semibold text-[#1a1008] font-poppins">{data.stats.orderCount}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#9c8a78] mt-0.5">Orders</p>
              </div>
              <div className="bg-[#fdfaf6] rounded-lg p-3 border border-[#ede4d8] text-center">
                <p className="text-[18px] font-semibold text-[#1a1008] font-poppins">{fmtCurrency(data.stats.totalSpent)}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#9c8a78] mt-0.5">Total Spent</p>
              </div>
              <div className="bg-[#fdfaf6] rounded-lg p-3 border border-[#ede4d8] text-center">
                <p className="text-[18px] font-semibold text-[#1a1008] font-poppins">{fmtDate(data.customer.createdAt)}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#9c8a78] mt-0.5">Joined</p>
              </div>
            </div>

            {/* Addresses */}
            {data.customer.addresses?.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#9c8a78] mb-2">Addresses</p>
                <div className="grid grid-cols-2 gap-2">
                  {data.customer.addresses.map((a) => (
                    <div key={a._id} className="bg-[#fdfaf6] rounded-lg p-3 border border-[#ede4d8] text-[11px] text-[#5c4f42]">
                      <p className="text-[#1a1008] font-medium mb-0.5">{a.label}{a.isDefault ? " · Default" : ""}</p>
                      <p>{a.line1}{a.line2 ? `, ${a.line2}` : ""}</p>
                      <p>{a.city}, {a.state} {a.pincode}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Orders table */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#9c8a78] mb-2">Order History</p>
              <div className="border border-[#ede4d8] rounded-lg overflow-hidden">
                {data.orders.length === 0 ? (
                  <EmptyState message="No orders placed yet" />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-[12px]">
                      <Thead headers={["Order #", "Items", "Total", "Status", "Date", ""]} />
                      <tbody>
                        {data.orders.map((o) => (
                          <tr key={o._id} className={rowCls}>
                            <AccentCell className="pl-5 font-poppins text-[11px] text-[#5c4f42]">{o.orderNumber}</AccentCell>
                            <td className="px-4 py-3 text-[#5c4f42]">{o.items?.length}</td>
                            <td className="px-4 py-3 font-semibold text-[#1a1008]">{fmtCurrency(o.total)}</td>
                            <td className="px-4 py-3"><Badge status={o.status} /></td>
                            <td className="px-4 py-3 text-[#9c8a78]">{fmtDate(o.createdAt)}</td>
                            <td className="px-4 py-3">
                              <button onClick={() => setViewOrderId(o._id)} className={editBtnCls}>View</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <OrderDetailModal
        open={!!viewOrderId}
        onClose={() => setViewOrderId(null)}
        orderId={viewOrderId}
        onSaved={fetchCustomer}
        showToast={showToast}
      />
    </>
  );
}
