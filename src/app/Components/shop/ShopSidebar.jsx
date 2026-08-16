"use client";
import { useState, useEffect } from "react";
import { API } from "../../lib/api";

const BODY = "'Inter', sans-serif";

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#e8ddd0] py-5">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left">
        <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#2c2418]">{title}</span>
        <svg className={`h-4 w-4 text-[#9c8a78] transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
        {children}
      </div>
    </div>
  );
};

const CheckItem = ({ label, count, checked, onChange }) => (
  <label className="group flex cursor-pointer items-center justify-between py-1.5">
    <div className="flex items-center gap-2.5">
      <div
        onClick={onChange}
        className={`h-4 w-4 rounded-sm border transition-all duration-200 flex items-center justify-center ${checked ? "border-[#b8975a] bg-[#b8975a]" : "border-[#d4c4b0] bg-white group-hover:border-[#b8975a]"}`}
      >
        {checked && (
          <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-[13px] text-[#5c4f42] transition-colors group-hover:text-[#2c2418]" style={{ fontFamily: BODY }}>{label}</span>
    </div>
    {count != null && <span className="text-[11px] text-[#b0a090]">({count})</span>}
  </label>
);

const SwatchItem = ({ label, hex, selected, onChange }) => (
  <button onClick={onChange} title={label} className={`relative h-7 w-7 rounded-full transition-all duration-200 ${selected ? "scale-110 ring-2 ring-[#b8975a] ring-offset-2" : "hover:scale-105"}`} style={{ backgroundColor: hex }} />
);

const GEMSTONES = ["Diamond", "Ruby", "Emerald", "Sapphire", "Pearl", "Amethyst", "Moissanite", "No Stone"];
const METALS = ["Yellow Gold", "White Gold", "Rose Gold", "Platinum", "Silver 925", "Two-Tone"];
const PRICE_RANGES = [
  { label: "Under ₹5,000", min: 0, max: 5000 },
  { label: "₹5,000 – ₹15,000", min: 5000, max: 15000 },
  { label: "₹15,000 – ₹50,000", min: 15000, max: 50000 },
  { label: "₹50,000 – ₹1,00,000", min: 50000, max: 100000 },
  { label: "Above ₹1,00,000", min: 100000, max: null },
];

export default function ShopSidebar({ filters, onFilterChange, onClearAll, hideClearHeader = false, sort, onSortChange }) {
  const [categories, setCategories] = useState([]);
  const [catsLoading, setCatsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/categories`)
      .then((r) => r.json())
      .then((json) => {
        const cats = (json.data ?? []).filter((c) => c.isActive !== false);
        setCategories(cats);
      })
      .catch(() => { })
      .finally(() => setCatsLoading(false));
  }, []);

  return (
    <aside className="w-full lg:w-[260px] shrink-0">
      <div className="lg:sticky lg:top-0 overflow-y-auto" style={{ maxHeight: "150vh" }}>

        {/* Header — hidden inside mobile drawer (drawer has its own header) */}
        {!hideClearHeader && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-[22px] font-medium italic text-[#2c2418]">Refine</h2>
            <button onClick={onClearAll} className="text-[11px] uppercase tracking-widest text-[#9c8a78] underline underline-offset-2 transition-colors hover:text-[#b8975a]">
              Clear all
            </button>
          </div>
        )}

        {/* Category */}
        <FilterSection title="Category">
          <div className="space-y-0.5">
            {catsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-7 rounded animate-pulse bg-[#f0e8e0]" />
              ))
            ) : categories.length === 0 ? (
              <p className="text-[12px] text-[#b0a090]">No categories yet</p>
            ) : (
              categories.map((c) => (
                <CheckItem
                  key={c._id}
                  label={c.name}
                  checked={filters.categoryIds?.includes(c._id)}
                  onChange={() => onFilterChange("categoryIds", c._id)}
                />
              ))
            )}
          </div>
        </FilterSection>

        {/* Price Range */}
        <FilterSection title="Price Range">
          <div className="space-y-1">
            {PRICE_RANGES.map((p) => (
              <CheckItem
                key={p.label}
                label={p.label}
                checked={filters.priceRanges?.includes(p.label)}
                onChange={() => onFilterChange("priceRanges", p.label)}
              />
            ))}
            <div className="pt-3 flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice ?? ""}
                onChange={(e) => onFilterChange("minPrice", e.target.value)}
                className="w-full rounded border border-[#e0d4c4] bg-[#fdfaf6] px-2.5 py-1.5 text-[12px] text-[#2c2418] placeholder:text-[#c4b8a8] focus:border-[#b8975a] focus:outline-none"
              />
              <span className="text-[#c4b8a8]">–</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice ?? ""}
                onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                className="w-full rounded border border-[#e0d4c4] bg-[#fdfaf6] px-2.5 py-1.5 text-[12px] text-[#2c2418] placeholder:text-[#c4b8a8] focus:border-[#b8975a] focus:outline-none"
              />
            </div>
          </div>
        </FilterSection>

        {/* Metal */}
        <FilterSection title="Metal Type">
          {METALS.map((m) => (
            <CheckItem
              key={m}
              label={m}
              checked={filters.metals?.includes(m)}
              onChange={() => onFilterChange("metals", m)}
            />
          ))}
        </FilterSection>

        {/* Gemstone */}
        <FilterSection title="Gemstone">
          {GEMSTONES.map((g) => (
            <CheckItem
              key={g}
              label={g}
              checked={filters.gemstones?.includes(g)}
              onChange={() => onFilterChange("gemstones", g)}
            />
          ))}
        </FilterSection>

        {/* Stone Color */}
        <FilterSection title="Stone Color">
          <div className="flex flex-wrap gap-2.5">
            {[
              { label: "White", hex: "#F8F4F0" },
              { label: "Yellow", hex: "#F5C842" },
              { label: "Pink", hex: "#E8829A" },
              { label: "Blue", hex: "#3B7DC8" },
              { label: "Green", hex: "#3DAA6C" },
              { label: "Red", hex: "#C83B3B" },
              { label: "Purple", hex: "#8B5CF6" },
              { label: "Black", hex: "#2C2C2C" },
            ].map((c) => (
              <SwatchItem key={c.label} {...c} selected={filters.stoneColors?.includes(c.label)} onChange={() => onFilterChange("stoneColors", c.label)} />
            ))}
          </div>
        </FilterSection>

        {/* Toggles */}
        <div className="py-5 space-y-2.5">
          {[
            { label: "New Arrivals", key: "newArrivals" },
            { label: "On Sale / Offers", key: "onSale" },
            { label: "In Stock Only", key: "inStock" },
          ].map((t) => (
            <label key={t.key} className="flex cursor-pointer items-center justify-between">
              <span className="text-[11px] text-[#5c4f42]" style={{ fontFamily: BODY }}>{t.label}</span>
              <div
                onClick={() => onFilterChange("toggles", t.key)}
                className={`relative h-5 w-9 rounded-full transition-all duration-300 ${filters.toggles?.includes(t.key) ? "bg-[#b8975a]" : "bg-[#e0d4c4]"}`}
              >
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${filters.toggles?.includes(t.key) ? "left-[18px]" : "left-0.5"}`} />
              </div>
            </label>
          ))}

        </div>

        {/* Sort by Price */}
        <FilterSection title="Sort By">
          <div className="space-y-1">
            {[
              { label: "Default", value: "featured" },
              { label: "Price: Low to High", value: "price_asc" },
              { label: "Price: High to Low", value: "price_desc" },
            ].map((s) => (
              <label key={s.value} className="group flex cursor-pointer items-center gap-2.5 py-1.5">
                <div
                  onClick={() => onSortChange?.(s.value)}
                  className={`h-4 w-4 rounded-full border transition-all duration-200 flex items-center justify-center ${sort === s.value ? "border-[#b8975a] bg-[#b8975a]" : "border-[#d4c4b0] bg-white group-hover:border-[#b8975a]"}`}
                >
                  {sort === s.value && (
                    <div className="h-2 w-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-[13px] text-[#5c4f42] group-hover:text-[#2c2418]" style={{ fontFamily: BODY }}>{s.label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

      </div>
    </aside>
  );
}