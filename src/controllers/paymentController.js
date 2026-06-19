import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../models/Order.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";

const getRazorpay = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

// POST /api/payments/razorpay/order
// body: { orderId }  -> creates a Razorpay order for an existing DB order
export const createRazorpayOrder = async (req, res, next) => {
  const { orderId } = req.body;
  if (!orderId) return next(new AppError("orderId is required", 400));

  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!order) return next(new AppError("Order not found", 404));
  if (order.paymentStatus === "paid") return next(new AppError("Order already paid", 400));

  const razorpay = getRazorpay();
  const rpOrder = await razorpay.orders.create({
    amount: Math.round(order.total * 100), // paise
    currency: "INR",
    receipt: order.orderNumber,
    notes: { orderId: String(order._id), orderNumber: order.orderNumber },
  });

  order.razorpayOrderId = rpOrder.id;
  await order.save();

  success(res, {
    razorpayOrderId: rpOrder.id,
    amount: rpOrder.amount,
    currency: rpOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    orderNumber: order.orderNumber,
  }, "Razorpay order created");
};

// POST /api/payments/razorpay/verify
// body: { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
export const verifyRazorpayPayment = async (req, res, next) => {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new AppError("Missing payment verification fields", 400));
  }

  const order = await Order.findOne({ _id: orderId, user: req.user._id });
  if (!order) return next(new AppError("Order not found", 404));

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    order.paymentStatus = "failed";
    await order.save();
    return next(new AppError("Payment verification failed", 400));
  }

  order.paymentStatus = "paid";
  order.status = order.status === "placed" ? "confirmed" : order.status;
  order.razorpayPaymentId = razorpay_payment_id;
  order.razorpaySignature = razorpay_signature;
  await order.save();

  success(res, order, "Payment verified successfully");
};

// POST /api/payments/razorpay/webhook
// Razorpay server-to-server webhook (optional, for extra reliability)
export const razorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  const expected = crypto
    .createHmac("sha256", secret)
    .update(req.rawBody || JSON.stringify(req.body))
    .digest("hex");

  if (signature !== expected) {
    return res.status(400).json({ success: false, message: "Invalid webhook signature" });
  }

  const event = req.body;
  if (event.event === "payment.captured") {
    const rpOrderId = event.payload?.payment?.entity?.order_id;
    if (rpOrderId) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: rpOrderId },
        { paymentStatus: "paid", $set: { status: "confirmed" } },
        { new: true }
      );
    }
  }

  res.json({ success: true });
};