import Image from "next/image";
import Link from "next/link";

const shopLinks = [
  { label: "Rings", href: "/rings" },
  { label: "Necklaces", href: "/necklaces" },
  { label: "Earrings", href: "/earrings" },
  { label: "Bracelets", href: "/bracelets" },
  // { label: "Gifts", href: "/shop?category=gifts" },
  { label: "New Arrivals", href: "/bestarrivals" },
];
const customerLinks = [
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns & Exchanges", href: "/returns" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];
const aboutLinks = [
  { label: "Our Story", href: "/about" },
  { label: "Craftsmanship", href: "/about#craft" },
  { label: "Journal", href: "/journal" },
  { label: "FAQ", href: "/faq" },
];
const contactItems = [
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.1 1.2 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
      </svg>
    ),
    text: "+1 (234) 567-8900",
    href: "tel:+12345678900",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    text: "taleojewels@gmail.com",
    href: "mailto:taleojewels@gmail.com",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    text: "NEW DELHI 110085",
    href: "https://maps.google.com",
  },
];

const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: "Pinterest",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.23-5.22 1.23-5.22s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.58 2.26-.87 3.51-.25 1.05.52 1.9 1.55 1.9 1.86 0 3.29-1.96 3.29-4.79 0-2.5-1.8-4.25-4.37-4.25-2.98 0-4.72 2.23-4.72 4.54 0 .9.35 1.86.78 2.39.09.1.1.19.07.3-.08.33-.26 1.05-.29 1.2-.05.19-.16.23-.38.14-1.39-.65-2.26-2.68-2.26-4.32 0-3.51 2.55-6.74 7.35-6.74 3.86 0 6.86 2.75 6.86 6.42 0 3.83-2.41 6.91-5.76 6.91-1.13 0-2.19-.59-2.55-1.28l-.69 2.6c-.25.97-.93 2.18-1.39 2.92A10 10 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

/* ─── Atoms ─────────────────────────────────────────────────────────── */

const ColHead = ({ children }) => (
  <h4 className="font-[family-name:var(--font-jost)] text-[#c9a96e] uppercase mb-4 sm:mb-5"
    style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.28em" }}>
    {children}
  </h4>
);

const ColLink = ({ href, children }) => (
  <li>
    <Link href={href}
      className="font-[family-name:var(--font-jost)] text-[#e8d5b0]/60 hover:text-[#c9a96e] transition-colors duration-200 block"
      style={{ fontSize: "13px", fontWeight: 400, letterSpacing: "0.02em", lineHeight: "1" }}>
      {children}
    </Link>
  </li>
);

/* ─── Footer ─────────────────────────────────────────────────────────── */

export default function Footer() {
  return (
    <footer className="bg-[#0d0702]" style={{ borderTop: "1px solid rgba(201,169,110,0.12)" }}>

      {/* ── Main grid ── */}
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 pt-10 sm:pt-16 pb-10 sm:pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-[200px_1fr_1fr_1fr_1fr] gap-x-4 sm:gap-x-8 gap-y-8 sm:gap-y-10">

          {/* Brand */}
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-2 min-w-0">
            <Link href="/">
              <Image
                src="/footerlogo.png"
                alt="Taleo Fine Jewellery"
                width={520}
                height={800}
                priority
                className="h-14 sm:h-16 lg:h-20 w-auto"
              />
            </Link>

            <p className="font-[family-name:var(--font-jost)] text-[#e8d5b0]/55 leading-[1.8] max-w-[280px] sm:max-w-[175px]"
              style={{ fontSize: "12px", fontWeight: 400 }}>
              Timeless jewellery crafted with passion, precision, and purpose.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-2.5 mt-1 flex-wrap">
              {socials.map(({ label, href, icon }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 flex items-center justify-center text-[#c9a96e]/90 hover:text-[#c9a96e] transition-all duration-300 shrink-0"
                  style={{ border: "1px solid rgba(211, 185, 137, 0.18)", borderRadius: "2px" }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="min-w-0">
            <ColHead>Shop</ColHead>
            <ul className="flex flex-col gap-3">
              {shopLinks.map(({ label, href }) => (
                <ColLink key={label} href={href}>{label}</ColLink>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="min-w-0">
            <ColHead>Customer Care</ColHead>
            <ul className="flex flex-col gap-3">
              {customerLinks.map(({ label, href }) => (
                <ColLink key={label} href={href}>{label}</ColLink>
              ))}
            </ul>
          </div>

          {/* About */}
          <div className="min-w-0">
            <ColHead>About Us</ColHead>
            <ul className="flex flex-col gap-3">
              {aboutLinks.map(({ label, href }) => (
                <ColLink key={label} href={href}>{label}</ColLink>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0">
            <ColHead>Contact</ColHead>
            <div className="flex flex-col gap-4">
              {contactItems.map(({ icon, text, href }) => (
                <a key={text} href={href}
                  className="flex items-start gap-3 group min-w-0">
                  <span className="text-[#c9a96e]/50 group-hover:text-[#c9a96e] transition-colors duration-200 mt-[1px] shrink-0">
                    {icon}
                  </span>
                  <span className="font-[family-name:var(--font-jost)] text-[#e8d5b0]/55 group-hover:text-[#e8d5b0]/80 transition-colors duration-200 leading-[1.6] min-w-0 break-words"
                    style={{ fontSize: "12.5px", fontWeight: 400 }}>
                    {text}
                  </span>
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid rgba(201,169,110,0.07)" }}>
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-[family-name:var(--font-jost)] text-[#e8d5b0]/35 text-center sm:text-left"
            style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.02em" }}>
            © {new Date().getFullYear()} Taleo Fine Jewellery. All Rights Reserved. | Developed by{" "}
            <a href="https://developersinfotech.in/" target="_blank" rel="noopener noreferrer"
              className="text-[#c9a96e]/60 hover:text-[#c9a96e] transition-colors duration-300">
              Developers Infotech
            </a>
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms & Conditions"].map((label, i) => (
              <Link key={label} href={i === 0 ? "/privacy" : "/terms"}
                className="font-[family-name:var(--font-jost)] text-[#e8d5b0]/35 hover:text-[#c9a96e]/70 transition-colors duration-200"
                style={{ fontSize: "11px", fontWeight: 400, letterSpacing: "0.02em" }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  );
}