import mongoose from "mongoose";

/**
 * A single slide of the homepage promo slider
 * (Components/home/BannerAdd.jsx — the "TALEO Presents / Under 30k" banner).
 * All copy is baked into the image itself, so this only manages the
 * image(s), an optional click-through link, and ordering.
 */
const promoBannerSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // desktop banner (Cloudinary URL)
    mobileImage: { type: String, default: "" }, // falls back to `image` if blank
    href: { type: String, trim: true, default: "" }, // optional click-through link
    alt: { type: String, trim: true, default: "" },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

promoBannerSchema.index({ sortOrder: 1, createdAt: 1 });

const PromoBanner = mongoose.model("PromoBanner", promoBannerSchema);
export default PromoBanner;
