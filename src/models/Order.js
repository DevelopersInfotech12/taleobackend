import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product:      { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name:         { type: String, required: true },
  image:        { type: String },
  price:        { type: Number, required: true },
  quantity:     { type: Number, required: true, min: 1 },
  variantLabel: { type: String },
}, { _id: true });

const shippingSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  phone:   { type: String, required: true },
  line1:   { type: String, required: true },
  line2:   { type: String },
  city:    { type: String, required: true },
  state:   { type: String, required: true },
  pincode: { type: String, required: true },
  country: { type: String, default: "India" },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber:     { type: String, unique: true },
  user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items:           [itemSchema],
  shippingAddress: shippingSchema,
  subtotal:        { type: Number, required: true },
  discount:        { type: Number, default: 0 },
  shippingCharge:  { type: Number, default: 0 },
  total:           { type: Number, required: true },
  couponCode:      { type: String },
  paymentMethod:   { type: String, enum: ["cod", "prepaid"], default: "cod" },
  paymentStatus:   { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
  status:          { type: String, enum: ["placed", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"], default: "placed" },
  notes:           { type: String },
  trackingNumber:  { type: String },

  // Razorpay
  razorpayOrderId:   { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
}, { timestamps: true });

// Auto-generate order number before save
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `AMM-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;