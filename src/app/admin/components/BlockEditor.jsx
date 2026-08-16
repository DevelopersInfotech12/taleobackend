"use client";
import { inputCls } from "./ui.jsx";

const BLOCK_TYPES = [
  { value: "p",            label: "Paragraph" },
  { value: "h3",           label: "Heading (H3)" },
  { value: "ul",           label: "Bullet List" },
  { value: "ol",           label: "Numbered List" },
  { value: "callout",      label: "Callout (info)" },
  { value: "callout-warn", label: "Callout (warn)" },
  { value: "steps",        label: "Steps" },
  { value: "img",          label: "Image" },
];

export default function BlockEditor({ blocks = [], onChange, uploadFn }) {
  const update = (idx, patch) => {
    const next = blocks.map((b, i) => (i === idx ? { ...b, ...patch } : b));
    onChange(next);
  };
  const add = () => onChange([...blocks, { type: "p", text: "" }]);
  const remove = (idx) => onChange(blocks.filter((_, i) => i !== idx));
  const move = (idx, dir) => {
    const next = [...blocks];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange(next);
  };

  const handleImg = async (idx, file) => {
    if (!file || !uploadFn) return;
    try {
      const url = await uploadFn(file);
      update(idx, { src: url });
    } catch (e) {
      alert("Upload failed: " + e.message);
    }
  };

  return (
    <div className="space-y-3">
      {blocks.map((b, idx) => (
        <div key={idx} className="border border-[#e0d4c4] rounded-xl p-3 bg-[#fdfaf6] space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <select value={b.type} onChange={e => update(idx, { type: e.target.value, text: "", items: [], stepItems: [], src: "", alt: "" })}
              className="text-[11px] border border-[#e0d4c4] rounded-lg px-2 py-1 bg-white text-[#1a1008] focus:outline-none focus:border-[#c9a84c]">
              {BLOCK_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <div className="flex gap-1 ml-auto">
              <button onClick={() => move(idx, -1)} className="text-[11px] px-2 py-1 rounded border border-[#e0d4c4] text-[#9c8a78] hover:bg-white">↑</button>
              <button onClick={() => move(idx, 1)}  className="text-[11px] px-2 py-1 rounded border border-[#e0d4c4] text-[#9c8a78] hover:bg-white">↓</button>
              <button onClick={() => remove(idx)}   className="text-[11px] px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50">✕</button>
            </div>
          </div>

          {(b.type === "p" || b.type === "h3" || b.type === "callout" || b.type === "callout-warn") && (
            <textarea rows={b.type === "p" ? 3 : 1} value={b.text || ""} onChange={e => update(idx, { text: e.target.value })}
              placeholder={b.type === "h3" ? "Heading…" : "Text…"}
              className={inputCls + " resize-y text-[12px]"} />
          )}

          {(b.type === "ul" || b.type === "ol") && (
            <div className="space-y-1">
              {(b.items || []).map((item, ii) => (
                <div key={ii} className="flex gap-1">
                  <input value={item} onChange={e => { const items = [...(b.items || [])]; items[ii] = e.target.value; update(idx, { items }); }}
                    className={inputCls + " text-[12px]"} placeholder={`Item ${ii + 1}`} />
                  <button onClick={() => { const items = (b.items || []).filter((_, i) => i !== ii); update(idx, { items }); }}
                    className="text-red-400 px-2 hover:text-red-600">✕</button>
                </div>
              ))}
              <button onClick={() => update(idx, { items: [...(b.items || []), ""] })}
                className="text-[11px] text-[#c9a84c] hover:underline">+ Add item</button>
            </div>
          )}

          {b.type === "steps" && (
            <div className="space-y-2">
              {(b.stepItems || []).map((step, si) => (
                <div key={si} className="border border-[#e0d4c4] rounded-lg p-2 space-y-1 bg-white">
                  <div className="flex gap-1 items-center">
                    <input value={step.n || ""} onChange={e => { const stepItems = [...(b.stepItems || [])]; stepItems[si] = { ...step, n: e.target.value }; update(idx, { stepItems }); }}
                      className={inputCls + " w-12 text-[12px]"} placeholder="#" />
                    <input value={step.title || ""} onChange={e => { const stepItems = [...(b.stepItems || [])]; stepItems[si] = { ...step, title: e.target.value }; update(idx, { stepItems }); }}
                      className={inputCls + " text-[12px]"} placeholder="Title" />
                    <button onClick={() => update(idx, { stepItems: (b.stepItems || []).filter((_, i) => i !== si) })}
                      className="text-red-400 px-2">✕</button>
                  </div>
                  <textarea rows={2} value={step.desc || ""} onChange={e => { const stepItems = [...(b.stepItems || [])]; stepItems[si] = { ...step, desc: e.target.value }; update(idx, { stepItems }); }}
                    className={inputCls + " resize-none text-[12px]"} placeholder="Description" />
                  <input value={step.tip || ""} onChange={e => { const stepItems = [...(b.stepItems || [])]; stepItems[si] = { ...step, tip: e.target.value }; update(idx, { stepItems }); }}
                    className={inputCls + " text-[12px]"} placeholder="Tip (optional)" />
                </div>
              ))}
              <button onClick={() => update(idx, { stepItems: [...(b.stepItems || []), { n: String((b.stepItems || []).length + 1), title: "", desc: "", tip: "" }] })}
                className="text-[11px] text-[#c9a84c] hover:underline">+ Add step</button>
            </div>
          )}

          {b.type === "img" && (
            <div className="space-y-1">
              <input value={b.src || ""} onChange={e => update(idx, { src: e.target.value })}
                className={inputCls + " text-[12px]"} placeholder="Image URL" />
              <input type="file" accept="image/*" onChange={e => handleImg(idx, e.target.files?.[0])}
                className="text-[11px] text-[#9c8a78]" />
              <input value={b.alt || ""} onChange={e => update(idx, { alt: e.target.value })}
                className={inputCls + " text-[12px]"} placeholder="Alt text" />
              {b.src && <img src={b.src} alt={b.alt} className="max-h-32 rounded-lg mt-1 object-cover" />}
            </div>
          )}
        </div>
      ))}
      <button onClick={add}
        className="w-full text-[11px] uppercase tracking-widest text-[#c9a84c] border border-dashed border-[#e0d4c4] rounded-xl py-2 hover:bg-[#fdfaf6]">
        + Add Block
      </button>
    </div>
  );
}
