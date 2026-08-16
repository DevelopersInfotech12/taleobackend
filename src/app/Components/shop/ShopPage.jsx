"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import ShopSidebar from "./ShopSidebar";
import ProductCard from "./ProductCard";
import { API, normaliseProduct } from "../../lib/api";

const SORT_OPTIONS = [
  { label: "Featured",           value: "featured"   },
  { label: "Newest First",       value: "newest"     },
  { label: "Price: Low to High", value: "price_asc"  },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated",          value: "rating"     },
  { label: "Best Sellers",       value: "bestseller" },
];

const SORT_MAP = {
  featured:   "newest",
  newest:     "newest",
  price_asc:  "price-asc",
  price_desc: "price-desc",
  rating:     "popular",
  bestseller: "popular",
};

function toggleArrayItem(arr = [], item) {
  return arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];
}

const PRICE_RANGES = [
  { label: "Under ₹5,000",        min: 0,      max: 5000   },
  { label: "₹5,000 – ₹15,000",    min: 5000,   max: 15000  },
  { label: "₹15,000 – ₹50,000",   min: 15000,  max: 50000  },
  { label: "₹50,000 – ₹1,00,000", min: 50000,  max: 100000 },
  { label: "Above ₹1,00,000",     min: 100000, max: null   },
];

function buildQueryParams(filters, sort, page, categoryId, search) {
  const p = { page, limit: 18 };
  if (search) p.search = search;
  if (categoryId) {
    p.category = categoryId;
  } else if (filters.categoryIds?.length === 1) {
    p.category = filters.categoryIds[0];
  }
  const tagFilters = [...(filters.gemstones || []), ...(filters.metals || []), ...(filters.stoneColors || [])];
  if (tagFilters.length) p.tag = tagFilters.join(",");
  if (filters.priceRanges?.length) {
    const matched = PRICE_RANGES.filter(r => filters.priceRanges.includes(r.label));
    const mins = matched.map(r => r.min);
    const maxes = matched.map(r => r.max).filter(v => v !== null);
    if (mins.length) p.minPrice = Math.min(...mins);
    if (maxes.length < matched.length) {
      // open-ended — no upper bound
    } else if (maxes.length) {
      p.maxPrice = Math.max(...maxes);
    }
  }
  if (filters.minPrice) p.minPrice = filters.minPrice;
  if (filters.maxPrice) p.maxPrice = filters.maxPrice;
  if (filters.toggles?.includes("onSale"))      p.onSale = true;
  if (filters.toggles?.includes("newArrivals")) p.newArrival = true;
  if (filters.toggles?.includes("inStock"))     p.inStock = true;
  if (sort === "bestseller") p.bestseller = true;
  p.sort = SORT_MAP[sort] || "newest";
  return p;
}

