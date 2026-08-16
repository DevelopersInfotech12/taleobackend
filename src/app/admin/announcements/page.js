"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Toast, ConfirmDialog,
  PageHeader, HeaderButton, StatStrip,
  TableShell, Thead, rowCls, AccentCell, editBtnCls, delBtnCls,
} from "../components/ui";
import AnnouncementFormModal from "../components/AnnouncementFormModal";

export default function AnnouncementsPage() {
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
      const res = await apiFetch("/announcements?includeInactive=true", token);
      setItems(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (a) => { setEditing(a); setModalOpen(true); };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/announcements/${deleteTarget._id}`, token, { method: "DELETE" });
      showToast("Offer deleted");
      setDeleteTarget(null);
      fetchItems();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const toggleActive = async (a) => {
    try {
      await apiFetch(`/announcements/${a._id}`, token, { method: "PUT", body: JSON.stringify({ isActive: !a.isActive }) });
      setItems(list => list.map(x => x._id === a._id ? { ...x, isActive: !a.isActive } : x));
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
      await apiFetch("/announcements/reorder", token, {
        method: "PUT",
        body: JSON.stringify({ order: next.map(a => a._id) }),
      });
    } catch (err) {
      showToast(err.message, "error");
      fetchItems();
    } finally {
      setReordering(false);
    }
  };

  const activeCount = items.filter(a => a.isActive).length;

  return (
    <>
      <PageHeader
        eyebrow="Marketing"
        title="Offer Strip"
        action={<HeaderButton onClick={openCreate}>+ Add Offer</HeaderButton>}
      />

      <StatStrip stats={[
        { label: "Total", value: items.length },
        { label: "Active", value: activeCount },
        { label: "Hidden", value: items.length - activeCount },
      ]} />

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : items.length === 0 ? <EmptyState message="No offers yet — add one to populate the top scrolling strip" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["Order", "Offer Text", "Status", "Actions"]} />
              <tbody>
                {items.map((a, i) => (
                  <tr key={a._id} className={rowCls}>
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
                    <td style={{color: "#706152"}} className="px-4 font-bold py-3 text">✦ {a.text}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(a)}>
                        <Badge status={a.isActive ? "active" : "inactive"} label={a.isActive ? "Active" : "Hidden"} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(a)} className={editBtnCls}>Edit</button>
                        <button onClick={() => setDeleteTarget(a)} className={delBtnCls}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableShell>

      <AnnouncementFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        announcement={editing}
        onSaved={fetchItems}
        showToast={showToast}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete offer?"
        message={`"${deleteTarget?.text}" will be removed from the offer strip.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
