import mongoose from "mongoose";

/**
 * A single slide ("chapter") of the homepage hero carousel.
 * Fully managed from the admin panel — image + all copy.
 */
const heroSlideSchema = new mongoose.Schema(
  {
    // Small parent-category tag above the eyebrow, e.g. "VIRSA"
    category: { type: String, trim: true, default: "" },

    // Pill eyebrow, e.g. "Chapter 01 — III"
    chapter: { type: String, trim: true, default: "" },

    // Big serif headline, e.g. "Mehfil"
    title: { type: String, required: true, trim: true },

    // Italic one-liner under the title
    tagline: { type: String, trim: true, default: "" },

    // Main paragraph
    body: { type: String, trim: true, default: "" },

    // Optional italic closing line (used on the intro slide)
    footnote: { type: String, trim: true, default: "" },

    // Desktop background image (Cloudinary URL)
    image: { type: String, default: "" },

    // Mobile background image (Cloudinary URL) — falls back to `image` if blank
    mobileImage: { type: String, default: "" },

    ctaLabel: { type: String, trim: true, default: "" },
    ctaHref: { type: String, trim: true, default: "/" },

    // ── Mobile overrides ──
    // Each falls back to its desktop counterpart above when left blank.
    // Lets admins run shorter copy on small screens without a second slide.
    mobileCategory: { type: String, trim: true, default: "" },
    mobileChapter: { type: String, trim: true, default: "" },
    mobileTitle: { type: String, trim: true, default: "" },
    mobileTagline: { type: String, trim: true, default: "" },
    mobileBody: { type: String, trim: true, default: "" },
    mobileFootnote: { type: String, trim: true, default: "" },
    mobileCtaLabel: { type: String, trim: true, default: "" },
    mobileCtaHref: { type: String, trim: true, default: "" },

    // Intro slide = bigger title, no eyebrow, outlined CTA, left rule
    isIntro: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

heroSlideSchema.index({ sortOrder: 1, createdAt: 1 });

const HeroSlide = mongoose.model("HeroSlide", heroSlideSchema);
export default HeroSlide;
