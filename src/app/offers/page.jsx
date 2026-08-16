import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import OtherHero from "../Components/OtherHero";

export default function OffersPage() {
  return (
    <div>
      <Navbar />
      <OtherHero
        title="Offers"
        subtitle="Exclusive deals on fine jewellery"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Offers" }]}
        desktopImages={[
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&fit=crop",
        ]}
        mobileImages={[
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&fit=crop",
        ]}
      />
      <section className="bg-[#f5efe8] py-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <p className="font-[family-name:var(--font-jost)] text-[#b08850] uppercase mb-4"
            style={{ fontSize: "11px", letterSpacing: "0.35em", fontWeight: 600 }}>
            Special Offers
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e]"
            style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700 }}>
            Coming Soon
          </h2>
          <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/60 mt-4">
            Exclusive offers will be available here soon.
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}