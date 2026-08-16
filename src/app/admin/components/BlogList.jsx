"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../lib/api.js";
import { useAuth } from "../lib/AdminAuthContext.jsx";
import {
  Badge, Spinner, EmptyState, ErrorBanner,
  ConfirmDialog, Toast, Pagination,
  PrimaryButton, SecondaryButton,
} from "./ui.jsx";

export default function BlogList({ onEdit, onNew, refresh }) {
  const { token } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setErr("");
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.set("search", search);
      if (statusFilter) params.set("status", statusFilter);
      const res = await apiFetch(`/blogs?${params}`, token);
      setBlogs(res.data || []);
      setPages(res.pagination?.pages || 1);
      setTotal(res.pagination?.total || 0);

      const s = await apiFetch("/blogs/stats", token);
      setStats(s.data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, statusFilter]);

  useEffect(() => { load(); }, [load, refresh]);

  const act = async (action, ids, label) => {
    setActing(true);
    try {
      if (action === "delete" && ids.length === 1) {
        await apiFetch(`/blogs/${ids[0]}`, token, { method: "DELETE" });
      } else if (action === "status") {
        await apiFetch(`/blogs/${ids[0]}/status`, token, { method: "PATCH" });
      } else if (action === "featured") {
        await apiFetch(`/blogs/${ids[0]}/featured`, token, { method: "PATCH" });
      } else {
        await apiFetch("/blogs/bulk", token, { method: "POST", body: JSON.stringify({ action, ids }) });
      }
      setToast({ message: label || "Done", type: "success" });
      setSelected([]);
      load();
    } catch (e) {
      setToast({ message: e.message, type: "error" });
    } finally {
      setActing(false); setConfirm(null);
    }
  };

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === blogs.length ? [] : blogs.map(b => b._id));

  return (
    <div className="space-y-4">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total",     value: stats.total },
            { label: "Published", value: stats.published },
            { label: "Drafts",    value: stats.drafts },
            { label: "Featured",  value: stats.featured },
          ].map(s => (
            <div key={s.label} className="bg-[#fdfaf6] border border-[#ede4d8] rounded-xl p-3 text-center">
              <p className="text-[22px] font-bold text-[#1a1008]">{s.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-[#9c8a78]">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search blogs…"
            className="border border-[#e0d4c4] rounded-lg px-3 py-1.5 text-[12px] text-[#1a1008] focus:outline-none focus:border-[#c9a84c] bg-[#fdfaf6] w-48" />
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-[#e0d4c4] rounded-lg px-3 py-1.5 text-[12px] text-[#1a1008] focus:outline-none focus:border-[#c9a84c] bg-[#fdfaf6]">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        <div className="flex gap-2 flex-wrap">
          {selected.length > 0 && (
            <>
              <SecondaryButton onClick={() => act("publish", selected, "Bulk published")} disabled={acting}>Publish</SecondaryButton>
              <SecondaryButton onClick={() => act("draft", selected, "Set to draft")} disabled={acting}>Draft</SecondaryButton>
              <button onClick={() => setConfirm({ ids: selected, label: `Delete ${selected.length} post(s)?` })}
                className="text-[12px] px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 uppercase tracking-widest font-medium">
                Delete ({selected.length})
              </button>
            </>
          )}
          <PrimaryButton onClick={onNew}>+ New Post</PrimaryButton>
        </div>
      </div>

      <ErrorBanner message={err} />

      {loading ? <Spinner /> : blogs.length === 0 ? <EmptyState message="No blog posts found" /> : (
        <div className="border border-[#ede4d8] rounded-2xl overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="bg-[#fdfaf6] border-b border-[#ede4d8]">
              <tr>
                <th className="px-3 py-2 text-left">
                  <input type="checkbox" checked={selected.length === blogs.length && blogs.length > 0}
                    onChange={toggleAll} className="accent-[#c9a84c]" />
                </th>
                <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-[#9c8a78]">Title</th>
                <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-[#9c8a78] hidden sm:table-cell">Tag</th>
                <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-[#9c8a78]">Status</th>
                <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-[#9c8a78] hidden md:table-cell">Featured</th>
                <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-[#9c8a78] hidden lg:table-cell">Views</th>
                <th className="px-3 py-2 text-left text-[10px] uppercase tracking-widest text-[#9c8a78]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b, i) => (
                <tr key={b._id} className={`border-b border-[#f5ede4] hover:bg-[#fdfaf6] transition-colors ${i % 2 === 0 ? "" : "bg-[#fefcf9]"}`}>
                  <td className="px-3 py-2">
                    <input type="checkbox" checked={selected.includes(b._id)} onChange={() => toggleSelect(b._id)} className="accent-[#c9a84c]" />
                  </td>
                  <td className="px-3 py-2 max-w-[200px]">
                    <p className="font-medium text-[#1a1008] truncate">{b.title}</p>
                    <p className="text-[10px] text-[#b0a090] truncate">{b.slug}</p>
                  </td>
                  <td className="px-3 py-2 hidden sm:table-cell">
                    <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: b.tagStyle?.bg || "#FEF3DC", color: b.tagStyle?.text || "#9A5C06" }}>
                      {b.tag}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => act("status", [b._id], `Status updated`)} disabled={acting}
                      className="hover:opacity-70 transition-opacity">
                      <Badge status={b.status} />
                    </button>
                  </td>
                  <td className="px-3 py-2 hidden md:table-cell">
                    <button onClick={() => act("featured", [b._id], "Featured updated")} disabled={acting}
                      className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${b.featured ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-gray-50 text-gray-400 border-gray-200"}`}>
                      {b.featured ? "★ Yes" : "No"}
                    </button>
                  </td>
                  <td className="px-3 py-2 hidden lg:table-cell text-[#9c8a78]">{b.views ?? 0}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <button onClick={() => onEdit(b)} className="text-[11px] px-2 py-1 rounded border border-[#e0d4c4] text-[#5c4f42] hover:bg-[#fdfaf6]">Edit</button>
                      <button onClick={() => setConfirm({ ids: [b._id], label: `Delete "${b.title}"?` })}
                        className="text-[11px] px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50">Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} pages={pages} total={total} onChange={setPage} />
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title="Confirm Delete"
        message={confirm?.label}
        confirmLabel="Delete"
        loading={acting}
        onConfirm={() => act("delete", confirm.ids, "Deleted")}
        onCancel={() => setConfirm(null)}
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
