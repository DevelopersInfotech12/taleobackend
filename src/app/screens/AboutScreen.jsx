"use client";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import PageHeader from "../Components/PageHeader";
import { Reveal, RevealSide, RevealImage, Stagger, StaggerItem } from "../Components/motion/Reveal";

const values = [
  { icon: "◈", title: "Rarity", desc: "Every stone is hand-selected from conflict-free sources, chosen for cut, clarity, and character." },
  { icon: "◉", title: "Craft", desc: "Our artisans average 18 years of experience. Each piece passes through 14 hands before leaving the atelier." },
  { icon: "◇", title: "Legacy", desc: "We design for heirlooms — pieces that carry meaning across generations, not just seasons." },
  { icon: "◎", title: "Integrity", desc: "Transparent pricing, honest materials, and a guarantee that every piece is exactly what we say it is." },
];

const timeline = [
  { year: "2008", event: "Founded in Mumbai by master goldsmith Aryan Mehta, Luxéor began as a single atelier in Zaveri Bazaar." },
  { year: "2012", event: "Launched the inaugural Signature Collection — 12 pieces, sold out in 3 days. The waiting list still runs 6 months." },
  { year: "2016", event: "Expanded to 5 flagship stores across India. Named 'Best Fine Jewellery Brand' by Vogue India." },
  { year: "2020", event: "Went digital — bringing the atelier experience online with virtual try-ons and personalised consultations." },
  { year: "2024", event: "Now serving 40+ countries. Still hand-crafting every piece in our original Mumbai studio." },
];

const craftSteps = [
  { num: "01", title: "Design", desc: "Every collection begins with hand-drawn sketches. Our designers spend weeks refining proportions before a single mold is cast." },
  { num: "02", title: "Stone Selection", desc: "Gemologists hand-select each stone from certified suppliers, evaluating colour, cut, clarity, and carat under 10x magnification." },
  { num: "03", title: "Setting & Casting", desc: "Metal is alloyed to our precise specifications, cast using lost-wax technique, and set stone-by-stone by hand." },
  { num: "04", title: "Finishing", desc: "Each piece undergoes 6 stages of hand polishing. Final quality inspection covers 47 checkpoints before approval." },
];

