"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { apiFetch, fmtCurrency, fmtDate } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Toast, ConfirmDialog,
  PageHeader, HeaderButton, StatStrip, FilterBar, filterInputCls, filterSelectCls, FilterLabel, ResetButton,
  TableShell, Thead, rowCls, AccentCell, editBtnCls, delBtnCls,
} from "../components/ui";
import CouponFormModal from "../components/CouponFormModal";

export default function CouponsPage() {
  const { token } = useAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchCoupons = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/coupons", token);
      setCoupons(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const isExpired = (c) => c.expiresAt && new Date(c.expiresAt) < new Date();

  const filtered = useMemo(() => {
    return coupons.filter(c => {
      if (search && !c.code.toLowerCase().includes(search.toLowerCase())) return false;
      if (type && c.discountType !== type) return false;
      if (status === "active" && !(c.isActive && !isExpired(c))) return false;
      if (status === "inactive" && (c.isActive && !isExpired(c))) return false;
      if (status === "expired" && !isExpired(c)) return false;
      return true;
    });
  }, [coupons, search, type, status]);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setModalOpen(true); };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/coupons/${deleteTarget._id}`, token, { method: "DELETE" });
      showToast("Coupon deleted");
      setDeleteTarget(null);
      fetchCoupons();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const resetFilters = () => { setSearch(""); setType(""); setStatus(""); };

  const statusOf = (c) => {
    if (isExpired(c)) return { key: "expired", label: "Expired" };
    return { key: c.isActive ? "active" : "inactive", label: c.isActive ? "Active" : "Inactive" };
  };

  const activeCount = coupons.filter(c => c.isActive && !isExpired(c)).length;
  const expiredCount = coupons.filter(c => isExpired(c)).length;

  return (
    <>
      <PageHeader
        eyebrow="Marketing"
        title="Coupons"
        action={<HeaderButton onClick={openCreate}>+ Add Coupon</HeaderButton>}
      />

      <StatStrip stats={[
        { label: "Total", value: coupons.length },
        { label: "Active", value: activeCount },
        { label: "Expired", value: expiredCount },
        { label: "Showing", value: filtered.length },
      ]} />

      <FilterBar>
        <div className="flex-1 min-w-[160px]">
          <FilterLabel>Search</FilterLabel>
          <input className={filterInputCls} placeholder="Code…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div>
          <FilterLabel>Type</FilterLabel>
          <select className={filterSelectCls + " min-w-[130px]"} value={type} onChange={e => setType(e.target.value)}>
            <option value="">All</option>
            <option value="percent">Percent</option>
            <option value="flat">Flat</option>
          </select>
        </div>
        <div>
          <FilterLabel>Status</FilterLabel>
          <select className={filterSelectCls + " min-w-[130px]"} value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>
        <ResetButton onClick={resetFilters} />
      </FilterBar>

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : filtered.length === 0 ? <EmptyState message="No coupons found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["Code", "Type", "Value", "Min Order", "Used / Limit", "Expires", "Status", "Actions"]} />
              <tbody>
                {filtered.map((c) => {
                  const st = statusOf(c);
                  return (
                    <tr key={c._id} className={rowCls}>
                      <AccentCell className="pl-5">
                        <span className="font-poppins text-[11px] bg-[#f0e8dc] text-[#8b6914] px-2 py-1 rounded font-medium">{c.code}</span>
                        {c.description && <p className="text-[10px] text-[#9c8a78] mt-1">{c.description}</p>}
                      </AccentCell>
                      <td className="px-4 py-3"><Badge status={c.discountType} label={c.discountType === "percent" ? "Percent" : "Flat"} /></td>
                      <td className="px-4 py-3 font-medium text-[#1a1008]">{c.discountType === "percent" ? `${c.discountValue}%` : fmtCurrency(c.discountValue)}</td>
                      <td className="px-4 py-3 text-[#5c4f42]">{c.minOrderValue ? fmtCurrency(c.minOrderValue) : "—"}</td>
                      <td className="px-4 py-3 text-[#5c4f42]">{c.usedCount || 0} / {c.usageLimit || "∞"}</td>
                      <td className="px-4 py-3 text-[#9c8a78]">{c.expiresAt ? fmtDate(c.expiresAt) : "Never"}</td>
                      <td className="px-4 py-3"><Badge status={st.key} label={st.label} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button onClick={() => openEdit(c)} className={editBtnCls}>Edit</button>
                          <button onClick={() => setDeleteTarget(c)} className={delBtnCls}>Del</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </TableShell>

      <CouponFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        coupon={editing}
        onSaved={fetchCoupons}
        showToast={showToast}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete coupon?"
        message={`"${deleteTarget?.code}" will be permanently deleted.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
