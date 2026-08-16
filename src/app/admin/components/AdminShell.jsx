"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../lib/AdminAuthContext";
import NotificationBell from "./NotificationBell";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/products", label: "Products", icon: "💎" },
  { href: "/admin/categories", label: "Categories", icon: "🗂️" },
  { href: "/admin/collections", label: "Collections", icon: "🏷️" },
  { href: "/admin/orders", label: "Orders", icon: "📦" },
  { href: "/admin/customers", label: "Customers", icon: "🧾" },
  { href: "/admin/coupons", label: "Coupons", icon: "🎟️" },
  { href: "/admin/announcements", label: "Offer Strip", icon: "📢" },
  { href: "/admin/blogs", label: "Blog", icon: "📝" },
  { href: "/admin/users", label: "Users", icon: "👤" },
  { href: "/admin/tasks", label: "Tasks", icon: "✅" },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const isActive = (href) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#f5efe8] flex">
      {/* Sidebar */}
      <aside className={`fixed md:sticky md:top-0 z-40 inset-y-0 left-0 w-60 h-screen bg-[#1a0c06] text-[#e8d5b0] flex flex-col transition-transform duration-200 ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className="px-5 py-4 border-b border-[#3d2a1a] shrink-0">
          {/* <span className="text-[#c9a96e] text-[20px] font-semibold tracking-wide" >Taleo</span> */}
          <p className="text-[12px] uppercase font-bold tracking-widest text-[#e8d5b0]/50 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#c9a96e]/90 hover:[&::-webkit-scrollbar-thumb]:bg-[#c9a96e]/50">
          {NAV.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 font-poppins font-semibold rounded-lg text-[12px] uppercase tracking-normal transition-colors ${isActive(item.href) ? "bg-[#3d2a1a] text-[#e8d5b0]" : "text-[#e8d5b0]/80 hover:bg-[#1a1008] hover:text-[#f5e6c8]"}`}>
              <span className="text-[21px]">{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-[#3d2a1a] shrink-0">
          <p className="text-[12px] text-[#e8d5b0] truncate">{user?.name}</p>
          <p className="text-[10px] text-[#c9a96e]/50 truncate mb-2">{user?.email}</p>
          <button onClick={logout}
            className="w-full text-[11px] uppercase tracking-widest text-[#c9a96e] hover:text-[#e8d5b0] transition-colors border border-[#c9a96e]/30 px-3 py-1.5 rounded">
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setOpen(false)} />}

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="md:hidden bg-[#1a0c06] px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-md">
          <span className="text-[#c9a96e] text-lg font-semibold" style={{ fontFamily: "Georgia, serif" }}>Taleo Admin</span>
          <div className="flex items-center gap-1">
            <NotificationBell />
            <button onClick={() => setOpen(true)} className="text-[#e8d5b0] text-xl">☰</button>
          </div>
        </header>
        <div className="hidden md:flex items-center justify-between px-6 py-2 border-b border-[#ede4d8] bg-white/90 sticky top-0 z-500">
          <span className="text-[#1a0c06] text-[20px] font-bold tracking-[0.18em] uppercase">
            TALEO
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[12px] text-[#9c8a78] italic font-bold">
            🛍️ Divya, wake up! Another order just arrived.
            </span>
            <NotificationBell />
          </div>
        </div>
        <main className="max-w-[1300px] mx-auto px-4 md:px-6 py-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}