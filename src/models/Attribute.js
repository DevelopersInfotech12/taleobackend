import mongoose from "mongoose";

// Keep in sync with DEFAULT_ATTRIBUTES in controllers/attributeController.js
export const ATTRIBUTE_TYPES = ["gemstone", "metal", "stoneColor"];

const attributeSchema = new mongoose.Schema({
  type:     { type: String, enum: ATTRIBUTE_TYPES, required: true },
  value:    { type: String, required: true, trim: true },       // display value, e.g. "Cubic Zirconia"
  valueKey: { type: String, required: true, trim: true, lowercase: true }, // for case-insensitive uniqueness
}, { timestamps: true });

// Prevent the same value (case-insensitive) being added twice for the same type
attributeSchema.index({ type: 1, valueKey: 1 }, { unique: true });

const Attribute = mongoose.model("Attribute", attributeSchema);
export default Attribute;