export default function AboutScreen() {
  return (
    <div>
      <Navbar />
      <PageHeader
        label="Our Story"
        title="About Luxéor"
        subtitle="Crafted with passion, precision, and purpose"
        breadcrumb={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* Story Section */}
      <section className="bg-[#f5efe8] py-24">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <RevealSide from="left">
              <p className="font-[family-name:var(--font-jost)] uppercase text-[#b08850] mb-4" style={{ fontSize: "11px", letterSpacing: "0.35em", fontWeight: 600 }}>
                Our Story
              </p>
              <h2 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-6" style={{ fontSize: "clamp(30px,4vw,44px)", fontWeight: 700, lineHeight: 1.2 }}>
                Jewellery with a soul
              </h2>
              <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/60 leading-[1.9] mb-5" style={{ fontSize: "14.5px" }}>
                Luxéor was founded on a single conviction: that fine jewellery should feel like an inheritance, not a purchase. Each piece we make carries the weight of intention — conceived by designers who study ancient goldsmithing techniques, executed by artisans who treat every millimetre as a moral question.
              </p>
              <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/60 leading-[1.9]" style={{ fontSize: "14.5px" }}>
                We don't follow trends. We follow the logic of beauty — what endures, what illuminates, what speaks without saying a word.
              </p>
            </RevealSide>
            <RevealSide from="right" delay={0.1} className="relative">
              <RevealImage>
                <img
                  src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=85&fit=crop"
                  alt="Craftsmanship"
                  className="rounded-xl w-full object-cover"
                  style={{ height: "420px" }}
                />
              </RevealImage>
              <div className="absolute -bottom-6 -left-6 bg-[#1a0e07] rounded-xl px-7 py-5 border border-[#b08850]/20">
                <p className="font-[family-name:var(--font-playfair)] text-[#c9a96e]" style={{ fontSize: "32px", fontWeight: 700 }}>16+</p>
                <p className="font-[family-name:var(--font-jost)] text-white/50" style={{ fontSize: "11px", letterSpacing: "0.08em" }}>YEARS OF CRAFT</p>
              </div>
            </RevealSide>
          </div>

          {/* Values */}
          <div className="mb-24">
            <Reveal className="text-center mb-12">
              <p className="font-[family-name:var(--font-jost)] uppercase text-[#b08850] mb-3" style={{ fontSize: "11px", letterSpacing: "0.35em", fontWeight: 600 }}>What We Stand For</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e]" style={{ fontSize: "32px", fontWeight: 700 }}>Our values</h2>
            </Reveal>
            <Stagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((v) => (
                <StaggerItem key={v.title} className="bg-white rounded-xl p-7 border border-[#b08850]/10 text-center hover-lift">
                  <div className="text-[#b08850] mb-4" style={{ fontSize: "28px" }}>{v.icon}</div>
                  <h3 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-3" style={{ fontSize: "17px", fontWeight: 600 }}>{v.title}</h3>
                  <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/55 leading-[1.75]" style={{ fontSize: "13px" }}>{v.desc}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          {/* Timeline */}
          <div className="mb-24">
            <Reveal className="text-center mb-12">
              <p className="font-[family-name:var(--font-jost)] uppercase text-[#b08850] mb-3" style={{ fontSize: "11px", letterSpacing: "0.35em", fontWeight: 600 }}>Our Journey</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e]" style={{ fontSize: "32px", fontWeight: 700 }}>Sixteen years in the making</h2>
            </Reveal>
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#b08850]/15 hidden md:block" style={{ transform: "translateX(-50%)" }} />
              <div className="flex flex-col gap-10">
                {timeline.map((t, i) => (
                  <Reveal key={t.year} y={22} className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <div className="bg-white rounded-xl border border-[#b08850]/10 p-6 hover-lift">
                        <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/60 leading-[1.75]" style={{ fontSize: "13.5px" }}>{t.event}</p>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-[#1a0e07] border-2 border-[#b08850] flex items-center justify-center shrink-0 z-10">
                      <span className="font-[family-name:var(--font-playfair)] text-[#c9a96e]" style={{ fontSize: "12px", fontWeight: 700 }}>{t.year}</span>
                    </div>
                    <div className="flex-1" />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          {/* Craftsmanship anchor section */}
          <div id="craft" className="scroll-mt-24">
            <Reveal className="text-center mb-12">
              <p className="font-[family-name:var(--font-jost)] uppercase text-[#b08850] mb-3" style={{ fontSize: "11px", letterSpacing: "0.35em", fontWeight: 600 }}>Craftsmanship</p>
              <h2 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-4" style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: 700 }}>
                Made by hand, made to last
              </h2>
              <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/55 max-w-xl mx-auto" style={{ fontSize: "14.5px", lineHeight: 1.85 }}>
                Every Luxéor piece passes through the same four stages — a process unchanged since our founding, because some things should never be rushed.
              </p>
            </Reveal>
            <Stagger className="grid sm:grid-cols-2 gap-6 mb-14">
              {craftSteps.map((s) => (
                <StaggerItem key={s.num} className="bg-white rounded-xl p-8 border border-[#b08850]/10 flex gap-6 hover-lift">
                  <span className="font-[family-name:var(--font-playfair)] text-[#b08850]/25 shrink-0" style={{ fontSize: "36px", fontWeight: 700, lineHeight: 1 }}>{s.num}</span>
                  <div>
                    <h3 className="font-[family-name:var(--font-playfair)] text-[#2a1a0e] mb-2" style={{ fontSize: "17px", fontWeight: 600 }}>{s.title}</h3>
                    <p className="font-[family-name:var(--font-jost)] text-[#2a1a0e]/55 leading-[1.8]" style={{ fontSize: "13px" }}>{s.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Stagger className="grid grid-cols-3 gap-4">
              {[
                "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80&fit=crop",
                "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80&fit=crop",
                "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=600&q=80&fit=crop",
              ].map((src, i) => (
                <StaggerItem key={i}>
                  <RevealImage>
                    <img src={src} alt="Craft" className="rounded-xl object-cover w-full" style={{ height: "220px" }} />
                  </RevealImage>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
