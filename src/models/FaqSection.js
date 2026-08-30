import mongoose from "mongoose";

const faqItemSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/**
 * Singleton document powering the homepage FAQ section
 * (Components/home/Faq.jsx). Fully managed from the admin panel.
 */
const faqSectionSchema = new mongoose.Schema(
  {
    eyebrow: { type: String, trim: true, default: "Got Questions" },
    headingMain: { type: String, trim: true, default: "Frequently" },
    headingAccent: { type: String, trim: true, default: "asked" },
    subtitle: { type: String, trim: true, default: "Everything you need to know before your purchase." },
    badgeText: { type: String, trim: true, default: "Doubts? Ask TALEO." },
    image: { type: String, default: "" }, // side photo — falls back to the built-in default if blank

    items: [faqItemSchema],
  },
  { timestamps: true }
);

const FaqSection = mongoose.model("FaqSection", faqSectionSchema);
export default FaqSection;
