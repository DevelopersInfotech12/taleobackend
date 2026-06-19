import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  image:       { type: String },
  bannerImage: { type: String },
  isFeatured:  { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  sortOrder:   { type: Number, default: 0 },
  tags:        [{ type: String }],
}, { timestamps: true });

const Collection = mongoose.model("Collection", collectionSchema);
export default Collection;
