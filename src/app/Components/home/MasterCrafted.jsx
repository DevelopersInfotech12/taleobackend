"use client";

import { Reveal, RevealSide } from "../motion/Reveal";

const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const BODY = "'Inter', sans-serif";

const col1Images = [
    { src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", alt: "Diamond pendant" },
    { src: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80", alt: "Gemstone necklace" },
    { src: "./master2.png", alt: "Floral ring" },
    { src: "./master1.png", alt: "Gold cuff" },
    { src: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80", alt: "Gold hoops" },
    { src: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=600&q=80", alt: "Layered necklaces" },
    { src: "./other.png", alt: "Diamond ring" },
    { src: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80", alt: "Jewellery flat lay" },
];

const col2Images = [
    { src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", alt: "Pearl necklace" },
    { src: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=600&q=80", alt: "Kundan brooch" },
    { src: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&q=80", alt: "Gold bracelet" },
    { src: "https://images.unsplash.com/photo-1561828995-aa79a2db86dd?w=600&q=80", alt: "Sapphire earrings" },
    { src: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80", alt: "Pearl studs" },
    { src: "https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=600&q=80", alt: "Gold ring" },
    { src: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=600&q=80", alt: "Emerald pendant" },
    { src: "https://images.unsplash.com/photo-1598560917807-1bae44bd2be8?w=600&q=80", alt: "Vintage brooch" },
];

const col3Images = [
    { src: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80", alt: "Gold chain" },
    { src: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&q=80", alt: "Diamond studs" },
    { src: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600&q=80", alt: "Ruby ring" },
    { src: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80", alt: "Gold bangles" },
    { src: "https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=600&q=80", alt: "Necklace set" },
    { src: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=80", alt: "Statement earrings" },
    { src: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80", alt: "Bridal set" },
    { src: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=600&q=80", alt: "Pendant close up" },
];

const col4Images = [
    { src: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80", alt: "Bridal set" },
    { src: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80", alt: "Gold bangles" },
    { src: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&q=80", alt: "Diamond studs" },
    { src: "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=600&q=80", alt: "Statement earrings" },
    { src: "https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=600&q=80", alt: "Necklace set" },
    { src: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600&q=80", alt: "Ruby ring" },
    { src: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=600&q=80", alt: "Pendant close up" },
    { src: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80", alt: "Gemstone necklace" },
];

const track1 = [...col1Images, ...col1Images];
const track2 = [...col2Images, ...col2Images];
const track3 = [...col3Images, ...col3Images];
const track4 = [...col4Images, ...col4Images];

const IMG_HEIGHT = 280;
const GAP = 12;
const TOTAL1 = col1Images.length * (IMG_HEIGHT + GAP);
const TOTAL3 = col3Images.length * (IMG_HEIGHT + GAP);

export default function MasterCrafted() {
    return (
        <section
            style={{ fontFamily: BODY }}
            className="relative w-full px-4 sm:px-8 py-5 sm:py-8 overflow-hidden bg-[#faf7f2] transition-colors duration-300"
        >
            <style>{`
        @keyframes scrollUp {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-${TOTAL1}px); }
        }
        @keyframes scrollDown {
          0%   { transform: translateY(-${TOTAL1}px); }
          100% { transform: translateY(0); }
        }
        @keyframes scrollUp3 {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-${TOTAL3}px); }
        }
        .col-up   { animation: scrollUp   ${col1Images.length * 3}s linear infinite; }
        .col-down { animation: scrollDown ${col2Images.length * 3}s linear infinite; }
        .col-up3  { animation: scrollUp3  ${col3Images.length * 3}s linear infinite; }
        .col-down4 { animation: scrollDown ${col4Images.length * 3}s linear infinite; }
      `}</style>

            <div className="max-w-7xl mx-auto">

                {/* Small eyebrow + headline, no repeated category cards */}
                <div className="flex items-end justify-between flex-wrap gap-3 mb-4 sm:mb-6">
                    <RevealSide from="left">
                        <div className="flex items-center gap-3 mb-2">
                            <span style={{ display: "block", width: 24, height: 1 }} className="bg-[#a67c2e] dark:bg-[#c9a96e]" />
                            <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 700, letterSpacing: "0.32em", textTransform: "uppercase" }} className="text-[#a67c2e] dark:text-[#c9a96e]">
                                Heritage Craft
                            </span>
                        </div>
                        <h2 style={{ fontFamily: DISPLAY, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, lineHeight: 1, margin: 0, letterSpacing: "-0.02em" }} className="text-[#2c2c2c] dark:text-[#e8d9c4]">
                            Masterfully <span style={{ fontWeight: 400, fontStyle: "italic", color: "#a67c2e" }}>crafted in India.</span>
                        </h2>
                    </RevealSide>
                    <Reveal as="button" delay={0.15}
                        className="bg-[#1a0c06] dark:bg-[#c9a96e] text-[#fff]"
                        style={{ fontFamily: BODY, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, borderRadius: 4, padding: "11px 22px", border: "none", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 10 }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Explore Now
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </Reveal>
                </div>

                {/* Full-width gallery — four auto-scrolling columns, no category labels */}
                <div className="flex gap-3" style={{ height: "80vh", overflow: "hidden" }}>

                    <div className="flex-1 overflow-hidden">
                        <div className="col-up flex flex-col" style={{ gap: `${GAP}px` }}>
                            {track1.map((img, i) => (
                                <div key={i} style={{ width: "100%", height: `${IMG_HEIGHT}px`, flexShrink: 0, borderRadius: 6, overflow: "hidden" }}>
                                    <img src={img.src} alt={img.alt}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <div className="col-down flex flex-col" style={{ gap: `${GAP}px` }}>
                            {track2.map((img, i) => (
                                <div key={i} style={{ width: "100%", height: `${IMG_HEIGHT}px`, flexShrink: 0, borderRadius: 6, overflow: "hidden" }}>
                                    <img src={img.src} alt={img.alt}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden hidden sm:block">
                        <div className="col-up3 flex flex-col" style={{ gap: `${GAP}px` }}>
                            {track3.map((img, i) => (
                                <div key={i} style={{ width: "100%", height: `${IMG_HEIGHT}px`, flexShrink: 0, borderRadius: 6, overflow: "hidden" }}>
                                    <img src={img.src} alt={img.alt}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden hidden lg:block">
                        <div className="col-down4 flex flex-col" style={{ gap: `${GAP}px` }}>
                            {track4.map((img, i) => (
                                <div key={i} style={{ width: "100%", height: `${IMG_HEIGHT}px`, flexShrink: 0, borderRadius: 6, overflow: "hidden" }}>
                                    <img src={img.src} alt={img.alt}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}