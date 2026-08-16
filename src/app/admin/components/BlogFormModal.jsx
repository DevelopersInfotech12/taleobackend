"use client";
import { useState, useEffect } from "react";
import { apiFetch, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Modal, Field, inputCls, selectCls, PrimaryButton, SecondaryButton } from "./ui";

const emptyForm = {
  title: "", slug: "", excerpt: "", content: "", category: "General",
  tags: "", metaTitle: "", metaDesc: "", isPublished: false,
};

const CATEGORIES = ["General", "Jewellery Care", "Style Guide", "Behind the Brand"];

export default function BlogFormModal({ open, onClose, blog, onSaved, showToast }) {
  const { token } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (blog) {
      setForm({
        title: blog.title || "",
        slug: blog.slug || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        category: blog.category || "General",
        tags: (blog.tags || []).join(", "),
        metaTitle: blog.metaTitle || "",
        metaDesc: blog.metaDesc || "",
        isPublished: !!blog.isPublished,
      });
    } else {
      setForm(emptyForm);
    }
    setCoverFile(null);
    setError("");
  }, [blog, open]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      if (form.slug) fd.append("slug", form.slug);
      fd.append("excerpt", form.excerpt);
      fd.append("content", form.content);
      fd.append("category", form.category);
      fd.append("metaTitle", form.metaTitle);
      fd.append("metaDesc", form.metaDesc);
      fd.append("isPublished", form.isPublished);
      const tagsArr = form.tags.split(",").map(t => t.trim()).filter(Boolean);
      tagsArr.forEach(t => fd.append("tags", t));
      if (coverFile) fd.append("coverImage", coverFile);

      if (blog) {
        await apiFetch(`/blogs/${blog._id}`, token, { method: "PUT", body: fd });
        showToast("Post updated");
      } else {
        await apiFetch("/blogs", token, { method: "POST", body: fd });
        showToast("Post created");
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
    <Modal open={open} onClose={onClose} title={blog ? "Edit Post" : "Add Post"} width="max-w-2xl">
      {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title" span>
            <input required className={inputCls} value={form.title} onChange={e => update("title", e.target.value)} />
          </Field>
          <Field label="Slug (optional)">
            <input className={inputCls} value={form.slug} onChange={e => update("slug", e.target.value)} placeholder="auto-generated" />
          </Field>
          <Field label="Category">
            <select className={selectCls} value={form.category} onChange={e => update("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Tags (comma separated)" span>
            <input className={inputCls} value={form.tags} onChange={e => update("tags", e.target.value)} placeholder="gold, care, tips" />
          </Field>
          <Field label="Excerpt" span>
            <textarea rows={2} className={inputCls} value={form.excerpt} onChange={e => update("excerpt", e.target.value)} placeholder="Short summary shown in listings" />
          </Field>
          <Field label="Content (HTML)" span>
            <textarea required rows={6} className={inputCls + " font-mono text-[12px]"} value={form.content} onChange={e => update("content", e.target.value)} placeholder="<p>Full blog content…</p>" />
          </Field>
          <Field label="Meta Title">
            <input className={inputCls} value={form.metaTitle} onChange={e => update("metaTitle", e.target.value)} />
          </Field>
          <Field label="Meta Description">
            <input className={inputCls} value={form.metaDesc} onChange={e => update("metaDesc", e.target.value)} />
          </Field>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-2">Cover Image</label>
          {blog?.coverImage && !coverFile && (
            <img src={imgUrl(blog.coverImage)} alt="" className="w-24 h-24 object-cover rounded border border-[#ede4d8] mb-2" />
          )}
          <input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="text-[12px] text-[#5c4f42]" />
        </div>

        <label className="flex items-center gap-2 text-[12px] text-[#5c4f42] cursor-pointer">
          <input type="checkbox" checked={form.isPublished} onChange={e => update("isPublished", e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
          Published
        </label>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#ede4d8]">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : (blog ? "Save Changes" : "Create Post")}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
