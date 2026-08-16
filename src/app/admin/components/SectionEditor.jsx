"use client";
import BlockEditor from "./BlockEditor.jsx";
import { inputCls } from "./ui.jsx";

export default function SectionEditor({ sections = [], onChange, uploadFn }) {
  const update = (idx, patch) => onChange(sections.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  const add = () => onChange([...sections, { id: `sec-${Date.now()}`, heading: "", content: [] }]);
  const remove = (idx) => onChange(sections.filter((_, i) => i !== idx));
  const move = (idx, dir) => {
    const next = [...sections];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    onChange(next);
  };

  return (
    <div className="space-y-4">
      {sections.map((sec, idx) => (
        <div key={idx} className="border border-[#e0d4c4] rounded-2xl p-4 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-widest text-[#9c8a78] font-medium">Section {idx + 1}</span>
            <div className="flex gap-1 ml-auto">
              <button onClick={() => move(idx, -1)} className="text-[11px] px-2 py-1 rounded border border-[#e0d4c4] text-[#9c8a78] hover:bg-[#fdfaf6]">↑</button>
              <button onClick={() => move(idx, 1)}  className="text-[11px] px-2 py-1 rounded border border-[#e0d4c4] text-[#9c8a78] hover:bg-[#fdfaf6]">↓</button>
              <button onClick={() => remove(idx)}   className="text-[11px] px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50">Remove</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-1">Section ID</label>
              <input value={sec.id || ""} onChange={e => update(idx, { id: e.target.value })}
                className={inputCls + " text-[12px]"} placeholder="e.g. intro" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-1">Heading</label>
              <input value={sec.heading || ""} onChange={e => update(idx, { heading: e.target.value })}
                className={inputCls + " text-[12px]"} placeholder="Section heading" />
            </div>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#9c8a78] mb-2">Content Blocks</label>
            <BlockEditor blocks={sec.content || []} onChange={blocks => update(idx, { content: blocks })} uploadFn={uploadFn} />
          </div>
        </div>
      ))}
      <button onClick={add}
        className="w-full text-[11px] uppercase tracking-widest text-[#c9a84c] border border-dashed border-[#e0d4c4] rounded-2xl py-3 hover:bg-[#fdfaf6]">
        + Add Section
      </button>
    </div>
  );
}
