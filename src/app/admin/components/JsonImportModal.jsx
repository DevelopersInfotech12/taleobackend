"use client";
import { useState } from "react";
import { Modal, PrimaryButton, SecondaryButton } from "./ui.jsx";

export default function JsonImportModal({ open, onClose, onImport }) {
  const [raw, setRaw] = useState("");
  const [err, setErr] = useState("");

  const handle = () => {
    setErr("");
    try {
      const parsed = JSON.parse(raw);
      onImport(parsed);
      setRaw("");
      onClose();
    } catch {
      setErr("Invalid JSON — please check and try again.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Import Blog from JSON" width="max-w-2xl">
      <p className="text-[12px] text-[#9c8a78] mb-3">
        Paste a full blog JSON object. All matching fields will be imported.
      </p>
      <textarea
        rows={14}
        value={raw}
        onChange={e => setRaw(e.target.value)}
        placeholder='{ "title": "...", "slug": "...", "sections": [...] }'
        className="w-full border border-[#e0d4c4] rounded-xl px-3 py-2 text-[12px] font-mono text-[#1a1008] focus:outline-none focus:border-[#c9a84c] bg-[#fdfaf6] resize-y"
      />
      {err && <p className="text-[12px] text-red-500 mt-2">{err}</p>}
      <div className="flex justify-end gap-2 mt-4">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <PrimaryButton onClick={handle}>Import</PrimaryButton>
      </div>
    </Modal>
  );
}
