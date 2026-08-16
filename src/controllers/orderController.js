import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";
import { streamInvoicePdf } from "../utils/generateInvoicePdf.js";

export const createOrder = async (req, res, next) => {
  const { items, shippingAddress, paymentMethod, couponCode } = req.body;
  if (!items?.length) return next(new AppError("Order must have at least one item", 400));

  // Validate products & compute subtotal
  let subtotal = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) return next(new AppError(`Product not found: ${item.product}`, 404));
    if (product.stock < item.quantity) return next(new AppError(`Insufficient stock for: ${product.name}`, 400));
    const price = item.variantLabel
      ? (product.variants.find(v => v.label === item.variantLabel)?.price || product.price)
      : product.price;
    subtotal += price * item.quantity;
    orderItems.push({ product: product._id, name: product.name, image: product.images?.[0] || "", price, quantity: item.quantity, variantLabel: item.variantLabel });
  }

  // Coupon
  let discount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!coupon) return next(new AppError("Invalid or expired coupon", 400));
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return next(new AppError("Coupon has expired", 400));
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return next(new AppError("Coupon usage limit reached", 400));
    if (subtotal < coupon.minOrderValue) return next(new AppError(`Minimum order ₹${coupon.minOrderValue} required for this coupon`, 400));
    discount = coupon.discountType === "flat" ? coupon.discountValue : (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    coupon.usedCount += 1;
    await coupon.save();
  }

  const shippingCharge = subtotal - discount >= 999 ? 0 : 79;
  const total = Math.max(subtotal - discount + shippingCharge, 0);

  const order = await Order.create({
    user: req.user._id, items: orderItems, shippingAddress,
    subtotal, discount, shippingCharge, total, couponCode, paymentMethod,
  });

  // Deduct stock
  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, soldCount: item.quantity } });
  }

  success(res, order, "Order placed successfully", 201);
};

export const getMyOrders = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id }).sort("-createdAt").skip(skip).limit(Number(limit)),
    Order.countDocuments({ user: req.user._id }),
  ]);
  success(res, { orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, "Orders fetched");
};

export const getMyOrder = async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id }).populate("items.product", "name images slug");
  if (!order) return next(new AppError("Order not found", 404));
  success(res, order, "Order fetched");
};

// GET /orders/my/:id/invoice — customer downloads the PDF invoice for their own paid order
export const downloadMyInvoice = async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
    .populate("user", "name email phone");
  if (!order) return next(new AppError("Order not found", 404));
  if (order.paymentStatus !== "paid") {
    return next(new AppError("Invoice is available once payment is completed", 400));
  }
  streamInvoicePdf(order, res);
};

export const cancelOrder = async (req, res, next) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) return next(new AppError("Order not found", 404));
  if (!["placed", "confirmed"].includes(order.status)) return next(new AppError("Order cannot be cancelled at this stage", 400));
  order.status = "cancelled";
  await order.save();
  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, soldCount: -item.quantity } });
  }
  success(res, order, "Order cancelled");
};

// Admin
export const adminGetOrders = async (req, res) => {
  const { status, page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) filter.orderNumber = { $regex: search, $options: "i" };
  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(filter).populate("user", "name email").sort("-createdAt").skip(skip).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);
  success(res, { orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, "Orders fetched");
};

export const adminGetOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email phone").populate("items.product", "name images slug");
  if (!order) return next(new AppError("Order not found", 404));
  success(res, order, "Order fetched");
};

// GET /orders/:id/invoice — admin downloads the PDF invoice for any paid order
export const adminDownloadInvoice = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email phone");
  if (!order) return next(new AppError("Order not found", 404));
  if (order.paymentStatus !== "paid") {
    return next(new AppError("Invoice is available once payment is completed", 400));
  }
  streamInvoicePdf(order, res);
};

export const adminUpdateOrder = async (req, res, next) => {
  const { status, trackingNumber, notes } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found", 404));
  if (status) order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (notes) order.notes = notes;
  if (status === "delivered") order.paymentStatus = "paid";
  await order.save();
  success(res, order, "Order updated");
};

// Orders that have been refunded (paymentStatus=refunded) or returned
export const adminGetRefunds = async (req, res) => {
  const { page = 1, limit = 20, search, startDate, endDate } = req.query;
  const filter = { $or: [{ paymentStatus: "refunded" }, { status: "returned" }] };
  if (search) filter.orderNumber = { $regex: search, $options: "i" };
  if (startDate || endDate) {
    filter.refundedAt = {};
    if (startDate) filter.refundedAt.$gte = new Date(startDate);
    if (endDate) filter.refundedAt.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [refunds, total, amountAgg] = await Promise.all([
    Order.find(filter).populate("user", "name email").sort("-refundedAt -updatedAt").skip(skip).limit(Number(limit)),
    Order.countDocuments(filter),
    Order.aggregate([{ $match: filter }, { $group: { _id: null, amount: { $sum: { $ifNull: ["$refundAmount", "$total"] } } } }]),
  ]);
  success(res, {
    refunds, total, page: Number(page), pages: Math.ceil(total / Number(limit)),
    totalRefundedAmount: amountAgg[0]?.amount || 0,
  }, "Refunds fetched");
};

// Process a refund for an order — marks it refunded/returned, restores stock, records amount+reason
export const adminProcessRefund = async (req, res, next) => {
  const { amount, reason } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found", 404));
  if (order.paymentStatus === "refunded") return next(new AppError("This order has already been refunded", 400));

  const refundAmount = amount != null && amount !== "" ? Number(amount) : order.total;
  if (Number.isNaN(refundAmount) || refundAmount <= 0 || refundAmount > order.total) {
    return next(new AppError("Refund amount must be greater than 0 and no more than the order total", 400));
  }

  const stockAlreadyRestored = ["cancelled", "returned"].includes(order.status);

  order.paymentStatus = "refunded";
  order.status = "returned";
  order.refundAmount = refundAmount;
  order.refundReason = reason || "";
  order.refundedAt = new Date();
  await order.save();

  if (!stockAlreadyRestored) {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, soldCount: -item.quantity } });
    }
  }

  success(res, order, "Refund processed");
};
