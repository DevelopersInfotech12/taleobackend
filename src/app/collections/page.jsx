import Link from "next/link";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import OtherHero from "../Components/OtherHero";

const cols = [
  { slug: "signature-collection", title: "Signature Collection", desc: "Our most iconic pieces — endlessly coveted.", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=80&fit=crop" },
  { slug: "bridal-collection", title: "Bridal Collection", desc: "For the most important chapter of your story.", img: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=700&q=80&fit=crop" },
  { slug: "eternal-collection", title: "Eternal Collection", desc: "Timeless forms for every generation.", img: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=80&fit=crop" },
  { slug: "limited-edition", title: "Limited Edition", desc: "Rare by design. Gone when they're gone.", img: "https://images.unsplash.com/photo-1573408301185-9519f94a74a9?w=700&q=80&fit=crop" },
];

export default function CollectionsPage() {
  return (
    <div>
      <Navbar />
      <OtherHero
        title="Collections"
        subtitle="Each one a distinct world"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Collections" }]}
        desktopImages={[
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&fit=crop",
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80&fit=crop",
          "https://images.unsplash.com/photo-1573408301185-9519f94a74a9?w=1600&q=80&fit=crop",
        ]}
        mobileImages={[
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&fit=crop&crop=center",
          "https://images.unsplash.com/photo-1573408301185-9519f94a74a9?w=800&q=80&fit=crop&crop=center",
        ]}
      />
      <section className="bg-[#f5efe8] py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <p className="font-[family-name:var(--font-jost)] uppercase text-[#b08850] mb-3" style={{ fontSize: "11px", letterSpacing: "0.35em", fontWeight: 600 }}>Our Collections</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e]" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700 }}>Four worlds, one standard</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {cols.map(c => (
              <Link key={c.slug} href={`/collections/${c.slug}`} className="group bg-white rounded-2xl overflow-hidden border border-[#b08850]/10 hover-lift flex flex-col">
                <div className="overflow-hidden">
                  <img src={c.img} alt={c.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ height: "300px" }} />
                </div>
                <div className="p-8">
                  <h3 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-2" style={{ fontSize: "22px", fontWeight: 700 }}>{c.title}</h3>
                  <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/55 mb-5" style={{ fontSize: "14px" }}>{c.desc}</p>
                  <span className="font-[family-name:var(--font-jost)] uppercase text-[#b08850]" style={{ fontSize: "11px", letterSpacing: "0.2em", fontWeight: 600 }}>
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
