"use client";
import { useState, useEffect } from "react";
import { apiFetch, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Modal, Field, inputCls, selectCls, PrimaryButton, SecondaryButton } from "./ui";

const emptyForm = { name: "", slug: "", description: "", collection: "", sortOrder: 0, isActive: true };

export default function CategoryFormModal({ open, onClose, category, categories, collections = [], onSaved, showToast }) {
  const { token } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        collection: category.collection?._id || category.collection || "",
        sortOrder: category.sortOrder ?? 0,
        isActive: category.isActive !== false,
      });
    } else {
      setForm(emptyForm);
    }
    setFile(null);
    setError("");
  }, [category, open]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.slug) fd.append("slug", form.slug);
      fd.append("description", form.description);
      fd.append("collection", form.collection || "");
      fd.append("sortOrder", form.sortOrder);
      fd.append("isActive", form.isActive);
      if (file) fd.append("image", file);

      if (category) {
        await apiFetch(`/categories/${category._id}`, token, { method: "PUT", body: fd });
        showToast("Category updated");
      } else {
        await apiFetch("/categories", token, { method: "POST", body: fd });
        showToast("Category created");
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={category ? "Edit Category" : "Add Category"} width="max-w-lg">
      {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <Field label="Name">
          <input required className={inputCls} value={form.name} onChange={e => update("name", e.target.value)} />
        </Field>
        <Field label="Slug (optional)">
          <input className={inputCls} value={form.slug} onChange={e => update("slug", e.target.value)} placeholder="auto-generated" />
        </Field>
        <Field label="Description">
          <textarea rows={2} className={inputCls} value={form.description} onChange={e => update("description", e.target.value)} />
        </Field>
        <Field label="Collection (parent group)">
          <select className={selectCls} value={form.collection} onChange={e => update("collection", e.target.value)}>
            <option value="">None</option>
            {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Sort Order">
            <input type="number" className={inputCls} value={form.sortOrder} onChange={e => update("sortOrder", e.target.value)} />
          </Field>
          <Field label="Status">
            <label className="flex items-center gap-2 text-[12px] text-[#5c4f42] cursor-pointer mt-2.5">
              <input type="checkbox" checked={form.isActive} onChange={e => update("isActive", e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
              Active
            </label>
          </Field>
        </div>
        <Field label="Image">
          {category?.image && !file && <img src={imgUrl(category.image)} alt="" className="w-16 h-16 object-cover rounded border border-[#ede4d8] mb-2" />}
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="text-[12px] text-[#5c4f42]" />
        </Field>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#ede4d8]">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : (category ? "Save Changes" : "Create Category")}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
