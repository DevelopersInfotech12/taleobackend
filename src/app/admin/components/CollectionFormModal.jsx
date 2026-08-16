"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Modal, Field, inputCls, PrimaryButton, SecondaryButton } from "./ui";

const emptyForm = { name: "", slug: "", description: "", tags: "", sortOrder: 0, isFeatured: false, isActive: true };

export default function CollectionFormModal({ open, onClose, collection, onSaved, showToast }) {
  const { token } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (collection) {
      setForm({
        name: collection.name || "",
        slug: collection.slug || "",
        description: collection.description || "",
        tags: (collection.tags || []).join(", "),
        sortOrder: collection.sortOrder ?? 0,
        isFeatured: !!collection.isFeatured,
        isActive: collection.isActive !== false,
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [collection, open]);

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
      const tagsArr = form.tags.split(",").map(t => t.trim()).filter(Boolean);
      tagsArr.forEach(t => fd.append("tags", t));
      fd.append("sortOrder", form.sortOrder);
      fd.append("isFeatured", form.isFeatured);
      fd.append("isActive", form.isActive);

      if (collection) {
        await apiFetch(`/collections/${collection._id}`, token, { method: "PUT", body: fd });
        showToast("Collection updated");
      } else {
        await apiFetch("/collections", token, { method: "POST", body: fd });
        showToast("Collection created");
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
    <Modal open={open} onClose={onClose} title={collection ? "Edit Collection" : "Add Collection"} width="max-w-lg">
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
        <Field label="Tags (comma separated)">
          <input className={inputCls} value={form.tags} onChange={e => update("tags", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Featured">
            <label className="flex items-center gap-2 text-[12px] text-[#5c4f42] cursor-pointer mt-2.5">
              <input type="checkbox" checked={form.isFeatured} onChange={e => update("isFeatured", e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
              Featured
            </label>
          </Field>
          <Field label="Status">
            <label className="flex items-center gap-2 text-[12px] text-[#5c4f42] cursor-pointer mt-2.5">
              <input type="checkbox" checked={form.isActive} onChange={e => update("isActive", e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
              Active
            </label>
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#ede4d8]">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : (collection ? "Save Changes" : "Create Collection")}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
