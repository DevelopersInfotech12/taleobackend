"use client";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PageHeader from "../Components/PageHeader";
import { Reveal, Stagger, StaggerItem } from "../Components/motion/Reveal";

const sections = [
  { title: "Acceptance of Terms", content: "By accessing or using the Luxéor website, mobile application, or purchasing any product, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of our services immediately." },
  { title: "Eligibility", content: "You must be at least 18 years old to make purchases on Luxéor. By placing an order, you confirm that you are of legal age and have the legal authority to enter into a binding agreement." },
  { title: "Product Information", content: "We strive to display accurate product descriptions, images, and pricing. However, minor variations in colour and texture may occur due to screen settings or handcrafted nature of our pieces. We reserve the right to correct errors without prior notice." },
  { title: "Pricing & Payment", content: "All prices are listed in Indian Rupees (INR) unless otherwise stated. We accept all major credit/debit cards, UPI, net banking, and select wallets. Payment must be made in full at the time of order placement. We use secure, PCI-compliant gateways." },
  { title: "Order Cancellation", content: "Orders may be cancelled within 24 hours of placement, provided they have not been dispatched. To cancel, contact us immediately at hello@luxeor.com. Custom and engraved orders cannot be cancelled once production begins." },
  { title: "Intellectual Property", content: "All content on this website — including images, text, logos, and design — is the exclusive property of Luxéor Fine Jewellery and protected under applicable intellectual property laws. Reproduction without written consent is strictly prohibited." },
  { title: "Limitation of Liability", content: "Luxéor shall not be liable for indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability in any dispute shall not exceed the order value of the product in question." },
  { title: "Governing Law", content: "These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra. We encourage resolution through direct communication before pursuing legal remedies." },
  { title: "Modifications", content: "We reserve the right to modify these terms at any time. Updated terms will be posted on this page with a revised date. Continued use of our services after changes constitutes your acceptance of the new terms." },
];

export default function TermsScreen() {
  return (
    <div>
      <Navbar />
      <PageHeader
        label="Legal"
        title="Terms & Conditions"
        subtitle="Please read before using our services"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]}
      />

      <section className="bg-[#f5efe8] py-20">
        <div className="max-w-[820px] mx-auto px-6">
          <Reveal className="text-center mb-14">
            <p className="font-[family-name:var(--font-jost)] uppercase text-[#b08850] mb-3" style={{ fontSize: "11px", letterSpacing: "0.35em", fontWeight: 600 }}>
              Effective: January 2025
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-4" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700 }}>
              Terms of service
            </h2>
            <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/55 max-w-lg mx-auto" style={{ fontSize: "14.5px", lineHeight: 1.8 }}>
              Please read these terms carefully before using our website or placing an order.
            </p>
          </Reveal>

          <Stagger className="flex flex-col gap-6 mb-10" stagger={0.06}>
            {sections.map((s, i) => (
              <StaggerItem key={s.title} y={16} className="bg-white rounded-xl border border-[#b08850]/10 p-8">
                <div className="flex items-start gap-5">
                  <span className="font-[family-name:var(--font-playfair)] text-[#b08850]/25 shrink-0" style={{ fontSize: "28px", fontWeight: 700, lineHeight: 1 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-3" style={{ fontSize: "17px", fontWeight: 600 }}>
                      {s.title}
                    </h3>
                    <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/60 leading-[1.85]" style={{ fontSize: "14px" }}>
                      {s.content}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="rounded-xl p-8 text-center" style={{ background: "linear-gradient(135deg,#3d1f10,#1a0e07)", border: "1px solid rgba(176,136,80,0.2)" }}>
            <p className="font-[family-name:var(--font-playfair)] text-white mb-2" style={{ fontSize: "20px", fontWeight: 600 }}>
              Have a legal inquiry?
            </p>
            <p className="font-[family-name:var(--font-jost)] text-[#c9a96e]/80 mb-5" style={{ fontSize: "13.5px" }}>
              Contact our legal team directly
            </p>
            <a href="mailto:taleojewels@gmail.com" className="inline-block font-[family-name:var(--font-jost)] text-[#1a0e07] bg-[#b08850] hover:bg-[#c9a96e] transition-colors px-8 py-3 rounded-sm" style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em" }}>
              LEGAL@LUXEOR.COM
            </a>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
