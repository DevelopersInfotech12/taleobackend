"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch, fmtCurrency, fmtDate } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Pagination, Toast,
  PageHeader, StatStrip, FilterBar, filterInputCls, filterSelectCls, FilterLabel, ResetButton,
  TableShell, Thead, rowCls, AccentCell, editBtnCls,
} from "../components/ui";
import OrderDetailModal from "../components/OrderDetailModal";

const STATUSES = ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"];

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sort, setSort] = useState("newest");

  const [selectedOrder, setSelectedOrder] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10", sort });
      if (search) params.set("search", search);
      if (status) params.set("status", status);
      if (paymentStatus) params.set("paymentStatus", paymentStatus);
      if (paymentMethod) params.set("paymentMethod", paymentMethod);
      if (startDate) params.set("startDate", startDate);
      if (endDate) params.set("endDate", endDate);

      const res = await apiFetch(`/orders?${params.toString()}`, token);
      setOrders(res.data.orders || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, status, paymentStatus, paymentMethod, startDate, endDate, sort]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const resetFilters = () => {
    setSearchInput(""); setSearch(""); setStatus(""); setPaymentStatus(""); setPaymentMethod("");
    setStartDate(""); setEndDate(""); setSort("newest"); setPage(1);
  };

  const delivered = orders.filter(o => o.status === "delivered").length;
  const pendingPay = orders.filter(o => o.paymentStatus === "pending").length;

  return (
    <>
      <PageHeader eyebrow="Order Management" title="Orders" />

      <StatStrip stats={[
        { label: "Total", value: total },
        { label: "This Page", value: orders.length },
        { label: "Delivered", value: delivered },
        { label: "Payment Pending", value: pendingPay },
      ]} />

      <FilterBar>
        <div className="flex-1 min-w-[160px]">
          <FilterLabel>Search Order #</FilterLabel>
          <input className={filterInputCls} placeholder="AMM-00001" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
        <div>
          <FilterLabel>Status</FilterLabel>
          <select className={filterSelectCls + " min-w-[130px]"} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        <div>
          <FilterLabel>Payment Status</FilterLabel>
          <select className={filterSelectCls + " min-w-[130px]"} value={paymentStatus} onChange={e => { setPaymentStatus(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <div>
          <FilterLabel>Payment Method</FilterLabel>
          <select className={filterSelectCls + " min-w-[120px]"} value={paymentMethod} onChange={e => { setPaymentMethod(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="cod">COD</option>
            <option value="prepaid">Prepaid</option>
          </select>
        </div>
        <div>
          <FilterLabel>From</FilterLabel>
          <input type="date" className={filterSelectCls + " min-w-[130px]"} value={startDate} onChange={e => { setStartDate(e.target.value); setPage(1); }} />
        </div>
        <div>
          <FilterLabel>To</FilterLabel>
          <input type="date" className={filterSelectCls + " min-w-[130px]"} value={endDate} onChange={e => { setEndDate(e.target.value); setPage(1); }} />
        </div>
        <div>
          <FilterLabel>Sort</FilterLabel>
          <select className={filterSelectCls + " min-w-[150px]"} value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="total-desc">Total: High to Low</option>
            <option value="total-asc">Total: Low to High</option>
          </select>
        </div>
        <ResetButton onClick={resetFilters} />
      </FilterBar>

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : orders.length === 0 ? <EmptyState message="No orders found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date", ""]} />
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} className={rowCls}>
                    <AccentCell className="pl-5 font-poppins text-[11px] text-[#5c4f42]">{o.orderNumber}</AccentCell>
                    <td className="px-4 py-3">
                      <p className="text-[#1a1008] font-medium">{o.user?.name || "—"}</p>
                      <p className="text-[10px] text-[#9c8a78]">{o.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-[#5c4f42]">{o.items?.length}</td>
                    <td className="px-4 py-3 font-semibold text-[#1a1008]">{fmtCurrency(o.total)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <Badge status={o.paymentMethod === "cod" ? "pending" : "paid"} label={o.paymentMethod?.toUpperCase()} />
                        <Badge status={o.paymentStatus} />
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge status={o.status} /></td>
                    <td className="px-4 py-3 text-[#9c8a78]">{fmtDate(o.createdAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedOrder(o._id)} className={editBtnCls}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pages={pages} total={total} onChange={setPage} />
      </TableShell>

      <OrderDetailModal
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        orderId={selectedOrder}
        onSaved={fetchOrders}
        showToast={showToast}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