export default function ShopPage({ initialFilters = {}, categorySlug = null }) {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [filters, setFilters]                     = useState(initialFilters);
  const [sort, setSort]                           = useState("featured");
  const [searchTerm, setSearchTerm]                = useState(urlSearch);
  const [viewMode, setViewMode]                   = useState("grid");
  const [sidebarOpen, setSidebarOpen]             = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal]           = useState(0);
  const [animKey, setAnimKey]       = useState(0);
  const [categoryId, setCategoryId] = useState(null);

  const abortRef = useRef(null);

  useEffect(() => { setSearchTerm(urlSearch); }, [urlSearch]);

  useEffect(() => {
    if (!categorySlug) { setCategoryId(null); return; }
    fetch(`${API}/categories`).then(r => r.json()).then(json => {
      const cats = json.data ?? [];
      const found = cats.find(c => c.slug === categorySlug || c.name?.toLowerCase() === categorySlug?.toLowerCase());
      if (found) setCategoryId(found._id);
    }).catch(() => {});
  }, [categorySlug]);

  const loadProducts = useCallback(async (f, s, pg, term) => {
    const ctrl = new AbortController();
    const prev = abortRef.current;
    abortRef.current = ctrl;
    if (prev) prev.abort();
    setLoading(true);
    setError(null);
    try {
      const params = buildQueryParams(f, s, pg, categoryId, term);
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
      });
      const res = await fetch(`${API}/products?${qs}`, { signal: ctrl.signal });
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      const raw = json.data?.products ?? json.data ?? [];
      setProducts(raw.map(normaliseProduct));
      setTotal(json.data?.total ?? raw.length);
      setTotalPages(json.data?.pages ?? 1);
      setAnimKey((k) => k + 1);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(`Could not load products: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => { setPage(1); loadProducts(filters, sort, 1, searchTerm); }, [filters, sort, loadProducts, categoryId, searchTerm]);
  useEffect(() => { if (page > 1) loadProducts(filters, sort, page, searchTerm); }, [page]); // eslint-disable-line

  const handleFilterChange = useCallback((group, value) => {
    setFilters((prev) => ({ ...prev, [group]: toggleArrayItem(prev[group], value) }));
  }, []);

  const handleClearAll = () => setFilters(initialFilters);

  const userFilterCount = (() => {
    let count = 0;
    for (const [group, vals] of Object.entries(filters)) {
      const initVals = initialFilters[group] || [];
      count += (vals || []).filter((v) => !initVals.includes(v)).length;
    }
    return count;
  })();

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap');
        * { font-family: 'Jost', sans-serif; }
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }
        .skeleton { animation: pulse 1.5s ease-in-out infinite; background: #e8ddd0; border-radius: 8px; }
        .filter-chip:hover { transform: translateY(-1px); }
      `}</style>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">

        {/* ── Search banner ── */}
        {searchTerm && (
          <div className="flex items-center justify-between gap-3 border-b border-[#e8ddd0] py-3">
            <p className="text-[13px] text-[#5c4f42]">
              Search results for <span className="font-medium text-[#2c2418]">&ldquo;{searchTerm}&rdquo;</span>
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                const url = new URL(window.location.href);
                url.searchParams.delete("search");
                window.history.replaceState({}, "", url.pathname + url.search);
              }}
              className="text-[11px] uppercase tracking-widest text-[#9c8a78] underline underline-offset-2 hover:text-[#b8975a]"
            >
              Clear search
            </button>
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8ddd0] py-4">
          <div className="flex items-center gap-3 flex-wrap">

            {/* Filter toggle */}
            <button
              onClick={() => {
                if (window.innerWidth < 1024) setMobileSidebarOpen(true);
                else setSidebarOpen(!sidebarOpen);
              }}
              className="flex items-center gap-2 rounded border border-[#e0d4c4] bg-white px-3 py-1.5 text-[12px] text-[#5c4f42] transition-all hover:border-[#b8975a] hover:text-[#b8975a]"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M7 12h10M11 20h2" />
              </svg>
              <span className="hidden lg:inline">{sidebarOpen ? "Hide" : "Show"} filters</span>
              <span className="lg:hidden">Filters</span>
              {userFilterCount > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#b8975a] text-[9px] text-white">
                  {userFilterCount}
                </span>
              )}
            </button>

            {/* Active filter chips */}
            {userFilterCount > 0 && (
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).flatMap(([group, values]) => {
                  const initVals = initialFilters[group] || [];
                  return (values || [])
                    .filter((v) => !initVals.includes(v))
                    .map((v) => (
                      <button
                        key={`${group}-${v}`}
                        onClick={() => handleFilterChange(group, v)}
                        className="filter-chip flex items-center gap-1.5 rounded-full border border-[#e0d4c4] bg-white px-3 py-1 text-[11px] text-[#5c4f42] transition-all hover:border-[#c83b3b] hover:text-[#c83b3b]"
                      >
                        {v}
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ));
                })}
                <button onClick={handleClearAll} className="text-[11px] text-[#c83b3b] underline underline-offset-2 hover:no-underline">
                  Clear all
                </button>
              </div>
            )}

            {!loading && (
              <span className="text-[11px] text-[#9c8a78]">{total} piece{total !== 1 ? "s" : ""}</span>
            )}
          </div>

          {/* Sort + view mode */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[12px] text-[#9c8a78]">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded border border-[#e0d4c4] bg-white px-2 sm:px-3 py-1.5 text-[12px] text-[#2c2418] focus:border-[#b8975a] focus:outline-none"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div className="flex rounded border border-[#e0d4c4] overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-2.5 py-1.5 transition-colors ${viewMode === "grid" ? "bg-[#2c2418] text-[#e8d5b0]" : "bg-white text-[#9c8a78] hover:text-[#2c2418]"}`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-2.5 py-1.5 border-l border-[#e0d4c4] transition-colors ${viewMode === "list" ? "bg-[#2c2418] text-[#e8d5b0]" : "bg-white text-[#9c8a78] hover:text-[#2c2418]"}`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile sidebar drawer ── */}
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            {/* Drawer panel */}
            <div className="fixed inset-y-0 left-0 z-50 w-[300px] overflow-y-auto bg-[#fdfaf6] shadow-2xl lg:hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8ddd0] sticky top-0 bg-[#fdfaf6]">
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[20px] font-medium italic text-[#2c2418]">
                  Refine
                </h2>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f0e8e0] transition-colors"
                >
                  <svg className="h-5 w-5 text-[#5c4f42]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-5 pb-10">
                <ShopSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearAll={() => { handleClearAll(); setMobileSidebarOpen(false); }}
                  hideClearHeader
                  sort={sort}
                  onSortChange={setSort}
                />
              </div>
            </div>
          </>
        )}

        {/* ── Main layout ── */}
        <div className="flex gap-8 py-8">

          {/* Desktop sidebar — hidden on mobile */}
          <div className={`hidden lg:block transition-all duration-300 ease-in-out overflow-hidden shrink-0 ${sidebarOpen ? "w-[260px] opacity-100" : "w-0 opacity-0"}`}>
            <ShopSidebar filters={filters} onFilterChange={handleFilterChange} onClearAll={handleClearAll} sort={sort} onSortChange={setSort} />
          </div>

          {/* Product area — full width on mobile */}
          <div className="flex-1 min-w-0">

            {error && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-[14px] text-red-600">{error}</p>
                <button
                  onClick={() => loadProducts(filters, sort, page, searchTerm)}
                  className="mt-4 rounded border border-[#2c2418] px-6 py-2 text-[12px] uppercase tracking-widest text-[#2c2418] hover:bg-[#2c2418] hover:text-white transition-all"
                >
                  Retry
                </button>
              </div>
            )}

            {loading && (
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-[#e8ddd0]">
                    <div className="skeleton aspect-[4/3]" />
                    <div className="p-4 flex flex-col gap-3">
                      <div className="skeleton h-4 w-3/4" />
                      <div className="skeleton h-3 w-1/2" />
                      <div className="skeleton h-8 w-full mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="font-serif text-[64px] text-[#e8ddd0]">✦</div>
                <h3 className="font-serif mt-4 text-[22px] italic text-[#9c8a78]">No pieces found</h3>
                <p className="mt-2 text-[13px] text-[#b0a090]">Try adjusting your filters</p>
                <button
                  onClick={handleClearAll}
                  className="mt-5 rounded border border-[#2c2418] px-6 py-2 text-[12px] uppercase tracking-widest text-[#2c2418] transition-all hover:bg-[#2c2418] hover:text-[#e8d5b0]"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              viewMode === "list" ? (
                <div key={animKey}>
                  {products.map((p, i) => (
                    <ProductCard key={p.id} {...p} isNew={p.badge === "New"} index={i} viewMode="list" />
                  ))}
                </div>
              ) : (
                <div key={animKey} className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3">
                  {products.map((p, i) => (
                    <ProductCard key={p.id} {...p} isNew={p.badge === "New"} index={i} viewMode="grid" />
                  ))}
                </div>
              )
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2 border-t border-[#e8ddd0] pt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-9 w-9 items-center justify-center rounded border border-[#e0d4c4] text-[#9c8a78] transition-all hover:border-[#b8975a] hover:text-[#b8975a] disabled:opacity-30"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) => (
                    <button
                      key={i}
                      onClick={() => typeof p === "number" && setPage(p)}
                      className={`flex h-9 w-9 items-center justify-center rounded border text-[13px] transition-all ${
                        p === page
                          ? "border-[#2c2418] bg-[#2c2418] text-[#e8d5b0]"
                          : typeof p === "number"
                          ? "border-[#e0d4c4] text-[#9c8a78] hover:border-[#b8975a] hover:text-[#b8975a]"
                          : "border-transparent text-[#9c8a78] cursor-default"
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-9 w-9 items-center justify-center rounded border border-[#e0d4c4] text-[#9c8a78] transition-all hover:border-[#b8975a] hover:text-[#b8975a] disabled:opacity-30"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}