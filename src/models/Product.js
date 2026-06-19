import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  label: { type: String },   // e.g. "Gold", "Silver"
  price: { type: Number },
  stock: { type: Number, default: 0 },
}, { _id: true });

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name:    { type: String },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name:         { type: String, required: true, trim: true },
  slug:         { type: String, required: true, unique: true, lowercase: true },
  description:  { type: String },
  shortDesc:    { type: String },
  price:        { type: Number, required: true, min: 0 },
  comparePrice: { type: Number, default: 0 },             // MRP / strike-through price
  images:       [{ type: String }],
  category:     { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  collections:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }],
  tags:         [{ type: String }],
  material:     { type: String },
  variants:     [variantSchema],
  stock:        { type: Number, default: 0, min: 0 },
  sku:          { type: String, trim: true },
  isFeatured:   { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  reviews:      [reviewSchema],
  avgRating:    { type: Number, default: 0 },
  reviewCount:  { type: Number, default: 0 },
  soldCount:    { type: Number, default: 0 },
}, { timestamps: true });

// Recompute avgRating after reviews change
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) { this.avgRating = 0; this.reviewCount = 0; return; }
  const sum = this.reviews.reduce((a, r) => a + r.rating, 0);
  this.avgRating   = Math.round((sum / this.reviews.length) * 10) / 10;
  this.reviewCount = this.reviews.length;
};

const Product = mongoose.model("Product", productSchema);
export default Product;
