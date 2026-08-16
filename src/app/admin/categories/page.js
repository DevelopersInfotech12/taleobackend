"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { apiFetch, imgUrl, fmtDate } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Toast, ConfirmDialog,
  PageHeader, HeaderButton, StatStrip, FilterBar, filterInputCls, filterSelectCls, FilterLabel, ResetButton,
  TableShell, Thead, rowCls, AccentCell, editBtnCls, delBtnCls,
} from "../components/ui";
import CategoryFormModal from "../components/CategoryFormModal";

export default function CategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  const fetchCategories = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/categories?includeInactive=true", token);
      setCategories(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchCollections = useCallback(async () => {
    if (!token) return;
    try {
      const res = await apiFetch("/collections?includeInactive=true", token);
      setCollections(res.data || []);
    } catch { /* ignore */ }
  }, [token]);

  useEffect(() => { fetchCategories(); fetchCollections(); }, [fetchCategories, fetchCollections]);

  const filtered = useMemo(() => {
    return categories.filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.slug.toLowerCase().includes(search.toLowerCase())) return false;
      if (status === "active" && !c.isActive) return false;
      if (status === "inactive" && c.isActive) return false;
      if (collectionFilter && (c.collection?._id || c.collection) !== collectionFilter) return false;
      return true;
    });
  }, [categories, search, status, collectionFilter]);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (c) => { setEditing(c); setModalOpen(true); };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/categories/${deleteTarget._id}`, token, { method: "DELETE" });
      showToast("Category deleted");
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const resetFilters = () => { setSearch(""); setStatus(""); setCollectionFilter(""); };

  const active = categories.filter(c => c.isActive).length;
  const inactive = categories.length - active;

  return (
    <>
      <PageHeader
        eyebrow="Catalog Management"
        title="Categories"
        action={<HeaderButton onClick={openCreate}>+ Add Category</HeaderButton>}
      />

      <StatStrip stats={[
        { label: "Total", value: categories.length },
        { label: "Active", value: active },
        { label: "Inactive", value: inactive },
        { label: "Showing", value: filtered.length },
      ]} />

      <FilterBar>
        <div className="flex-1 min-w-[160px]">
          <FilterLabel>Search</FilterLabel>
          <input className={filterInputCls} placeholder="Name or slug…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div>
          <FilterLabel>Status</FilterLabel>
          <select className={filterSelectCls + " min-w-[130px]"} value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <FilterLabel>Collection</FilterLabel>
          <select className={filterSelectCls + " min-w-[150px]"} value={collectionFilter} onChange={e => setCollectionFilter(e.target.value)}>
            <option value="">All</option>
            {collections.map(col => <option key={col._id} value={col._id}>{col.name}</option>)}
          </select>
        </div>
        <ResetButton onClick={resetFilters} />
      </FilterBar>

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : filtered.length === 0 ? <EmptyState message="No categories found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["Category", "Slug", "Collection", "Sort", "Status", "Created", "Actions"]} />
              <tbody>
                {filtered.map((c) => (
                  <tr key={c._id} className={rowCls}>
                    <AccentCell className="pl-5">
                      <div className="flex items-center gap-3">
                        {c.image ? <img src={imgUrl(c.image)} alt="" className="w-10 h-10 rounded object-cover border border-[#ede4d8]" /> : <div className="w-10 h-10 rounded bg-[#f0e8dc]" />}
                        <p className="text-[#1a1008] font-semibold text-[12.5px]">{c.name}</p>
                      </div>
                    </AccentCell>
                    <td className="px-4 py-3 font-mono text-[11px] text-[#9c8a78]">{c.slug}</td>
                    <td className="px-4 py-3">{c.collection?.name ? <Badge status="active" label={c.collection.name} /> : <span className="text-[#9c8a78]">—</span>}</td>
                    <td className="px-4 py-3 text-[#5c4f42]">{c.sortOrder}</td>
                    <td className="px-4 py-3"><Badge status={c.isActive ? "active" : "inactive"} label={c.isActive ? "Active" : "Inactive"} /></td>
                    <td className="px-4 py-3 text-[#9c8a78]">{fmtDate(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(c)} className={editBtnCls}>Edit</button>
                        <button onClick={() => setDeleteTarget(c)} className={delBtnCls}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableShell>

      <CategoryFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        category={editing}
        categories={categories}
        collections={collections}
        onSaved={fetchCategories}
        showToast={showToast}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete category?"
        message={`"${deleteTarget?.name}" will be permanently deleted. Products in this category will keep their reference.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
