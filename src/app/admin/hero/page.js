"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Toast, ConfirmDialog,
  PageHeader, HeaderButton, StatStrip,
  TableShell, Thead, rowCls, AccentCell, editBtnCls, delBtnCls,
} from "../components/ui";
import HeroSlideFormModal from "../components/HeroSlideFormModal";

export default function HeroPage() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchItems = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/hero?includeInactive=true", token);
      setItems(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (s) => { setEditing(s); setModalOpen(true); };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/hero/${deleteTarget._id}`, token, { method: "DELETE" });
      showToast("Hero slide deleted");
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (s) => {
    try {
      const fd = new FormData();
      fd.append("isActive", String(!s.isActive));
      await apiFetch(`/hero/${s._id}`, token, { method: "PUT", body: fd });
      setItems((list) => list.map((x) => (x._id === s._id ? { ...x, isActive: !s.isActive } : x)));
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const move = async (index, dir) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    setReordering(true);
    try {
      await apiFetch("/hero/reorder", token, {
        method: "PUT",
        body: JSON.stringify({ order: next.map((s) => s._id) }),
      });
    } catch (err) {
      showToast(err.message, "error");
      fetchItems();
    } finally {
      setReordering(false);
    }
  };

  const activeCount = items.filter((s) => s.isActive).length;

  return (
    <>
      <PageHeader
        eyebrow="Homepage"
        title="Hero Section"
        action={<HeaderButton onClick={openCreate}>+ Add Slide</HeaderButton>}
      />

      <StatStrip stats={[
        { label: "Slides", value: items.length },
        { label: "Live", value: activeCount },
        { label: "Hidden", value: items.length - activeCount },
      ]} />

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : items.length === 0 ? (
          <EmptyState message="No hero slides yet — add one. Until then the homepage shows its built-in default slides." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["Order", "Preview", "Slide", "Button", "Status", "Actions"]} />
              <tbody>
                {items.map((s, i) => (
                  <tr key={s._id} className={rowCls}>
                    <AccentCell className="pl-5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => move(i, -1)}
                          disabled={i === 0 || reordering}
                          className="text-[#c9a84c] hover:text-[#8b6914] disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >▲</button>
                        <button
                          onClick={() => move(i, 1)}
                          disabled={i === items.length - 1 || reordering}
                          className="text-[#c9a84c] hover:text-[#8b6914] disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >▼</button>
                      </div>
                    </AccentCell>

                    <td className="px-4 py-3">
                      <div className="w-20 h-14 rounded-md overflow-hidden border border-[#ede4d8] bg-[#1a0c06] flex items-center justify-center">
                        {s.image
                          ? <img src={imgUrl(s.image)} alt="" className="w-full h-full object-cover" />
                          : <span className="text-[9px] text-[#c9a84c]/60">none</span>}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-semibold text-[13px] text-[#1a1008]">
                        {s.title}
                        {s.isIntro && <span className="ml-2 text-[9px] uppercase tracking-widest text-[#c9a84c]">intro</span>}
                      </p>
                      {s.chapter && <p className="text-[11px] text-[#9c8a78] mt-0.5">{s.chapter}</p>}
                      {s.tagline && <p className="text-[11px] text-[#706152] italic mt-0.5 max-w-[320px] truncate">{s.tagline}</p>}
                    </td>

                    <td className="px-4 py-3">
                      {s.ctaLabel
                        ? <span className="text-[11px] text-[#5c4f42]">{s.ctaLabel}<br /><span className="text-[10px] text-[#b0a090]">{s.ctaHref}</span></span>
                        : <span className="text-[11px] text-[#b0a090]">—</span>}
                    </td>

                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(s)}>
                        <Badge status={s.isActive ? "active" : "inactive"} label={s.isActive ? "Live" : "Hidden"} />
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(s)} className={editBtnCls}>Edit</button>
                        <button onClick={() => setDeleteTarget(s)} className={delBtnCls}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableShell>

      <HeroSlideFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        slide={editing}
        onSaved={fetchItems}
        showToast={showToast}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete hero slide?"
        message={`"${deleteTarget?.title}" will be removed from the homepage hero.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
