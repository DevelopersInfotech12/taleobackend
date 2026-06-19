import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["p", "h3", "ul", "ol", "callout", "callout-warn", "steps", "img"],
    required: true,
  },
  text: { type: String },
  items: { type: [String] },
  stepItems: [{ n: String, title: String, desc: String, tip: String }],
  src: { type: String },
  alt: { type: String },
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  heading: { type: String, required: true },
  content: [contentBlockSchema],
}, { _id: false });

const tocSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
}, { _id: false });

const metaSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false });

const relatedSchema = new mongoose.Schema({
  img: String,
  tag: String,
  tagBg: String,
  tagColor: String,
  date: String,
  title: String,
  slug: { type: String, default: null },
}, { _id: false });

const blogSchema = new mongoose.Schema(
  {
    slug:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    title:    { type: String, required: true, trim: true },
    excerpt:  { type: String, required: true },
    tag:      { type: String, required: true },
    tagStyle: {
      bg:   { type: String, default: "#FEF3DC" },
      text: { type: String, default: "#9A5C06" },
    },

    date:     { type: String, required: true },
    readTime: { type: String, default: "5 min read" },
    author:   { type: String, default: "Editorial Team" },
    featured: { type: Boolean, default: false },
    status:   { type: String, enum: ["draft", "published"], default: "draft" },

    img:          { type: String, required: true },
    heroImg:      { type: String },
    heroGradient: { type: String, default: "linear-gradient(135deg,rgba(26,13,7,0.97) 0%,rgba(184,151,90,0.72) 100%)" },

    seo: {
      metaTitle:       { type: String },
      metaDescription: { type: String },
      metaKeywords:    { type: [String], default: [] },
      ogTitle:         { type: String },
      ogDescription:   { type: String },
      ogImage:         { type: String },
      canonicalUrl:    { type: String },
      structuredData:  { type: String },
      noIndex:         { type: Boolean, default: false },
    },

    highlights: { type: [String], default: [] },
    toc:        [tocSchema],
    meta:       [metaSchema],
    sections:   [sectionSchema],
    tags:       { type: [String], default: [] },

    sidebarCta: { title: String, body: String, btn: String },
    ctaTitle:   { type: String },
    ctaBody:    { type: String },

    related: [relatedSchema],
    views:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

blogSchema.index({ status: 1, createdAt: -1 });
blogSchema.index({ tag: 1 });
blogSchema.index({ featured: 1 });

export default mongoose.model("Blog", blogSchema);
