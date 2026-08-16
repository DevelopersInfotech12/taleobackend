"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { apiFetch, fmtCurrency } from "./lib/api";
import { useAuth } from "./lib/AdminAuthContext";
import { Spinner, ErrorBanner, Badge, EmptyState, PageHeader, TableShell, Thead, rowCls, AccentCell } from "./components/ui";
import Chart from "chart.js/auto";

function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-[#ede4d8] flex items-start gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-xl shrink-0 ${accent}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-[#9c8a78] font-bold">{label}</p>
        <p className="text-[22px] font-semibold text-[#1a1008] leading-tight mt-0.5 truncate">{value}</p>
        {sub && <p className="text-[11px] text-[#b0a090] mt-0.5 font-poppins">{sub}</p>}
      </div>
    </div>
  );
}

function MiniChart({ data }) {
  const chartRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    if (instanceRef.current) instanceRef.current.destroy();

    const months = data.map(d => d.name?.split(" ")[0]);
    const revenue = data.map(d => d.revenue);
    const peak = Math.max(...revenue);

    const n = revenue.length;
    const sumX = n * (n - 1) / 2;
    const sumY = revenue.reduce((a, b) => a + b, 0);
    const sumXY = revenue.reduce((s, v, i) => s + i * v, 0);
    const sumX2 = revenue.reduce((s, _, i) => s + i * i, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const trendData = revenue.map((_, i) => Math.round(intercept + slope * i));

    const avg = Math.round(sumY / n);
    const peakMonth = months[revenue.indexOf(peak)];
    const fmt = v => "₹" + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v);

    instanceRef.current = new Chart(chartRef.current, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "Revenue",
            data: revenue,
            backgroundColor: revenue.map(v => v === peak ? "#c9a84c" : "rgba(201,168,76,0.35)"),
            borderColor: revenue.map(v => v === peak ? "#8b6914" : "#c9a84c"),
            borderWidth: 1.5,
            borderRadius: 6,
            borderSkipped: false,
            order: 2,
          },
          {
            label: "Trend",
            data: trendData,
            type: "line",
            borderColor: "#8b6914",
            borderWidth: 2,
            borderDash: [5, 4],
            pointRadius: 0,
            tension: 0.4,
            fill: false,
            order: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => " ₹" + ctx.parsed.y.toLocaleString("en-IN"),
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            border: { display: false },
            ticks: { font: { size: 12 }, color: "#9c8a78", autoSkip: false },
          },
          y: {
            grid: { color: "rgba(156,138,120,0.12)" },
            border: { display: false, dash: [4, 4] },
            ticks: {
              font: { size: 11 },
              color: "#9c8a78",
              callback: v => "₹" + (v / 1000).toFixed(0) + "k",
            },
          },
        },
      },
    });

    return () => instanceRef.current?.destroy();
  }, [data]);

  if (!data || data.length === 0)
    return <p className="text-[13px] text-[#b0a090] py-8 text-center">No sales data yet</p>;

  const revenue = data.map(d => d.revenue);
  const total = revenue.reduce((a, b) => a + b, 0);
  const avg = Math.round(total / revenue.length);
  const peak = Math.max(...revenue);
  const peakMonth = data[revenue.indexOf(peak)]?.name?.split(" ")[0];
  const fmt = v => "₹" + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex gap-4 text-[11px] text-[#9c8a78]">
          <span>Avg: {fmt(avg)}/mo</span>
          <span>Peak: {fmt(peak)} ({peakMonth})</span>
        </div>
        <span className="text-[11px] text-[#9c8a78]">
          Total: ₹{(total / 1000).toFixed(0)}k
        </span>
      </div>
      <div className="relative h-[200px] w-full mt-2">
        <canvas ref={chartRef} role="img" aria-label="Revenue bar chart last 6 months" />
      </div>
      <div className="flex items-center gap-3 mt-3 text-[11px] text-[#9c8a78]">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#c9a84c] inline-block" />
          Monthly revenue
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-5 border-t-2 border-dashed border-[#8b6914] inline-block" />
          Trend
        </span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await apiFetch("/dashboard", token);
        setData(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await apiFetch("/dashboard/pending-shipments?limit=6", token);
        setPending(res.data);
      } catch {
        /* non-critical */
      }
    })();
  }, [token]);

  const pct = (cur, prev) => {
    if (!prev) return "+∞";
    const p = (((cur - prev) / prev) * 100).toFixed(1);
    return `${p > 0 ? "+" : ""}${p}% vs last month`;
  };

  if (loading) return <Spinner label="Loading dashboard…" />;
  if (error) return <ErrorBanner message={error} />;
  if (!data) return null;

  return (
    <>
      <PageHeader eyebrow={`Welcome back, ${user?.name}`} title="Dashboard" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={fmtCurrency(data.stats.totalRevenue)} sub={fmtCurrency(data.stats.monthRevenue) + " this month"} icon="₹" accent="bg-amber-50 text-amber-700" />
        <StatCard label="Orders" value={data.stats.totalOrders} sub={pct(data.stats.monthOrders, data.stats.lastMonthOrders)} icon="📦" accent="bg-blue-50 text-blue-700" />
        <StatCard label="Customers" value={data.stats.totalCustomers} sub={`+${data.stats.newCustomers} this month`} icon="👤" accent="bg-purple-50 text-purple-700" />
        <StatCard label="Products" value={data.stats.totalProducts} sub={`${data.stats.lowStockProducts} low stock`} icon="💎" accent="bg-rose-50 text-rose-700" />
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 bg-white rounded-xl p-5 border border-[#ede4d8]">
          <h2 className="text-[14px] font-bold text-[#1a1008] mb-4" style={{ color: "#47382a" }}>Revenue — Last 6 Months</h2>
          <MiniChart data={data.monthlySales} />
        </div>
        <div className="bg-white rounded-xl p-5 border border-[#ede4d8]">
          <h2 className="text-[14px] font-bold text-[#1a1008] mb-4" style={{ color: "#47382a" }}>Top Products</h2>
          {data.topProducts.length === 0 && <EmptyState message="No products yet" />}
          <div className="space-y-3">
            {data.topProducts.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3">
                <span className="text-[11px] text-[#b0a090] w-4">{i + 1}</span>
                {p.images?.[0] && <img src={p.images[0]} alt="" className="w-8 h-8 rounded object-cover border border-[#ede4d8]" />}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#1a1008] truncate">{p.name}</p>
                  <p className="text-[10px] text-[#9c8a78]">{p.soldCount || 0} sold</p>
                </div>
                <p className="text-[12px] font-medium font-poppins text-[#1a1008]">{fmtCurrency(p.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {pending && pending.count > 0 && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-3 flex items-center gap-3">
          <span className="text-xl">🔔</span>
          <p className="text-[12.5px] text-amber-800">
            <strong>{pending.count}</strong> order{pending.count !== 1 ? "s" : ""} {pending.count !== 1 ? "are" : "is"} placed but not yet shipped.
          </p>
        </div>
      )}

      <TableShell>
        <div className="px-5 py-4 border-b border-[#ede4d8] flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-[#1a1008]" style={{ color: "#47382a" }}>Pending Shipments</h2>
          <Link href="/admin/orders" className="text-[11px] font-bold uppercase tracking-widest text-[#c9a84c] hover:text-[#8b6914]">View all orders →</Link>
        </div>
        {!pending || pending.orders.length === 0 ? (
          <EmptyState message="No pending shipments — all orders are shipped" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["Order #", "Customer", "Amount", "Status", "Placed"]} />
              <tbody>
                {pending.orders.map((o) => (
                  <tr key={o._id} className={rowCls}>
                    <AccentCell className="pl-5 font-poppins text-[11px] text-[#5c4f42]">{o.orderNumber || o._id?.slice(-8).toUpperCase()}</AccentCell>
                    <td className="px-4 py-3 text-[#1a1008]">{o.user?.name || "—"}</td>
                    <td className="px-4 py-3 font-semibold font-poppins text-[#1a1008]">{fmtCurrency(o.total)}</td>
                    <td className="px-4 py-3"><Badge status={o.status} /></td>
                    <td className="px-4 py-3 text-[#9c8a78]">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableShell>

      <div className="mb-8" />

      <TableShell>
        <div className="px-5 py-4 border-b border-[#ede4d8] flex items-center justify-between">
          <h2 className="text-[14px] font-bold text-[#1a1008]" style={{ color: "#47382a" }}>Recent Orders</h2>
          <Link href="/admin/orders" className="text-[12px] font-bold uppercase tracking-widest text-[#c9a84c] hover:text-[#8b6914]">View all →</Link>
        </div>
        {data.recentOrders.length === 0 ? (
          <EmptyState message="No orders yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["Order #", "Customer", "Amount", "Status", "Date"]} />
              <tbody>
                {data.recentOrders.map((o) => (
                  <tr key={o._id} className={rowCls}>
                    <AccentCell className="pl-5 font-poppins text-[11px] text-[#5c4f42]">{o.orderNumber || o._id?.slice(-8).toUpperCase()}</AccentCell>
                    <td className="px-4 py-3 text-[#1a1008]">{o.user?.name || "—"}</td>
                    <td className="px-4 py-3 font-semibold font-poppins text-[#1a1008]">{fmtCurrency(o.total)}</td>
                    <td className="px-4 py-3"><Badge status={o.status} /></td>
                    <td className="px-4 py-3 text-[#9c8a78]">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableShell>
    </>
  );
}
