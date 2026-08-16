"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch, fmtCurrency, fmtDate } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Pagination, Toast,
  PageHeader, StatStrip, FilterBar, filterInputCls, filterSelectCls, FilterLabel, ResetButton,
  TableShell, Thead, rowCls, AccentCell, editBtnCls,
} from "../components/ui";
import CustomerDetailModal from "../components/CustomerDetailModal";

export default function CustomersPage() {
  const { token } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchCustomers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10", sort });
      if (search) params.set("search", search);
      const res = await apiFetch(`/users/customers?${params.toString()}`, token);
      setCustomers(res.data.customers || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, sort]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const resetFilters = () => { setSearchInput(""); setSearch(""); setSort("newest"); setPage(1); };

  const initials = (name) => (name || "").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  const withOrders = customers.filter(c => c.orderCount > 0).length;
  const totalRevenue = customers.reduce((s, c) => s + (c.totalSpent || 0), 0);

  return (
    <>
      <PageHeader eyebrow="Customer Management" title="Customers" />

      <StatStrip stats={[
        { label: "Total", value: total },
        { label: "This Page", value: customers.length },
        { label: "With Orders", value: withOrders },
        { label: "Revenue (Page)", value: fmtCurrency(totalRevenue) },
      ]} />

      <FilterBar>
        <div className="flex-1 min-w-[160px]">
          <FilterLabel>Search</FilterLabel>
          <input className={filterInputCls} placeholder="Name, email or phone…" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
        <div>
          <FilterLabel>Sort</FilterLabel>
          <select className={filterSelectCls + " min-w-[160px]"} value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="spent-desc">Total Spent: High to Low</option>
            <option value="orders-desc">Most Orders</option>
          </select>
        </div>
        <ResetButton onClick={resetFilters} />
      </FilterBar>

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : customers.length === 0 ? <EmptyState message="No customers found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["Customer", "Phone", "Orders", "Total Spent", "Last Order", "Joined", "Status", ""]} />
              <tbody>
                {customers.map((c) => (
                  <tr key={c._id} className={rowCls}>
                    <AccentCell className="pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#e8d5b0] text-[#8b6914] flex items-center justify-center text-[11px] font-semibold flex-shrink-0">
                          {initials(c.name)}
                        </div>
                        <div>
                          <p className="text-[#1a1008] font-semibold text-[12.5px]">{c.name}</p>
                          <p className="text-[10px] text-[#9c8a78]">{c.email}</p>
                        </div>
                      </div>
                    </AccentCell>
                    <td className="px-4 py-3 text-[#5c4f42]">{c.phone || "—"}</td>
                    <td className="px-4 py-3 text-[#5c4f42]">{c.orderCount}</td>
                    <td className="px-4 py-3 font-semibold text-[#1a1008]">{fmtCurrency(c.totalSpent)}</td>
                    <td className="px-4 py-3 text-[#9c8a78]">{c.lastOrderAt ? fmtDate(c.lastOrderAt) : "—"}</td>
                    <td className="px-4 py-3 text-[#9c8a78]">{fmtDate(c.createdAt)}</td>
                    <td className="px-4 py-3"><Badge status={c.isActive ? "active" : "inactive"} label={c.isActive ? "Active" : "Inactive"} /></td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedCustomer(c._id)} className={editBtnCls}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pages={pages} total={total} onChange={setPage} />
      </TableShell>

      <CustomerDetailModal
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
        customerId={selectedCustomer}
        showToast={showToast}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
