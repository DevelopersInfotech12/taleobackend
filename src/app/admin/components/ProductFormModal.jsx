"use client";
import { useState, useEffect } from "react";
import { apiFetch, imgUrl } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Modal, Field, inputCls, selectCls, PrimaryButton, SecondaryButton } from "./ui";

const GEMSTONES    = ["Diamond","Ruby","Emerald","Sapphire","Pearl","Amethyst","Moissanite","No Stone"];
const METALS       = ["Yellow Gold","White Gold","Rose Gold","Platinum","Silver 925","Two-Tone"];
const STONE_COLORS = ["White","Yellow","Pink","Blue","Green","Red","Purple","Black"];

const emptyForm = {
  name: "", slug: "", shortDesc: "", description: "",
  price: "", comparePrice: "", stock: "", sku: "", material: "",
  category: "", collections: [], tags: "",
  gemstone: "", metal: "", stoneColor: "",
  isFeatured: false, isNewArrival: false, isBestseller: false, isActive: true,
  variants: [],
};

export default function ProductFormModal({ open, onClose, product, categories, collections, onSaved, showToast }) {
  const { token } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        slug: product.slug || "",
        shortDesc: product.shortDesc || "",
        description: product.description || "",
        price: product.price ?? "",
        comparePrice: product.comparePrice ?? "",
        stock: product.stock ?? "",
        sku: product.sku || "",
        material: product.material || "",
        category: product.category?._id || product.category || "",
        collections: (product.collections || []).map(c => c?._id || c),
        tags: (product.tags || []).filter(t => !GEMSTONES.includes(t) && !METALS.includes(t) && !STONE_COLORS.includes(t)).join(", "),
        gemstone: (product.tags || []).find(t => GEMSTONES.includes(t)) || "",
        metal: (product.tags || []).find(t => METALS.includes(t)) || "",
        stoneColor: (product.tags || []).find(t => STONE_COLORS.includes(t)) || "",
        isFeatured: !!product.isFeatured,
        isNewArrival: !!product.isNewArrival,
        isBestseller: !!product.isBestseller,
        isActive: product.isActive !== false,
        variants: (product.variants || []).map(v => ({ _id: v._id, label: v.label || "", price: v.price ?? "", stock: v.stock ?? 0 })),
      });
      setExistingImages(product.images || []);
    } else {
      setForm(emptyForm);
      setExistingImages([]);
    }
    setNewFiles([]);
    setError("");
  }, [product, open]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleCollection = (id) => {
    setForm(f => ({
      ...f,
      collections: f.collections.includes(id) ? f.collections.filter(c => c !== id) : [...f.collections, id],
    }));
  };

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { label: "", price: "", stock: 0 }] }));
  const removeVariant = (idx) => setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }));
  const updateVariant = (idx, key, val) => setForm(f => ({
    ...f, variants: f.variants.map((v, i) => i === idx ? { ...v, [key]: val } : v),
  }));

  const removeExistingImage = (img) => setExistingImages(imgs => imgs.filter(i => i !== img));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      if (form.slug) fd.append("slug", form.slug);
      fd.append("shortDesc", form.shortDesc);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("comparePrice", form.comparePrice || 0);
      fd.append("stock", form.stock || 0);
      fd.append("sku", form.sku);
      fd.append("material", form.material);
      if (form.category) fd.append("category", form.category);
      fd.append("isFeatured", form.isFeatured);
      fd.append("isNewArrival", form.isNewArrival);
      fd.append("isBestseller", form.isBestseller);
      fd.append("isActive", form.isActive);

      const tagsArr = [
        ...form.tags.split(",").map(t => t.trim()).filter(Boolean),
        ...(form.gemstone ? [form.gemstone] : []),
        ...(form.metal ? [form.metal] : []),
        ...(form.stoneColor ? [form.stoneColor] : []),
      ];
      fd.append("tags", JSON.stringify(tagsArr));
      fd.append("collections", JSON.stringify(form.collections));

      const variantsArr = form.variants
        .filter(v => v.label)
        .map(v => ({ ...(v._id ? { _id: v._id } : {}), label: v.label, price: Number(v.price) || 0, stock: Number(v.stock) || 0 }));
      fd.append("variants", JSON.stringify(variantsArr));

      if (product) fd.append("existingImages", JSON.stringify(existingImages));
      newFiles.forEach(f => fd.append("images", f));

      if (product) {
        await apiFetch(`/products/${product._id}`, token, { method: "PUT", body: fd });
        showToast("Product updated");
      } else {
        await apiFetch("/products", token, { method: "POST", body: fd });
        showToast("Product created");
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
    <Modal open={open} onClose={onClose} title={product ? "Edit Product" : "Add Product"} width="max-w-3xl">
      {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">{error}</div>}
      <form onSubmit={submit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name" span>
            <input className={inputCls} value={form.name} onChange={e => update("name", e.target.value)} />
          </Field>
          <Field label="Slug (optional)">
            <input className={inputCls} value={form.slug} onChange={e => update("slug", e.target.value)} placeholder="auto-generated" />
          </Field>
          <Field label="SKU">
            <input className={inputCls} value={form.sku} onChange={e => update("sku", e.target.value)} />
          </Field>
          <Field label="Price (₹)">
            <input type="number" min="0" step="0.01" className={inputCls} value={form.price} onChange={e => update("price", e.target.value)} />
          </Field>
          <Field label="Compare Price (₹)">
            <input type="number" min="0" step="0.01" className={inputCls} value={form.comparePrice} onChange={e => update("comparePrice", e.target.value)} />
          </Field>
          <Field label="Stock">
            <input type="number" min="0" className={inputCls} value={form.stock} onChange={e => update("stock", e.target.value)} />
          </Field>
          <Field label="Material">
            <input className={inputCls} value={form.material} onChange={e => update("material", e.target.value)} placeholder="e.g. 18k Gold" />
          </Field>
          <Field label="Gemstone">
            <select className={selectCls} value={form.gemstone} onChange={e => update("gemstone", e.target.value)}>
              <option value="">— None —</option>
              {GEMSTONES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field label="Metal Type">
            <select className={selectCls} value={form.metal} onChange={e => update("metal", e.target.value)}>
              <option value="">— None —</option>
              {METALS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Stone Color">
            <select className={selectCls} value={form.stoneColor} onChange={e => update("stoneColor", e.target.value)}>
              <option value="">— None —</option>
              {STONE_COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Category">
            <select className={selectCls} value={form.category} onChange={e => update("category", e.target.value)}>
              <option value="">— Select —</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Tags (comma separated)" span>
            <input className={inputCls} value={form.tags} onChange={e => update("tags", e.target.value)} placeholder="gold, rings, bestseller" />
          </Field>
          <Field label="Short Description" span>
            <input className={inputCls} value={form.shortDesc} onChange={e => update("shortDesc", e.target.value)} />
          </Field>
          <Field label="Description" span>
            <textarea rows={3} className={inputCls} value={form.description} onChange={e => update("description", e.target.value)} />
          </Field>
        </div>

        {/* Collections */}
        {collections.length > 0 && (
          <Field label="Collections">
            <div className="flex flex-wrap gap-2">
              {collections.map(c => (
                <button type="button" key={c._id} onClick={() => toggleCollection(c._id)}
                  className={`text-[11px] px-3 py-1.5 rounded-full border transition-colors ${form.collections.includes(c._id) ? "bg-[#1a1008] text-[#e8d5b0] border-[#1a1008]" : "border-[#e0d4c4] text-[#5c4f42] hover:bg-[#fdfaf6]"}`}>
                  {c.name}
                </button>
              ))}
            </div>
          </Field>
        )}

        {/* Flags */}
        <div className="flex flex-wrap gap-4">
          {[["isFeatured", "Featured"], ["isNewArrival", "New Arrival"], ["isBestseller", "Bestseller"], ["isActive", "Active"]].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-[12px] text-[#5c4f42] cursor-pointer">
              <input type="checkbox" checked={form[key]} onChange={e => update(key, e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
              {label}
            </label>
          ))}
        </div>

        {/* Variants */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78]">Variants</label>
            <button type="button" onClick={addVariant} className="text-[11px] text-[#c9a84c] hover:text-[#8b6914]">+ Add variant</button>
          </div>
          {form.variants.length === 0 && <p className="text-[11px] text-[#b0a090]">No variants — single price/stock used.</p>}
          <div className="space-y-2">
            {form.variants.map((v, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input className={inputCls} placeholder="Label (e.g. Gold)" value={v.label} onChange={e => updateVariant(idx, "label", e.target.value)} />
                <input className={inputCls + " w-28"} type="number" placeholder="Price" value={v.price} onChange={e => updateVariant(idx, "price", e.target.value)} />
                <input className={inputCls + " w-24"} type="number" placeholder="Stock" value={v.stock} onChange={e => updateVariant(idx, "stock", e.target.value)} />
                <button type="button" onClick={() => removeVariant(idx)} className="text-red-500 hover:text-red-700 text-[16px] px-1">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-2">Images</label>
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {existingImages.map(img => (
                <div key={img} className="relative w-16 h-16">
                  <img src={imgUrl(img)} alt="" className="w-16 h-16 object-cover rounded border border-[#ede4d8]" />
                  <button type="button" onClick={() => removeExistingImage(img)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-[11px] flex items-center justify-center">✕</button>
                </div>
              ))}
            </div>
          )}
          <input type="file" multiple accept="image/*" onChange={e => setNewFiles(Array.from(e.target.files || []))}
            className="text-[12px] text-[#5c4f42]" />
          {newFiles.length > 0 && <p className="text-[11px] text-[#9c8a78] mt-1">{newFiles.length} new file(s) selected</p>}
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[#ede4d8]">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : (product ? "Save Changes" : "Create Product")}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}