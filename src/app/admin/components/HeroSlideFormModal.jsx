"use client";
import { useState, useEffect, useRef } from "react";
import { apiFetch, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Modal, Field, inputCls, PrimaryButton, SecondaryButton } from "./ui";

const emptyForm = {
  category: "VIRSA",
  chapter: "",
  title: "",
  tagline: "",
  body: "",
  footnote: "",
  ctaLabel: "",
  ctaHref: "/collections",
  isIntro: false,
  isActive: true,
};

/** Single image picker with preview + remove. */
function ImagePicker({ label, hint, existing, file, onFile, onClear }) {
  const inputRef = useRef(null);
  const preview = file ? URL.createObjectURL(file) : existing ? imgUrl(existing) : "";

  useEffect(() => {
    return () => { if (file) URL.revokeObjectURL(preview); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div>
      <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-1.5">{label}</label>
      <div className="flex items-start gap-3">
        <div
          className="w-28 h-20 rounded-lg overflow-hidden border border-[#e0d4c4] bg-[#fdfaf6] flex items-center justify-center shrink-0"
        >
          {preview
            ? <img src={preview} alt="" className="w-full h-full object-cover" />
            : <span className="text-[10px] text-[#b0a090] text-center px-2">No image</span>}
        </div>
        <div className="flex-1 min-w-0">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => onFile(e.target.files?.[0] || null)}
            className="text-[12px] text-[#5c4f42] w-full"
          />
          <p className="text-[10px] text-[#b0a090] mt-1.5 leading-relaxed">{hint}</p>
          {(preview) && (
            <button
              type="button"
              onClick={() => { onClear(); if (inputRef.current) inputRef.current.value = ""; }}
              className="text-[10px] text-red-500 hover:text-red-700 mt-1 uppercase tracking-widest"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HeroSlideFormModal({ open, onClose, slide, onSaved, showToast }) {
  const { token } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [existingImage, setExistingImage] = useState("");
  const [existingMobile, setExistingMobile] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [mobileFile, setMobileFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (slide) {
      setForm({
        category: slide.category || "",
        chapter: slide.chapter || "",
        title: slide.title || "",
        tagline: slide.tagline || "",
        body: slide.body || "",
        footnote: slide.footnote || "",
        ctaLabel: slide.ctaLabel || "",
        ctaHref: slide.ctaHref || "/",
        isIntro: !!slide.isIntro,
        isActive: slide.isActive !== false,
      });
      setExistingImage(slide.image || "");
      setExistingMobile(slide.mobileImage || "");
    } else {
      setForm(emptyForm);
      setExistingImage("");
      setExistingMobile("");
    }
    setImageFile(null);
    setMobileFile(null);
    setError("");
  }, [slide, open]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required"); return; }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));

      // Preserve / clear existing URLs when no new file is chosen
      fd.append("keepImage", imageFile ? "" : existingImage);
      fd.append("keepMobileImage", mobileFile ? "" : existingMobile);

      if (imageFile) fd.append("image", imageFile);
      if (mobileFile) fd.append("mobileImage", mobileFile);

      if (slide) {
        await apiFetch(`/hero/${slide._id}`, token, { method: "PUT", body: fd });
        showToast("Hero slide updated");
      } else {
        await apiFetch("/hero", token, { method: "POST", body: fd });
        showToast("Hero slide created");
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
    <Modal open={open} onClose={onClose} title={slide ? "Edit Hero Slide" : "Add Hero Slide"} width="max-w-3xl">
      {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">{error}</div>}
      <form onSubmit={submit} className="space-y-5">

        {/* Copy */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title (big headline)" span>
            <input className={inputCls} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Mehfil" />
          </Field>
          <Field label="Category Tag">
            <input className={inputCls} value={form.category} onChange={(e) => update("category", e.target.value)} placeholder="e.g. VIRSA" />
          </Field>
          <Field label="Chapter Eyebrow">
            <input className={inputCls} value={form.chapter} onChange={(e) => update("chapter", e.target.value)} placeholder="e.g. Chapter 01 — III" />
          </Field>
          <Field label="Tagline (italic line)" span>
            <input className={inputCls} value={form.tagline} onChange={(e) => update("tagline", e.target.value)} placeholder="Inspired by evenings that begin with conversation." />
          </Field>
          <Field label="Body Paragraph" span>
            <textarea rows={3} className={inputCls} value={form.body} onChange={(e) => update("body", e.target.value)} />
          </Field>
          <Field label="Footnote (optional — italic closing line)" span>
            <textarea rows={2} className={inputCls} value={form.footnote} onChange={(e) => update("footnote", e.target.value)} />
          </Field>
          <Field label="Button Label">
            <input className={inputCls} value={form.ctaLabel} onChange={(e) => update("ctaLabel", e.target.value)} placeholder="Discover Mehfil" />
          </Field>
          <Field label="Button Link">
            <input className={inputCls} value={form.ctaHref} onChange={(e) => update("ctaHref", e.target.value)} placeholder="/collections/mehfil" />
          </Field>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          <ImagePicker
            label="Desktop Image"
            hint="Wide landscape, ideally 1920×1080. Shown on screens ≥1024px."
            existing={existingImage}
            file={imageFile}
            onFile={setImageFile}
            onClear={() => { setImageFile(null); setExistingImage(""); }}
          />
          <ImagePicker
            label="Mobile Image"
            hint="Portrait crop, ideally 900×1200. Falls back to the desktop image if left blank."
            existing={existingMobile}
            file={mobileFile}
            onFile={setMobileFile}
            onClear={() => { setMobileFile(null); setExistingMobile(""); }}
          />
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-5 pt-1">
          <label className="flex items-center gap-2 text-[12px] text-[#5c4f42] cursor-pointer">
            <input type="checkbox" checked={form.isIntro} onChange={(e) => update("isIntro", e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
            Intro slide (larger title, outlined button, no eyebrow)
          </label>
          <label className="flex items-center gap-2 text-[12px] text-[#5c4f42] cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
            Active (visible on site)
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#ede4d8]">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>
            {saving ? "Saving…" : slide ? "Save Changes" : "Create Slide"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
