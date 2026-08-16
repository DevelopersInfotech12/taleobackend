"use client";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PageHeader from "../Components/PageHeader";
import { Reveal, Stagger, StaggerItem } from "../Components/motion/Reveal";

const steps = [
  { num: "01", title: "Initiate Return", desc: "Log in to your Luxéor account, go to 'My Orders', select the item and click 'Request Return'. Alternatively, email us at returns@luxeor.com within 15 days of delivery." },
  { num: "02", title: "Pack Securely", desc: "Place the jewellery in its original box and packaging. Include the invoice and a note with your order number. Ensure the piece is unworn, unaltered, and in its original condition." },
  { num: "03", title: "Schedule Pickup", desc: "We'll arrange a doorstep pickup via our courier partner at no charge for domestic returns. For international returns, drop-off at the nearest courier point is required." },
  { num: "04", title: "Inspection & Refund", desc: "Once received, our quality team inspects the piece within 2 business days. Approved refunds are processed within 5–7 business days to your original payment method." },
];

const policy = [
  { q: "What is your return window?", a: "We accept returns within 15 days of delivery for all standard pieces. Custom, engraved, or personalised items are non-returnable unless defective." },
  { q: "What condition must items be in?", a: "Items must be unworn, unaltered, undamaged, and in original packaging with all certificates and tags intact. We reserve the right to reject returns that do not meet these conditions." },
  { q: "Are there non-returnable items?", a: "Custom orders, engraved pieces, resized rings, gift cards, and items marked 'Final Sale' cannot be returned or exchanged." },
  { q: "How are refunds processed?", a: "Refunds go back to your original payment method — UPI, card, or bank account. Store credit is also available as an alternative and is processed within 24 hours of approval." },
  { q: "What about exchanges?", a: "We offer free size exchanges on rings within 30 days. For other exchanges, the original item must be returned before a new order is placed." },
  { q: "Damaged or wrong item?", a: "If you've received a damaged or incorrect piece, contact us within 48 hours of delivery with photos. We'll arrange a priority replacement or full refund at no cost to you." },
];

export default function ReturnsScreen() {
  return (
    <div>
      <Navbar />
      <PageHeader
        label="Returns Policy"
        title="Returns & Exchanges"
        subtitle="Hassle-free returns, always"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Returns & Exchanges" }]}
      />

      <section className="bg-[#f5efe8] py-20">
        <div className="max-w-[960px] mx-auto px-6">

          {/* Header */}
          <Reveal className="text-center mb-16">
            <p className="font-[family-name:var(--font-jost)] uppercase text-[#b08850] mb-3" style={{ fontSize: "11px", letterSpacing: "0.35em", fontWeight: 600 }}>
              Returns Policy
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-4" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700 }}>
              Easy returns in 4 steps
            </h2>
            <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/55 max-w-lg mx-auto" style={{ fontSize: "14.5px", lineHeight: 1.8 }}>
              We want you to love every piece. If something isn't right, we make it simple to return.
            </p>
          </Reveal>

          {/* Steps */}
          <Stagger className="grid md:grid-cols-2 gap-6 mb-20">
            {steps.map((s) => (
              <StaggerItem key={s.num} className="bg-white rounded-xl p-8 border border-[#b08850]/10 hover-lift">
                <div className="font-[family-name:var(--font-playfair)] text-[#b08850]/30 mb-3" style={{ fontSize: "36px", fontWeight: 700 }}>
                  {s.num}
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-3" style={{ fontSize: "18px", fontWeight: 600 }}>
                  {s.title}
                </h3>
                <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/60 leading-[1.8]" style={{ fontSize: "13.5px" }}>
                  {s.desc}
                </p>
              </StaggerItem>
            ))}
          </Stagger>

          {/* FAQ */}
          <div className="mb-16">
            <Reveal as="h2" className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] text-center mb-10" style={{ fontSize: "28px", fontWeight: 700 }}>
              Policy Details
            </Reveal>
            <Stagger className="flex flex-col gap-4" stagger={0.08}>
              {policy.map((item) => (
                <StaggerItem key={item.q} y={16} className="bg-white rounded-lg border border-[#b08850]/10 overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#b08850]/8">
                    <p className="font-[family-name:var(--font-playfair)] text-[#2a1a0e]" style={{ fontSize: "15.5px", fontWeight: 600 }}>
                      {item.q}
                    </p>
                  </div>
                  <div className="px-6 py-4">
                    <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/60 leading-[1.8]" style={{ fontSize: "13.5px" }}>
                      {item.a}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* CTA */}
          <Reveal className="rounded-xl p-8 text-center" style={{ background: "linear-gradient(135deg,#3d1f10,#1a0e07)", border: "1px solid rgba(176,136,80,0.2)" }}>
            <p className="font-[family-name:var(--font-jost)] text-[#c9a96e] uppercase mb-2" style={{ fontSize: "11px", letterSpacing: "0.3em", fontWeight: 600 }}>
              Start a Return
            </p>
            <p className="font-[family-name:var(--font-playfair)] text-white mb-5" style={{ fontSize: "22px", fontWeight: 600 }}>
              Need to return or exchange?
            </p>
            <a href="mailto:returns@luxeor.com" className="inline-block font-[family-name:var(--font-jost)] text-[#1a0e07] bg-[#b08850] hover:bg-[#c9a96e] transition-colors px-8 py-3 rounded-sm" style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em" }}>
              EMAIL US
            </a>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
