import mongoose from "mongoose";

/**
 * A single slide of the Products page hero carousel
 * (Components/OtherHero.jsx, shown on /products).
 * Fully managed from the admin panel — image + all copy.
 */
const productHeroSlideSchema = new mongoose.Schema(
  {
    // Small gold uppercase tag shown above the heading, e.g. "Necklaces"
    collection: { type: String, trim: true, default: "" },

    // Big serif headline. Use a line break for a two-line heading,
    // e.g. "The Art\nof Gold"
    heading: { type: String, required: true, trim: true },

    // Small uppercase line under the heading, e.g. "Necklaces · Hand-forged in 22k"
    meta: { type: String, trim: true, default: "" },

    // Body paragraph
    description: { type: String, trim: true, default: "" },

    ctaLabel: { type: String, trim: true, default: "" },
    ctaHref: { type: String, trim: true, default: "/products" },

    // Desktop background image (Cloudinary URL)
    image: { type: String, default: "" },

    // Mobile background image (Cloudinary URL) — falls back to `image` if blank
    mobileImage: { type: String, default: "" },

    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productHeroSlideSchema.index({ sortOrder: 1, createdAt: 1 });

const ProductHeroSlide = mongoose.model("ProductHeroSlide", productHeroSlideSchema);
export default ProductHeroSlide;
