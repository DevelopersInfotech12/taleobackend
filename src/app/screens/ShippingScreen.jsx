"use client";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PageHeader from "../Components/PageHeader";
import { Reveal } from "../Components/motion/Reveal";

const sections = [
  {
    title: "Processing Time",
    content:
      "All orders are carefully inspected, packaged, and dispatched within 1–3 business days. During peak seasons or sale events, processing may take up to 5 business days. You will receive a confirmation email with tracking details once your order ships.",
  },
  {
    title: "Domestic Shipping (India)",
    rows: [
      ["Standard Delivery", "5–7 Business Days", "₹99 (Free above ₹2,499)"],
      ["Express Delivery", "2–3 Business Days", "₹299"],
      ["Same-Day Delivery", "Select Cities Only", "₹499"],
    ],
  },
  {
    title: "International Shipping",
    rows: [
      ["USA & Canada", "8–12 Business Days", "₹999"],
      ["UK & Europe", "7–10 Business Days", "₹999"],
      ["Middle East", "6–9 Business Days", "₹799"],
      ["Rest of World", "10–15 Business Days", "₹1,199"],
    ],
  },
  {
    title: "Order Tracking",
    content:
      "Once your order is shipped, you'll receive a tracking link via email and SMS. You can also track your order in real-time from your Luxéor account under 'My Orders'. For international orders, allow 24–48 hours for the tracking information to activate.",
  },
  {
    title: "Customs & Duties",
    content:
      "International orders may be subject to import duties and taxes levied by the destination country. These charges are the responsibility of the recipient and are not included in our shipping fees. We recommend checking your local customs regulations before placing an international order.",
  },
  {
    title: "Packaging",
    content:
      "Every Luxéor piece arrives in our signature jewellery box, nestled in satin, enclosed in a keepsake outer box with a ribbon seal — ready to gift. We use eco-conscious materials wherever possible without compromising the unboxing experience.",
  },
];

const TableSection = ({ title, rows }) => (
  <Reveal className="mb-10">
    <h3
      className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-4"
      style={{ fontSize: "20px", fontWeight: 600 }}
    >
      {title}
    </h3>
    <div className="overflow-x-auto rounded-lg border border-[#b08850]/15">
      <table className="w-full text-sm font-[family-name:var(--font-jost)]">
        <thead>
          <tr className="bg-[#b08850]/8 border-b border-[#b08850]/15">
            <th className="text-left px-5 py-3 text-[#3d1f10] font-semibold" style={{ letterSpacing: "0.04em", fontSize: "12px" }}>METHOD</th>
            <th className="text-left px-5 py-3 text-[#3d1f10] font-semibold" style={{ letterSpacing: "0.04em", fontSize: "12px" }}>ESTIMATED TIME</th>
            <th className="text-left px-5 py-3 text-[#3d1f10] font-semibold" style={{ letterSpacing: "0.04em", fontSize: "12px" }}>COST</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b border-[#b08850]/10 ${i % 2 === 0 ? "bg-white" : "bg-[#f5efe8]/60"}`}>
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-3.5 text-[#2a1a0e]/75" style={{ fontSize: "13.5px" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Reveal>
);

export default function ShippingScreen() {
  return (
    <div>
      <Navbar />
      <PageHeader
        label="Shipping Policy"
        title="Shipping & Delivery"
        subtitle="White-glove delivery, every time"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Shipping & Delivery" }]}
      />

      <section className="bg-[#f5efe8] py-20">
        <div className="max-w-[860px] mx-auto px-6">
          <Reveal className="mb-12 text-center">
            <p
              className="font-[family-name:var(--font-jost)] uppercase text-[#b08850] mb-3"
              style={{ fontSize: "11px", letterSpacing: "0.35em", fontWeight: 600 }}
            >
              Shipping Policy
            </p>
            <h2
              className="font-[family-name:var(--font-playfair)] text-[#2a1a0e]"
              style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700, lineHeight: 1.25 }}
            >
              Delivered with care
            </h2>
          </Reveal>

          {sections.map((s) =>
            s.rows ? (
              <TableSection key={s.title} title={s.title} rows={s.rows} />
            ) : (
              <Reveal key={s.title} className="mb-10">
                <h3
                  className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-3"
                  style={{ fontSize: "20px", fontWeight: 600 }}
                >
                  {s.title}
                </h3>
                <p
                  className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/65 leading-[1.85]"
                  style={{ fontSize: "14.5px" }}
                >
                  {s.content}
                </p>
              </Reveal>
            )
          )}

          <Reveal
            className="mt-14 rounded-xl p-8 text-center"
            style={{ background: "linear-gradient(135deg,#3d1f10,#1a0e07)", border: "1px solid rgba(176,136,80,0.2)" }}
          >
            <p
              className="font-[family-name:var(--font-jost)] text-[#c9a96e] uppercase mb-2"
              style={{ fontSize: "11px", letterSpacing: "0.3em", fontWeight: 600 }}
            >
              Need Help?
            </p>
            <p className="font-[family-name:var(--font-playfair)] text-white mb-5" style={{ fontSize: "22px", fontWeight: 600 }}>
              Questions about your delivery?
            </p>
            <a
              href="mailto:hello@luxeor.com"
              className="inline-block font-[family-name:var(--font-jost)] text-[#1a0e07] bg-[#b08850] hover:bg-[#c9a96e] transition-colors px-8 py-3 rounded-sm"
              style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em" }}
            >
              CONTACT US
            </a>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
