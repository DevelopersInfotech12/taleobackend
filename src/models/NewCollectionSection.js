import mongoose from "mongoose";

const newCollectionSectionSchema = new mongoose.Schema(
    {
        image: { type: String, default: "" },
        imageAlt: { type: String, trim: true, default: "Eternal Beauty jewellery" },
        eyebrow: { type: String, trim: true, default: "New Collection · 2025" },
        headingMain: { type: String, trim: true, default: "Eternal" },
        headingAccent: { type: String, trim: true, default: "Beauty." },
        body: {
            type: String,
            trim: true,
            default:
                "Each piece cast in 22k chocolate gold, stone-set by hand in batches of forty. Created in limited numbers to preserve exclusivity and craftsmanship. Every detail is meticulously finished by skilled artisans, ensuring exceptional quality. Designed to be treasured today and passed down for generations.",
        },
        pills: { type: [String], default: ["22k Gold", "Hand-set stones", "40 pieces only"] },
        primaryButtonLabel: { type: String, trim: true, default: "Discover Now" },
        primaryButtonHref: { type: String, trim: true, default: "/collections/eternal-beauty" },
        secondaryButtonLabel: { type: String, trim: true, default: "Browse all →" },
        secondaryButtonHref: { type: String, trim: true, default: "/collections" },
    },
    { timestamps: true }
);

const NewCollectionSection = mongoose.model("NewCollectionSection", newCollectionSectionSchema);
export default NewCollectionSection;