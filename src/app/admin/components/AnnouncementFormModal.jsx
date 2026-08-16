"use client";
import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "../lib/AdminAuthContext";
import { Modal, Field, inputCls, PrimaryButton, SecondaryButton } from "./ui";

const emptyForm = { text: "", isActive: true };

export default function AnnouncementFormModal({ open, onClose, announcement, onSaved, showToast }) {
  const { token } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (announcement) {
      setForm({
        text: announcement.text || "",
        isActive: announcement.isActive !== false,
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [announcement, open]);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { text: form.text.trim(), isActive: form.isActive };
      if (!payload.text) throw new Error("Offer text is required");

      if (announcement) {
        await apiFetch(`/announcements/${announcement._id}`, token, { method: "PUT", body: JSON.stringify(payload) });
        showToast("Offer updated");
      } else {
        await apiFetch("/announcements", token, { method: "POST", body: JSON.stringify(payload) });
        showToast("Offer created");
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
    <Modal open={open} onClose={onClose} title={announcement ? "Edit Offer" : "Add Offer"} width="max-w-lg">
      {error && <div className="mb-4 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-[12px] text-red-700">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <Field label="Offer Text">
          <input
            required
            className={inputCls}
            placeholder="e.g. Free Gift Wrapping on Orders Above ₹5000"
            value={form.text}
            onChange={e => update("text", e.target.value)}
          />
          <p className="text-[10px] text-[#b0a090] mt-1.5">Shown in the scrolling offer strip at the top of the site. The ✦ symbol is added automatically.</p>
        </Field>
        <Field label="Status">
          <label className="flex items-center gap-2 text-[12px] text-[#5c4f42] cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={e => update("isActive", e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
            Active (visible on site)
          </label>
        </Field>
        <div className="flex justify-end gap-2 pt-2 border-t border-[#ede4d8]">
          <SecondaryButton type="button" onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton type="submit" disabled={saving}>{saving ? "Saving…" : (announcement ? "Save Changes" : "Create Offer")}</PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
