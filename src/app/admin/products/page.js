"use client";
import { useState, useEffect, useCallback } from "react";
import { apiFetch, fmtCurrency, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import {
  Spinner, ErrorBanner, EmptyState, Badge, Pagination, Toast, ConfirmDialog,
  PageHeader, HeaderButton, StatStrip, FilterBar, filterInputCls, filterSelectCls, FilterLabel, ResetButton,
  TableShell, Thead, rowCls, AccentCell, editBtnCls, delBtnCls,
} from "../components/ui";
import ProductFormModal from "../components/ProductFormModal";

export default function ProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // filters
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [flag, setFlag] = useState("");
  const [sort, setSort] = useState("newest");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          apiFetch("/categories?includeInactive=true", token),
          apiFetch("/collections?includeInactive=true", token),
        ]);
        setCategories(catRes.data || []);
        setCollections(colRes.data || []);
      } catch { /* non-fatal */ }
    })();
  }, [token]);

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "10", sort });
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (status) params.set("isActive", status === "active" ? "true" : "false");
      if (flag === "featured") params.set("isFeatured", "true");
      if (flag === "new") params.set("isNewArrival", "true");
      if (flag === "bestseller") params.set("isBestseller", "true");
      if (flag === "low" || flag === "out") params.set("stock", flag);

      const res = await apiFetch(`/products/admin?${params.toString()}`, token);
      setProducts(res.data.products || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, page, search, category, status, flag, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const resetFilters = () => {
    setSearchInput(""); setSearch(""); setCategory(""); setStatus(""); setFlag(""); setSort("newest"); setPage(1);
  };

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p) => { setEditing(p); setModalOpen(true); };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/products/${deleteTarget._id}`, token, { method: "DELETE" });
      showToast("Product permanently deleted");
      setProducts((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      setTotal((prev) => Math.max(0, prev - 1));
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  return (
    <>
      <PageHeader
        eyebrow="Catalog Management"
        title="Products"
        action={<HeaderButton onClick={openCreate}>+ Add Product</HeaderButton>}
      />

      <StatStrip stats={[
        { label: "Total", value: total },
        { label: "This Page", value: products.length },
        { label: "Low Stock", value: lowStock },
        { label: "Out of Stock", value: outOfStock },
      ]} />

      <FilterBar>
        <div className="flex-1 min-w-[160px]">
          <FilterLabel>Search</FilterLabel>
          <input className={filterInputCls} placeholder="Name or SKU…" value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        </div>
        <div>
          <FilterLabel>Category</FilterLabel>
          <select className={filterSelectCls + " min-w-[150px] pr-8"} value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <FilterLabel>Status</FilterLabel>
          <select className={filterSelectCls + " min-w-[130px] pr-8"} value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <FilterLabel>Tag / Stock</FilterLabel>
          <select className={filterSelectCls + " min-w-[150px] pr-8"} value={flag} onChange={e => { setFlag(e.target.value); setPage(1); }}>
            <option value="">All</option>
            <option value="featured">Featured</option>
            <option value="new">New Arrival</option>
            <option value="bestseller">Bestseller</option>
            <option value="low">Low Stock (&lt;10)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
        <div>
          <FilterLabel>Sort</FilterLabel>
          <select className={filterSelectCls + " min-w-[160px] pr-8"} value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="stock-asc">Stock: Low to High</option>
            <option value="stock-desc">Stock: High to Low</option>
            <option value="popular">Most Sold</option>
          </select>
        </div>
        <ResetButton onClick={resetFilters} />
      </FilterBar>

      <ErrorBanner message={error} />

      <TableShell>
        {loading ? <Spinner /> : products.length === 0 ? <EmptyState message="No products found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <Thead headers={["Product", "Category", "Price", "Stock", "Tags", "Status", "Actions"]} />
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className={rowCls}>
                    <AccentCell className="pl-5">
                      <div className="flex items-center gap-3">
                        {p.images?.[0] ? <img src={imgUrl(p.images[0])} alt="" className="w-10 h-10 rounded object-cover border border-[#ede4d8]" /> : <div className="w-10 h-10 rounded bg-[#f0e8dc]" />}
                        <div className="min-w-0">
                          <p className="text-[#706152] font-[650] max-w-[180px] text-[12.5px]">{p.name}</p>
                          <p className="text-[10px] text-[#9c8a78]">{p.sku || "—"}</p>
                        </div>
                      </div>
                    </AccentCell>
                    <td className="px-4 py-3 text-[#5c4f42]">{p.category?.name || "—"}</td>
                    <td className="px-4 py-3 text-[#1a1008] font-medium font-poppins">
                      {fmtCurrency(p.price)}
                      {p.comparePrice > p.price && <span className="block text-[10px] text-[#b0a090] line-through">{fmtCurrency(p.comparePrice)}</span>}
                    </td>
                    <td className="px-4 py-3 font-poppins">
                      <span className={p.stock === 0 ? "text-red-600 font-medium" : p.stock < 10 ? "text-amber-600 font-medium" : "text-[#5c4f42]"}>{p.stock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.isFeatured && <Badge status="active" label="Featured" />}
                        {p.isNewArrival && <Badge status="confirmed" label="New" />}
                        {p.isBestseller && <Badge status="pending" label="Bestseller" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={p.isActive ? "active" : "inactive"} label={p.isActive ? "Active" : "Inactive"} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button onClick={() => openEdit(p)} className={editBtnCls}>Edit</button>
                        <button onClick={() => setDeleteTarget(p)} className={delBtnCls}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pages={pages} total={total} onChange={setPage} />
      </TableShell>

      <ProductFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editing}
        categories={categories}
        collections={collections}
        onSaved={fetchProducts}
        showToast={showToast}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product?"
        message={`"${deleteTarget?.name}" will be permanently deleted. This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}