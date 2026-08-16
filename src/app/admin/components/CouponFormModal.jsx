"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Modal, Field, inputCls, selectCls, PrimaryButton, SecondaryButton } from "./ui";

const emptyForm = {
  code: "", description: "", discountType: "percent", discountValue: "",
  minOrderValue: 0, maxDiscount: "", usageLimit: "", expiresAt: "", isActive: true,
};

export default function CouponFormModal({ open, onClose, coupon, onSaved, showToast }) {
  const { token } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (coupon) {
      setForm({
        code: coupon.code || "",
        description: coupon.description || "",
        discountType: coupon.discountType || "percent",
        discountValue: coupon.discountValue ?? "",
        minOrderValue: coupon.minOrderValue ?? 0,
        maxDiscount: coupon.maxDiscount ?? "",
        usageLimit: coupon.usageLimit ?? "",
        expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
        isActive: coupon.isActive !== false,
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [coupon, open]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        code: form.code,
        description: form.description,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        minOrderValue: Number(form.minOrderValue) || 0,
        maxDiscount: form.maxDiscount === "" ? null : Number(form.maxDiscount),
        usageLimit: form.usageLimit === "" ? null : Number(form.usageLimit),
        expiresAt: form.expiresAt || null,
        isActive: form.isActive,
      };

      if (coupon) {
        await apiFetch(`/coupons/${coupon._id}`, token, { method: "PUT", body: JSON.stringify(payload) });
        showToast("Coupon updated");
      } else {
        await apiFetch("/coupons", token, { method: "POST", body: JSON.stringify(payload) });
        showToast("Coupon created");
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
    <Modal open={open} onClose={onClose} title={coupon ? "Edit Coupon" : "Add Coupon"} width="max-w-lg">
      {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Code">
            <input required className={inputCls + " uppercase"} value={form.code} onChange={e => update("code", e.target.value.toUpperCase())} />
          </Field>
          <Field label="Status">
            <label className="flex items-center gap-2 text-[12px] text-[#5c4f42] cursor-pointer mt-2.5">
              <input type="checkbox" checked={form.isActive} onChange={e => update("isActive", e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
              Active
            </label>
          </Field>
        </div>
        <Field label="Description">
          <input className={inputCls} value={form.description} onChange={e => update("description", e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Discount Type">
            <select className={selectCls} value={form.discountType} onChange={e => update("discountType", e.target.value)}>
              <option value="percent">Percent (%)</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </Field>
          <Field label={`Discount Value ${form.discountType === "percent" ? "(%)" : "(₹)"}`}>
            <input required type="number" min="0" className={inputCls} value={form.discountValue} onChange={e => update("discountValue", e.target.value)} />
          </Field>
          <Field label="Min Order Value (₹)">
            <input type="number" min="0" className={inputCls} value={form.minOrderValue} onChange={e => update("minOrderValue", e.target.value)} />
          </Field>
          <Field label="Max Discount Cap (₹)">
            <input type="number" min="0" className={inputCls} value={form.maxDiscount} onChange={e => update("maxDiscount", e.target.value)} placeholder="No cap" />
          </Field>
          <Field label="Usage Limit">
            <input type="number" min="0" className={inputCls} value={form.usageLimit} onChange={e => update("usageLimit", e.target.value)} placeholder="Unlimited" />
          </Field>
          <Field label="Expires On">
            <input type="date" className={inputCls} value={form.expiresAt} onChange={e => update("expiresAt", e.target.value)} />
          </Field>
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#ede4d8]">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : (coupon ? "Save Changes" : "Create Coupon")}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
