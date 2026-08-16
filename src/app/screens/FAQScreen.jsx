"use client";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PageHeader from "../Components/PageHeader";
import { Reveal, Stagger, StaggerItem } from "../Components/motion/Reveal";

const faqData = [
  {
    category: "Orders & Payments",
    items: [
      { q: "How do I place an order?", a: "Browse our collections, select your size and quantity, and click 'Add to Cart'. Proceed to checkout, enter your shipping details, and complete payment. You'll receive a confirmation email immediately." },
      { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards (Visa, Mastercard, Amex), UPI (GPay, PhonePe, Paytm), net banking, and EMI on eligible purchases above ₹5,000." },
      { q: "Can I modify or cancel my order?", a: "Orders can be modified or cancelled within 24 hours of placement. Contact us immediately at hello@luxeor.com. Once dispatched, orders cannot be cancelled." },
      { q: "Is my payment secure?", a: "Yes. All transactions are encrypted via TLS and processed through PCI-DSS compliant gateways. We never store your card details." },
      { q: "Do you offer EMI options?", a: "Yes, EMI is available on orders above ₹5,000 for eligible cards. Select 'Pay via EMI' at checkout and choose your tenure (3, 6, 9, or 12 months)." },
    ],
  },
  {
    category: "Products & Quality",
    items: [
      { q: "What gold purity do you use?", a: "Our pieces are crafted in 18kt, 22kt, and 24kt gold depending on the design. Each product page specifies the purity. All gold is hallmarked and BIS certified." },
      { q: "Are your gemstones certified?", a: "Yes. All gemstones above 0.50 carats come with GIA or IGI certification. Certificates are included in your packaging." },
      { q: "Do you offer custom or engraved pieces?", a: "Absolutely. Contact us at custom@luxeor.com to discuss your requirements. Custom orders typically take 3–6 weeks. Engraving is available on most pieces for ₹499–₹999." },
      { q: "How do I find my ring size?", a: "Use our free Ring Size Guide under the 'Help' section. You can also order our free ring sizer kit, or visit any of our flagship stores for a professional sizing." },
    ],
  },
  {
    category: "Shipping & Delivery",
    items: [
      { q: "How long will my order take?", a: "Standard domestic delivery takes 5–7 business days. Express delivery is available in 2–3 business days. International orders take 7–15 business days depending on destination." },
      { q: "Is my jewellery insured during shipping?", a: "Yes. All Luxéor shipments are fully insured for their purchase value. In the rare event of loss or damage in transit, we will replace the piece or issue a full refund." },
      { q: "Do you ship internationally?", a: "Yes, we ship to 40+ countries. International shipping starts at ₹799. Customs duties and import taxes are the buyer's responsibility." },
      { q: "How do I track my order?", a: "You'll receive a tracking link via SMS and email once your order ships. You can also track from 'My Orders' in your account." },
    ],
  },
  {
    category: "Returns & Warranty",
    items: [
      { q: "What is your return policy?", a: "We accept returns within 15 days of delivery for unworn, unaltered pieces in original packaging. Custom and engraved items are non-returnable." },
      { q: "Do your pieces come with a warranty?", a: "All Luxéor pieces come with a 1-year manufacturing defect warranty. This covers structural issues but not damage from wear, mishandling, or resizing." },
      { q: "Do you offer jewellery repairs?", a: "Yes. We offer repair, rhodium plating, and restoration services. Bring your piece to any flagship store or contact us at repairs@luxeor.com." },
      { q: "How are refunds processed?", a: "Approved refunds are credited to your original payment method within 5–7 business days. Store credit is processed within 24 hours." },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border border-[#b08850]/12 rounded-lg overflow-hidden transition-all duration-200 ${open ? "bg-white" : "bg-white/60"}`}>
      <button
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
        onClick={() => setOpen(!open)}
      >
        <span className="font-[family-name:var(--font-jost)] text-[#2a1a0e]" style={{ fontSize: "14.5px", fontWeight: 500, lineHeight: 1.45 }}>{q}</span>
        <span className={`text-[#b08850] shrink-0 transition-transform duration-200 ${open ? "rotate-45" : ""}`} style={{ fontSize: "22px", lineHeight: 1 }}>+</span>
      </button>
      {open && (
        <div className="px-6 pb-5 border-t border-[#b08850]/8">
          <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/60 leading-[1.85] pt-4" style={{ fontSize: "13.5px" }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQScreen() {
  return (
    <div>
      <Navbar />
      <PageHeader
        label="Help Center"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <section className="bg-[#f5efe8] py-20">
        <div className="max-w-[860px] mx-auto px-6">
          <Reveal className="text-center mb-14">
            <p className="font-[family-name:var(--font-jost)] uppercase text-[#b08850] mb-3" style={{ fontSize: "11px", letterSpacing: "0.35em", fontWeight: 600 }}>Frequently Asked Questions</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e]" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700 }}>
              We've got answers
            </h2>
          </Reveal>

          <div className="flex flex-col gap-12">
            {faqData.map((section, si) => (
              <Reveal key={section.category} delay={si * 0.05}>
                <h3 className="font-[family-name:var(--font-jost)] uppercase text-[#b08850] mb-5" style={{ fontSize: "11px", letterSpacing: "0.3em", fontWeight: 600 }}>
                  {section.category}
                </h3>
                <Stagger className="flex flex-col gap-3" stagger={0.06}>
                  {section.items.map((item) => (
                    <StaggerItem key={item.q} y={16}>
                      <FAQItem q={item.q} a={item.a} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16 rounded-xl p-8 text-center" style={{ background: "linear-gradient(135deg,#3d1f10,#1a0e07)", border: "1px solid rgba(176,136,80,0.2)" }}>
            <p className="font-[family-name:var(--font-playfair)] text-white mb-2" style={{ fontSize: "22px", fontWeight: 600 }}>Still have questions?</p>
            <p className="font-[family-name:var(--font-jost)] text-[#c9a96e]/80 mb-6" style={{ fontSize: "13.5px" }}>Our team responds within 2 business hours</p>
            <a href="mailto:hello@luxeor.com" className="inline-block font-[family-name:var(--font-jost)] text-[#1a0e07] bg-[#b08850] hover:bg-[#c9a96e] transition-colors px-8 py-3 rounded-sm" style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em" }}>
              CONTACT SUPPORT
            </a>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
