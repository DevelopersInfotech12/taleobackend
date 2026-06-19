import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
  description:   { type: String },
  discountType:  { type: String, enum: ["flat", "percent"], default: "percent" },
  discountValue: { type: Number, required: true, min: 0 },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount:   { type: Number },                                      // cap for percent type
  usageLimit:    { type: Number },                                      // null = unlimited
  usedCount:     { type: Number, default: 0 },
  expiresAt:     { type: Date },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
