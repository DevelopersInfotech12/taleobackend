import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product:      { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variant:      { type: String, default: "" },
  size:         { type: String, default: "" },
  qty:          { type: Number, required: true, min: 1, default: 1 },
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: [cartItemSchema],
}, { timestamps: true });

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
