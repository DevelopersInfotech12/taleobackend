"use client";
import { useState } from "react";
import SectionEditor from "./SectionEditor.jsx";
import JsonImportModal from "./JsonImportModal.jsx";
import {
  Field, inputCls, selectCls,
  PrimaryButton, SecondaryButton,
  ErrorBanner, Spinner,
} from "./ui.jsx";
import { apiFetch, API } from "../lib/api.js";
import { useAuth } from "../lib/AdminAuthContext.jsx";

const TABS = ["Basic", "Media", "Content", "SEO", "Related", "JSON"];

const EMPTY = {
  title: "", slug: "", excerpt: "", tag: "", date: "", readTime: "5 min read",
  author: "Editorial Team", status: "draft", featured: false,
  img: "", heroImg: "", heroGradient: "linear-gradient(135deg,rgba(26,13,7,0.97) 0%,rgba(184,151,90,0.72) 100%)",
  tagStyle: { bg: "#FEF3DC", text: "#9A5C06" },
  highlights: [], tags: [],
  toc: [], meta: [], sections: [],
  sidebarCta: { title: "", body: "", btn: "" },
  ctaTitle: "", ctaBody: "",
  seo: {
    metaTitle: "", metaDescription: "", metaKeywords: [],
    ogTitle: "", ogDescription: "", ogImage: "",
    canonicalUrl: "", structuredData: "", noIndex: false,
  },
  related: [],
};

