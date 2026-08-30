import mongoose from "mongoose";

/**
 * A single gallery photo inside the Heritage Craft section.
 * Images are auto-distributed round-robin across the 4 scrolling
 * columns on the frontend, in `sortOrder`.
 */
const heritageImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, trim: true, default: "" },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/**
 * Singleton document powering the homepage "Masterfully crafted in India"
 * section (Components/home/MasterCrafted.jsx). Fully managed from the
 * admin panel — copy + the scrolling image gallery.
 */
const heritageSectionSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, trim: true, default: "Heritage Craft" },

    // Rendered as: "{headingMain} {headingAccent}" — accent is italic/gold
    headingMain: { type: String, trim: true, default: "Masterfully" },
    headingAccent: { type: String, trim: true, default: "crafted in India." },

    buttonLabel: { type: String, trim: true, default: "Explore Now" },
    buttonHref: { type: String, trim: true, default: "/products" },

    images: [heritageImageSchema],
  },
  { timestamps: true }
);

const HeritageSection = mongoose.model("HeritageSection", heritageSectionSchema);
export default HeritageSection;
