import express from "express";
import { protect } from "../middleware/auth.js";
import { createRazorpayOrder, verifyRazorpayPayment, razorpayWebhook } from "../controllers/paymentController.js";

const router = express.Router();

// Webhook must be public (Razorpay calls it directly, signed with webhook secret)
router.post("/razorpay/webhook", razorpayWebhook);

router.use(protect);
router.post("/razorpay/order",  createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);

export default router;