export default function BlogEditor({ blog, onSaved, onCancel }) {
  const { token } = useAuth();
  const isNew = !blog?._id;
  const [form, setForm] = useState(() => blog ? { ...EMPTY, ...blog } : { ...EMPTY });
  const [tab, setTab] = useState("Basic");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [jsonModal, setJsonModal] = useState(false);
  const [uploading, setUploading] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setNested = (parent, k, v) => setForm(f => ({ ...f, [parent]: { ...f[parent], [k]: v } }));

  // Upload helper
  const uploadImg = async (file) => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await apiFetch("/upload/image", token, { method: "POST", body: fd });
    return res.data.url;
  };

  const handleImgUpload = async (field, file) => {
    if (!file) return;
    setUploading(u => ({ ...u, [field]: true }));
    try {
      const url = await uploadImg(file);
      set(field, url);
    } catch (e) {
      setErr("Upload failed: " + e.message);
    } finally {
      setUploading(u => ({ ...u, [field]: false }));
    }
  };

  const handleSave = async () => {
    setSaving(true); setErr("");
    try {
      const payload = {
        ...form,
        highlights: typeof form.highlights === "string"
          ? form.highlights.split("\n").map(s => s.trim()).filter(Boolean)
          : form.highlights,
        tags: typeof form.tags === "string"
          ? form.tags.split(",").map(s => s.trim()).filter(Boolean)
          : form.tags,
      };
      if (isNew) {
        await apiFetch("/blogs", token, { method: "POST", body: JSON.stringify(payload) });
      } else {
        await apiFetch(`/blogs/${form._id}`, token, { method: "PUT", body: JSON.stringify(payload) });
      }
      onSaved();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleJsonImport = (data) => {
    setForm(f => ({ ...EMPTY, ...f, ...data }));
  };

  // --- Shared helpers ---
  const listField = (label, key, placeholder) => (
    <Field label={label} span>
      <textarea rows={3} value={Array.isArray(form[key]) ? form[key].join("\n") : form[key]}
        onChange={e => set(key, e.target.value)}
        placeholder={placeholder}
        className={inputCls + " resize-y text-[12px]"} />
    </Field>
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <h2 className="text-[15px] font-semibold text-[#1a1008]" style={{ fontFamily: "Georgia,serif" }}>
          {isNew ? "New Blog Post" : `Edit: ${form.title || "Untitled"}`}
        </h2>
        <div className="flex gap-2 flex-wrap">
          <SecondaryButton onClick={() => setJsonModal(true)}>Import JSON</SecondaryButton>
          <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
          <PrimaryButton onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : isNew ? "Create" : "Save Changes"}
          </PrimaryButton>
        </div>
      </div>

      <ErrorBanner message={err} />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#ede4d8] flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`text-[11px] uppercase tracking-widest px-4 py-2 border-b-2 transition-colors ${tab === t ? "border-[#c9a84c] text-[#1a1008] font-semibold" : "border-transparent text-[#9c8a78] hover:text-[#1a1008]"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Basic ── */}
      {tab === "Basic" && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title" span>
            <input value={form.title} onChange={e => set("title", e.target.value)} className={inputCls} placeholder="Blog title" />
          </Field>
          <Field label="Slug">
            <input value={form.slug} onChange={e => set("slug", e.target.value)} className={inputCls} placeholder="my-blog-slug" />
          </Field>
          <Field label="Tag / Category">
            <input value={form.tag} onChange={e => set("tag", e.target.value)} className={inputCls} placeholder="e.g. Diamond Care" />
          </Field>
          <Field label="Date">
            <input value={form.date} onChange={e => set("date", e.target.value)} className={inputCls} placeholder="e.g. June 2025" />
          </Field>
          <Field label="Read Time">
            <input value={form.readTime} onChange={e => set("readTime", e.target.value)} className={inputCls} placeholder="5 min read" />
          </Field>
          <Field label="Author">
            <input value={form.author} onChange={e => set("author", e.target.value)} className={inputCls} placeholder="Editorial Team" />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => set("status", e.target.value)} className={selectCls}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="Featured">
            <select value={form.featured ? "true" : "false"} onChange={e => set("featured", e.target.value === "true")} className={selectCls}>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </Field>
          <Field label="Excerpt" span>
            <textarea rows={3} value={form.excerpt} onChange={e => set("excerpt", e.target.value)} className={inputCls + " resize-y"} placeholder="Short summary shown in listings" />
          </Field>
          <Field label="Tag BG Colour">
            <input value={form.tagStyle?.bg || "#FEF3DC"} onChange={e => setNested("tagStyle", "bg", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Tag Text Colour">
            <input value={form.tagStyle?.text || "#9A5C06"} onChange={e => setNested("tagStyle", "text", e.target.value)} className={inputCls} />
          </Field>
          {listField("Highlights (one per line)", "highlights", "• Key point one\n• Key point two")}
          <Field label="Tags (comma separated)" span>
            <input value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags}
              onChange={e => set("tags", e.target.value)} className={inputCls} placeholder="gold, diamond, care" />
          </Field>

          {/* TOC */}
          <div className="col-span-2">
            <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-2">Table of Contents</label>
            <div className="space-y-2">
              {(form.toc || []).map((t, i) => (
                <div key={i} className="flex gap-2">
                  <input value={t.id} onChange={e => { const toc = [...form.toc]; toc[i] = { ...t, id: e.target.value }; set("toc", toc); }}
                    className={inputCls + " text-[12px]"} placeholder="id (anchor)" />
                  <input value={t.label} onChange={e => { const toc = [...form.toc]; toc[i] = { ...t, label: e.target.value }; set("toc", toc); }}
                    className={inputCls + " text-[12px]"} placeholder="Label" />
                  <button onClick={() => set("toc", form.toc.filter((_, j) => j !== i))} className="text-red-400 px-2">✕</button>
                </div>
              ))}
              <button onClick={() => set("toc", [...(form.toc || []), { id: "", label: "" }])}
                className="text-[11px] text-[#c9a84c] hover:underline">+ Add TOC item</button>
            </div>
          </div>

          {/* Meta labels */}
          <div className="col-span-2">
            <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-2">Meta Labels</label>
            <div className="space-y-2">
              {(form.meta || []).map((m, i) => (
                <div key={i} className="flex gap-2">
                  <input value={m.label} onChange={e => { const meta = [...form.meta]; meta[i] = { ...m, label: e.target.value }; set("meta", meta); }}
                    className={inputCls + " text-[12px]"} placeholder="Label" />
                  <input value={m.value} onChange={e => { const meta = [...form.meta]; meta[i] = { ...m, value: e.target.value }; set("meta", meta); }}
                    className={inputCls + " text-[12px]"} placeholder="Value" />
                  <button onClick={() => set("meta", form.meta.filter((_, j) => j !== i))} className="text-red-400 px-2">✕</button>
                </div>
              ))}
              <button onClick={() => set("meta", [...(form.meta || []), { label: "", value: "" }])}
                className="text-[11px] text-[#c9a84c] hover:underline">+ Add meta label</button>
            </div>
          </div>

          {/* CTA */}
          <Field label="CTA Title">
            <input value={form.ctaTitle || ""} onChange={e => set("ctaTitle", e.target.value)} className={inputCls} placeholder="CTA section title" />
          </Field>
          <Field label="CTA Body">
            <input value={form.ctaBody || ""} onChange={e => set("ctaBody", e.target.value)} className={inputCls} placeholder="CTA body text" />
          </Field>
          <Field label="Sidebar CTA Title">
            <input value={form.sidebarCta?.title || ""} onChange={e => setNested("sidebarCta", "title", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Sidebar CTA Button">
            <input value={form.sidebarCta?.btn || ""} onChange={e => setNested("sidebarCta", "btn", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Sidebar CTA Body" span>
            <textarea rows={2} value={form.sidebarCta?.body || ""} onChange={e => setNested("sidebarCta", "body", e.target.value)} className={inputCls + " resize-y"} />
          </Field>
        </div>
      )}

      {/* ── Media ── */}
      {tab === "Media" && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Card Image URL">
            <input value={form.img} onChange={e => set("img", e.target.value)} className={inputCls} placeholder="https://…" />
          </Field>
          <Field label="Upload Card Image">
            <input type="file" accept="image/*" onChange={e => handleImgUpload("img", e.target.files?.[0])}
              className="text-[12px] text-[#9c8a78]" />
            {uploading.img && <span className="text-[11px] text-[#c9a84c] ml-1">Uploading…</span>}
          </Field>
          {form.img && <div className="col-span-2"><img src={form.img} alt="" className="max-h-40 rounded-xl object-cover" /></div>}

          <Field label="Hero Image URL">
            <input value={form.heroImg || ""} onChange={e => set("heroImg", e.target.value)} className={inputCls} placeholder="https://…" />
          </Field>
          <Field label="Upload Hero Image">
            <input type="file" accept="image/*" onChange={e => handleImgUpload("heroImg", e.target.files?.[0])}
              className="text-[12px] text-[#9c8a78]" />
            {uploading.heroImg && <span className="text-[11px] text-[#c9a84c] ml-1">Uploading…</span>}
          </Field>
          {form.heroImg && <div className="col-span-2"><img src={form.heroImg} alt="" className="max-h-40 rounded-xl object-cover" /></div>}

          <Field label="Hero Gradient CSS" span>
            <input value={form.heroGradient || ""} onChange={e => set("heroGradient", e.target.value)} className={inputCls} />
          </Field>
        </div>
      )}

      {/* ── Content ── */}
      {tab === "Content" && (
        <SectionEditor sections={form.sections || []} onChange={v => set("sections", v)} uploadFn={uploadImg} />
      )}

      {/* ── SEO ── */}
      {tab === "SEO" && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Meta Title" span>
            <input value={form.seo?.metaTitle || ""} onChange={e => setNested("seo", "metaTitle", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Meta Description" span>
            <textarea rows={3} value={form.seo?.metaDescription || ""} onChange={e => setNested("seo", "metaDescription", e.target.value)} className={inputCls + " resize-y"} />
          </Field>
          <Field label="Meta Keywords" span>
            <input value={(form.seo?.metaKeywords || []).join(", ")}
              onChange={e => setNested("seo", "metaKeywords", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
              className={inputCls} placeholder="gold, diamond, rings" />
          </Field>
          <Field label="OG Title">
            <input value={form.seo?.ogTitle || ""} onChange={e => setNested("seo", "ogTitle", e.target.value)} className={inputCls} />
          </Field>
          <Field label="OG Image URL">
            <input value={form.seo?.ogImage || ""} onChange={e => setNested("seo", "ogImage", e.target.value)} className={inputCls} />
          </Field>
          <Field label="OG Description" span>
            <textarea rows={2} value={form.seo?.ogDescription || ""} onChange={e => setNested("seo", "ogDescription", e.target.value)} className={inputCls + " resize-y"} />
          </Field>
          <Field label="Canonical URL" span>
            <input value={form.seo?.canonicalUrl || ""} onChange={e => setNested("seo", "canonicalUrl", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Structured Data (JSON-LD)" span>
            <textarea rows={5} value={form.seo?.structuredData || ""} onChange={e => setNested("seo", "structuredData", e.target.value)} className={inputCls + " resize-y font-mono text-[11px]"} />
          </Field>
          <Field label="No Index">
            <select value={form.seo?.noIndex ? "true" : "false"} onChange={e => setNested("seo", "noIndex", e.target.value === "true")} className={selectCls}>
              <option value="false">No</option>
              <option value="true">Yes (noindex)</option>
            </select>
          </Field>
        </div>
      )}

      {/* ── Related ── */}
      {tab === "Related" && (
        <div className="space-y-3">
          {(form.related || []).map((r, i) => (
            <div key={i} className="border border-[#e0d4c4] rounded-xl p-3 grid grid-cols-2 gap-2 bg-[#fdfaf6]">
              <div className="col-span-2 flex justify-between items-center">
                <span className="text-[11px] text-[#9c8a78] uppercase tracking-widest">Related {i + 1}</span>
                <button onClick={() => set("related", form.related.filter((_, j) => j !== i))} className="text-red-400 text-[11px]">Remove</button>
              </div>
              {["title", "slug", "img", "tag", "tagBg", "tagColor", "date"].map(f => (
                <div key={f}>
                  <label className="block text-[11px] text-[#9c8a78] mb-0.5 capitalize">{f}</label>
                  <input value={r[f] || ""} onChange={e => { const rel = [...form.related]; rel[i] = { ...r, [f]: e.target.value }; set("related", rel); }}
                    className={inputCls + " text-[12px]"} />
                </div>
              ))}
            </div>
          ))}
          <button onClick={() => set("related", [...(form.related || []), { title: "", slug: "", img: "", tag: "", tagBg: "#FEF3DC", tagColor: "#9A5C06", date: "" }])}
            className="w-full text-[11px] uppercase tracking-widest text-[#c9a84c] border border-dashed border-[#e0d4c4] rounded-xl py-2 hover:bg-[#fdfaf6]">
            + Add Related Post
          </button>
        </div>
      )}

      {/* ── JSON ── */}
      {tab === "JSON" && (
        <div className="space-y-2">
          <p className="text-[12px] text-[#9c8a78]">Read-only view of current form state.</p>
          <textarea readOnly rows={20} value={JSON.stringify(form, null, 2)}
            className="w-full border border-[#e0d4c4] rounded-xl px-3 py-2 font-mono text-[11px] bg-[#fdfaf6] text-[#1a1008] resize-y focus:outline-none" />
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-[#ede4d8]">
        <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
        <PrimaryButton onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : isNew ? "Create" : "Save Changes"}
        </PrimaryButton>
      </div>

      <JsonImportModal open={jsonModal} onClose={() => setJsonModal(false)} onImport={handleJsonImport} />
    </div>
  );
}
