"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "../lib/CartContext";
import { useAuth } from "../lib/AuthContext";
import { API, imgUrl, fmtPrice } from "../lib/api";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home", hasDropdown: false },
  { href: "/shop", label: "Shop", hasDropdown: true },
  { href: "/bestarrivals", label: "Best Arrivals", hasDropdown: false },
  { href: "/rings", label: "Rings", hasDropdown: false },
  { href: "/earrings", label: "Earrings", hasDropdown: false },
  { href: "/necklaces", label: "Necklaces", hasDropdown: false },
  { href: "/bracelets", label: "Bracelets", hasDropdown: false },
  { href: "/ai-recommendation", label: "✨ AI Stylist", hasDropdown: false },
  { href: "/blog", label: "Journal", hasDropdown: false },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const { count: cartCount } = useCart();
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchBoxRef = useRef(null);
  const searchInputRef = useRef(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API}/announcements`);
        const json = await res.json();
        if (!cancelled) setOffers((json.data || []).map((o) => o.text).filter(Boolean));
      } catch {
        if (!cancelled) setOffers([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        if (abortRef.current) abortRef.current.abort();
        const ctrl = new AbortController();
        abortRef.current = ctrl;
        const res = await fetch(`${API}/products?search=${encodeURIComponent(q)}&limit=6`, { signal: ctrl.signal });
        const json = await res.json();
        setSuggestions(json.data?.products ?? []);
      } catch (err) {
        if (err.name !== "AbortError") setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const runSearch = (q) => {
    const term = (q ?? query).trim();
    if (!term) return;
    setSuggestions([]);
    setSearchOpen(false);
    setMenuOpen(false);
    router.push(`/shop?search=${encodeURIComponent(term)}`);
  };

  const goToProduct = (slug) => {
    setSuggestions([]);
    setSearchOpen(false);
    setQuery("");
    router.push(`/products/${slug}`);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSuggestions([]);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") runSearch();
    if (e.key === "Escape") closeSearch();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Announcement Bar */}
      <div className="relative flex items-center bg-[#553e33] dark:bg-[#3d1f10] text-[#fff] dark:text-[#e8d5b0] overflow-hidden h-[34px]">
        <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center bg-[#3d1f10] dark:bg-[#1a0c06] px-6 border-r border-[#c9a96e]/20">
          <Link
            href="/offers"
            className="text-[11px] tracking-[0.15em] uppercase text-[#c9a96e] hover:text-white dark:hover:text-[#e8d5b0] transition-colors whitespace-nowrap"
          >
            Offers
          </Link>
        </div>
        {offers.length > 0 && (
          <div className="w-full overflow-hidden pl-[110px]">
            <div className="flex whitespace-nowrap animate-marquee">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="mx-10 text-[11px] tracking-[0.22em] uppercase font-semibold">
                  {offers.map((text, j) => (
                    <span key={j}>
                      ✦ {text}
                      {j < offers.length - 1 && <>&nbsp;&nbsp;&nbsp;</>}
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav
        className={`bg-[#faf7f2] dark:bg-[#1a0c06] transition-all duration-500 ${scrolled ? "shadow-[0_2px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_24px_rgba(0,0,0,0.4)]" : ""
          }`}
      >
        <div className="max-w-[1320px] mx-auto px-8 h-[70px] flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/taleologo.png"
              alt="Taleo Fine Jewellery"
              width={520}
              height={1000}
              priority
              className="h-16 md:h-20 lg:h-24 w-auto dark:hidden"
            />
            <Image
              src="/footerlogo.png"
              alt="Taleo Fine Jewellery"
              width={520}
              height={1000}
              priority
              className="hidden h-16 md:h-20 lg:h-24 w-auto dark:block"
            />
          </Link>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-9">
            {navLinks.map(({ href, label, hasDropdown }) => {
              const active = pathname === href;
              return (
                <div key={href} className="relative group">
                  <Link
                    href={href}
                    className={`flex items-center gap-1 text-[11.5px] tracking-[0.14em] font-sans font-[700] uppercase transition-colors duration-200 pb-1 ${active ? "text-[#c9a96e]" : "text-[#3d1f10]/85 dark:text-[#e8d5b0]/85 hover:text-[#c9a96e]"
                      }`}
                  >
                    {label}
                    {hasDropdown && (
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="opacity-50 group-hover:opacity-100 group-hover:rotate-180 transition-transform duration-300">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    )}
                  </Link>
                  <span className={`absolute bottom-0 left-0 h-px bg-[#c9a96e] transition-all duration-300 ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                </div>
              );
            })}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-5">
            {/* ThemeToggle — desktop only */}
            <div className="hidden sm:block">
              <ThemeToggle className="text-[#3d1f10]/80 dark:text-[#e8d5b0]/80 hover:!text-[#c9a96e]" />
            </div>

            {/* Search — desktop */}
            <button
              onClick={() => setSearchOpen((o) => !o)}
              className="text-[#3d1f10]/80 dark:text-[#e8d5b0]/80 hover:text-[#c9a96e] transition-colors duration-200 hidden sm:block"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>

            {/* Account — desktop only */}
            <Link
              href="/account"
              className={`transition-colors duration-200 hidden sm:block ${user ? "text-[#c9a96e]" : "text-[#3d1f10]/80 dark:text-[#e8d5b0]/80 hover:text-[#c9a96e]"}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            </Link>

            {/* Cart — always visible */}
            <Link href="/cart" className="relative text-[#3d1f10]/80 dark:text-[#e8d5b0]/80 hover:text-[#c9a96e] transition-colors duration-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#c9a96e] text-[#1a0c06] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Search icon — mobile only (opens menu+search) */}
            <button
              onClick={() => { setMenuOpen(true); setSearchOpen(true); }}
              className="sm:hidden text-[#3d1f10]/80 dark:text-[#e8d5b0]/80 hover:text-[#c9a96e] transition-colors duration-200"
              aria-label="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            </button>

            {/* Hamburger — mobile only */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-[#3d1f10] dark:text-[#e8d5b0] ml-2">
              {menuOpen
                ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
                : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              }
            </button>
          </div>
        </div>

        {/* Search panel — desktop */}
        <div
          ref={searchBoxRef}
          className={`hidden sm:block overflow-hidden border-t border-[#c9a96e]/15 transition-all duration-300 ${searchOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="max-w-[1320px] mx-auto px-8 py-5">
            <div className="flex items-center gap-3 w-[360px] ml-auto">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-[#3d1f10]/50 dark:text-[#e8d5b0]/50 shrink-0"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search jewellery..."
                className="w-full bg-transparent text-[14px] text-[#3d1f10] dark:text-[#e8d5b0] placeholder:text-[#3d1f10]/40 dark:placeholder:text-[#e8d5b0]/40 border-b border-[#c9a96e]/40 focus:border-[#c9a96e] focus:outline-none py-1.5"
              />
              <button onClick={closeSearch} className="text-[#3d1f10]/60 dark:text-[#e8d5b0]/60 hover:text-[#c9a96e] transition-colors shrink-0" aria-label="Close search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {query.trim().length >= 2 && (
              <div className="mt-4 w-[260px] ml-auto max-h-[340px] overflow-y-auto rounded-md bg-white dark:bg-[#0f0703] border border-[#c9a96e]/15">
                {searchLoading ? (
                  <div className="px-4 py-6 text-center text-[12px] text-[#3d1f10]/50 dark:text-[#e8d5b0]/50">Searching...</div>
                ) : suggestions.length === 0 ? (
                  <div className="px-4 py-6 text-center text-[12px] text-[#3d1f10]/50 dark:text-[#e8d5b0]/50">No pieces found for &ldquo;{query}&rdquo;</div>
                ) : (
                  <>
                    {suggestions.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => goToProduct(p.slug)}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[#c9a96e]/10 transition-colors border-b border-[#c9a96e]/10 last:border-b-0"
                      >
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded bg-[#faf7f2] dark:bg-[#1a0c06]">
                          {p.images?.[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={imgUrl(p.images[0])} alt={p.name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12.5px] text-[#3d1f10] dark:text-[#e8d5b0]">{p.name}</p>
                          <p className="text-[11.5px] text-[#c9a96e]">{fmtPrice(p.price)}</p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => runSearch()}
                      className="w-full px-4 py-2.5 text-center text-[11px] uppercase tracking-widest text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-colors"
                    >
                      View all results
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-400 ${menuOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="bg-[#faf7f2] dark:bg-[#1a0c06] border-t border-[#c9a96e]/15 px-8 py-4 flex flex-col gap-1">

            {/* ── Mobile-only: ThemeToggle + Login row ── */}
            <div className="flex items-center justify-between py-3 mb-1 border-b border-[#c9a96e]/15 sm:hidden">
              <ThemeToggle className="text-[#3d1f10]/80 dark:text-[#e8d5b0]/80 hover:!text-[#c9a96e]" />
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase font-[700] transition-colors duration-200 ${user ? "text-[#c9a96e]" : "text-[#3d1f10]/80 dark:text-[#e8d5b0]/80 hover:text-[#c9a96e]"
                  }`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {user ? "Account" : "Login"}
              </Link>
            </div>

            {/* Mobile search */}
            <div className="sm:hidden pb-3 mb-2 border-b border-[#c9a96e]/10">
              <div className="flex items-center gap-2 bg-white dark:bg-[#0f0703] rounded px-3 py-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="text-[#3d1f10]/50 dark:text-[#e8d5b0]/50 shrink-0"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search jewellery..."
                  className="w-full bg-transparent text-[13px] text-[#3d1f10] dark:text-[#e8d5b0] placeholder:text-[#3d1f10]/40 dark:placeholder:text-[#e8d5b0]/40 focus:outline-none"
                />
              </div>
              {query.trim().length >= 2 && (
                <div className="mt-2 max-h-[300px] overflow-y-auto rounded bg-white dark:bg-[#0f0703] border border-[#c9a96e]/15">
                  {searchLoading ? (
                    <div className="px-4 py-4 text-center text-[12px] text-[#3d1f10]/50 dark:text-[#e8d5b0]/50">Searching...</div>
                  ) : suggestions.length === 0 ? (
                    <div className="px-4 py-4 text-center text-[12px] text-[#3d1f10]/50 dark:text-[#e8d5b0]/50">No pieces found</div>
                  ) : (
                    <>
                      {suggestions.map((p) => (
                        <button
                          key={p._id}
                          onClick={() => goToProduct(p.slug)}
                          className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-[#c9a96e]/10 transition-colors border-b border-[#c9a96e]/10 last:border-b-0"
                        >
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded bg-[#faf7f2] dark:bg-[#1a0c06]">
                            {p.images?.[0] && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={imgUrl(p.images[0])} alt={p.name} className="h-full w-full object-cover" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12px] text-[#3d1f10] dark:text-[#e8d5b0]">{p.name}</p>
                            <p className="text-[11px] text-[#c9a96e]">{fmtPrice(p.price)}</p>
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => runSearch()}
                        className="w-full px-3 py-2.5 text-center text-[11px] uppercase tracking-widest text-[#c9a96e] hover:bg-[#c9a96e]/10 transition-colors"
                      >
                        View all results
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Nav links */}
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-[13px] tracking-[0.1em] uppercase font-[family-name:var(--font-jost)] text-[#3d1f10]/80 dark:text-[#e8d5b0]/80 hover:text-[#c9a96e] py-2.5 border-b border-[#c9a96e]/10 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}