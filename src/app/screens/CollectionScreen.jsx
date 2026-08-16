"use client";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import OtherHero from "../Components/OtherHero";
import ShopPage from "../Components/shop/ShopPage";
import { Reveal } from "../Components/motion/Reveal";

const collectionData = {
  "signature-collection": {
    title: "Signature Collection",
    subtitle: "Our most iconic pieces — endlessly coveted",
    slug: "signature-collection",
    desc: "The Signature Collection represents the essence of Luxéor — bold enough to be noticed, refined enough to be worn forever. These are the pieces our customers return to year after year.",
    desktopImages: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80&fit=crop",
    ],
    mobileImages: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80&fit=crop&crop=center",
    ],
  },
  "bridal-collection": {
    title: "Bridal Collection",
    subtitle: "For the most important chapter of your story",
    slug: "bridal-collection",
    desc: "Designed for the moments that last a lifetime. Our Bridal Collection brings together heirloom-grade craftsmanship, ethically sourced diamonds, and designs that honour every tradition — or start a new one.",
    desktopImages: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=1600&q=80&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&fit=crop",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=1600&q=80&fit=crop",
    ],
    mobileImages: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800&q=80&fit=crop&crop=center",
    ],
  },
  "eternal-collection": {
    title: "Eternal Collection",
    subtitle: "Timeless forms for every generation",
    slug: "eternal-collection",
    desc: "The Eternal Collection is our answer to fast fashion — pieces built on geometry and proportion rather than trend. Simple enough to wear every day, considered enough to pass down.",
    desktopImages: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1600&q=80&fit=crop",
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=1600&q=80&fit=crop",
    ],
    mobileImages: [
      "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80&fit=crop&crop=center",
    ],
  },
  "limited-edition": {
    title: "Limited Edition",
    subtitle: "Rare by design. Gone when they're gone.",
    slug: "limited-edition",
    desc: "Each Limited Edition release is produced in quantities of 20–50 pieces. Once sold, they're retired forever. These are for collectors — people who understand that scarcity is part of the beauty.",
    desktopImages: [
      "https://images.unsplash.com/photo-1573408301185-9519f94a74a9?w=1600&q=80&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80&fit=crop",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80&fit=crop",
    ],
    mobileImages: [
      "https://images.unsplash.com/photo-1573408301185-9519f94a74a9?w=800&q=80&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80&fit=crop&crop=center",
    ],
  },
};

export default function CollectionScreen({ collectionSlug }) {
  const data = collectionData[collectionSlug] || collectionData["signature-collection"];

  return (
    <div>
      <Navbar />
      <OtherHero
        title={data.title}
        subtitle={data.subtitle}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Collections", href: "/collections" }, { label: data.title }]}
        desktopImages={data.desktopImages}
        mobileImages={data.mobileImages}
      />

      {/* Collection description banner */}
      <div style={{ background: "linear-gradient(135deg,#1a0e07,#3d1f10)", borderBottom: "1px solid rgba(176,136,80,0.12)" }}>
        <Reveal className="max-w-[700px] mx-auto px-6 py-10 text-center">
          <p className="font-[family-name:var(--font-jost)] text-[#e8d5b0]/60 leading-[1.85]" style={{ fontSize: "14.5px" }}>
            {data.desc}
          </p>
        </Reveal>
      </div>

      <ShopPage collectionSlug={data.slug} />
      <Footer />
    </div>
  );
}
