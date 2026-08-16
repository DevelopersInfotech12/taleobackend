"use client";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PageHeader from "../Components/PageHeader";
import { Reveal, Stagger, StaggerItem } from "../Components/motion/Reveal";

const sections = [
  {
    title: "Information We Collect",
    content: `When you create an account, place an order, or contact us, we collect personal information including your name, email address, phone number, shipping address, and payment details. We also collect browsing data, device information, and purchase history to improve your experience on our platform.`,
  },
  {
    title: "How We Use Your Information",
    content: `Your data is used to process and fulfill orders, send order confirmations and shipping updates, provide customer support, personalise your shopping experience, send marketing communications (with your consent), prevent fraud, and comply with legal obligations.`,
  },
  {
    title: "Sharing Your Information",
    content: `We do not sell your personal data. We share it only with trusted service providers — payment processors, courier partners, and analytics tools — who are bound by confidentiality agreements. We may disclose data if required by law or to protect our rights and customers.`,
  },
  {
    title: "Cookies & Tracking",
    content: `We use cookies and similar technologies to remember your preferences, track your cart, measure site performance, and display relevant advertisements. You can manage cookie preferences through your browser settings. Disabling certain cookies may affect site functionality.`,
  },
  {
    title: "Data Security",
    content: `All data is encrypted in transit using TLS. Payment information is processed by PCI-DSS compliant gateways and is never stored on our servers. We conduct regular security audits and limit employee access to personal data on a need-to-know basis.`,
  },
  {
    title: "Your Rights",
    content: `You have the right to access, correct, or delete your personal data at any time. You may also opt out of marketing communications, request data portability, or withdraw consent for processing. To exercise any of these rights, email us at privacy@luxeor.com.`,
  },
  {
    title: "Data Retention",
    content: `We retain your personal data for as long as your account is active or as needed to fulfil the purposes outlined in this policy. Order records are retained for 7 years for tax and legal compliance. You can request earlier deletion of your account data.`,
  },
  {
    title: "Children's Privacy",
    content: `Our services are not directed at individuals under 18 years of age. We do not knowingly collect personal information from minors. If we become aware that a child has provided us with personal data, we will delete it promptly.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy periodically. Material changes will be communicated via email or a prominent notice on our site. Your continued use of our services after changes take effect constitutes your acceptance of the updated policy.`,
  },
];

export default function PrivacyScreen() {
  return (
    <div>
      <Navbar />
      <PageHeader
        label="Legal"
        title="Privacy Policy"
        subtitle="Your data, your trust"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
      />

      <section className="bg-[#f5efe8] py-20">
        <div className="max-w-[820px] mx-auto px-6">
          <Reveal className="text-center mb-14">
            <p className="font-[family-name:var(--font-jost)] uppercase text-[#b08850] mb-3" style={{ fontSize: "11px", letterSpacing: "0.35em", fontWeight: 600 }}>
              Last updated: January 2025
            </p>
            <h2 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-4" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700 }}>
              How we handle your data
            </h2>
            <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/55 max-w-lg mx-auto" style={{ fontSize: "14.5px", lineHeight: 1.8 }}>
              At Luxéor, we are committed to protecting your privacy and ensuring your personal data is handled with the utmost care.
            </p>
          </Reveal>

          <Reveal className="bg-white rounded-xl border border-[#b08850]/10 overflow-hidden mb-10">
            {sections.map((s, i) => (
              <div key={s.title} className={`px-8 py-7 ${i < sections.length - 1 ? "border-b border-[#b08850]/8" : ""}`}>
                <h3 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-3" style={{ fontSize: "18px", fontWeight: 600 }}>
                  {i + 1}. {s.title}
                </h3>
                <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/60 leading-[1.85]" style={{ fontSize: "14px" }}>
                  {s.content}
                </p>
              </div>
            ))}
          </Reveal>

          <Reveal className="rounded-xl p-8 text-center" style={{ background: "linear-gradient(135deg,#3d1f10,#1a0e07)", border: "1px solid rgba(176,136,80,0.2)" }}>
            <p className="font-[family-name:var(--font-playfair)] text-white mb-2" style={{ fontSize: "20px", fontWeight: 600 }}>
              Questions about your privacy?
            </p>
            <p className="font-[family-name:var(--font-jost)] text-[#c9a96e]/80 mb-5" style={{ fontSize: "13.5px" }}>
              Reach out to our data protection team
            </p>
            <a href="mailto:privacy@luxeor.com" className="inline-block font-[family-name:var(--font-jost)] text-[#1a0e07] bg-[#b08850] hover:bg-[#c9a96e] transition-colors px-8 py-3 rounded-sm" style={{ fontSize: "13px", fontWeight: 600, letterSpacing: "0.08em" }}>
              PRIVACY@LUXEOR.COM
            </a>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
