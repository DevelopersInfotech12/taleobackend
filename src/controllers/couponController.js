import Coupon from "../models/Coupon.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";

export const createCoupon = async (req, res) => {
  const coupon = await Coupon.create(req.body);
  success(res, coupon, "Coupon created", 201);
};

export const getCoupons = async (req, res) => {
  const coupons = await Coupon.find().sort("-createdAt");
  success(res, coupons, "Coupons fetched");
};

export const updateCoupon = async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) return next(new AppError("Coupon not found", 404));
  success(res, coupon, "Coupon updated");
};

export const deleteCoupon = async (req, res, next) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return next(new AppError("Coupon not found", 404));
  success(res, null, "Coupon deleted");
};

export const validateCoupon = async (req, res, next) => {
  const { code, orderValue } = req.body;
  const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
  if (!coupon) return next(new AppError("Invalid coupon code", 400));
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return next(new AppError("Coupon has expired", 400));
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return next(new AppError("Coupon usage limit reached", 400));
  if (orderValue && orderValue < coupon.minOrderValue) return next(new AppError(`Min order ₹${coupon.minOrderValue} required`, 400));
  let discount = coupon.discountType === "flat" ? coupon.discountValue : ((orderValue || 0) * coupon.discountValue) / 100;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  success(res, { coupon, discount }, "Coupon valid");
};
