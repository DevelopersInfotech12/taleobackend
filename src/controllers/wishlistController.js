import User from "../models/User.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { success } from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";

// GET /api/v1/wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "wishlist",
    "name slug price comparePrice images isFeatured isNewArrival isBestseller avgRating reviewCount stock"
  );
  success(res, user.wishlist, "Wishlist fetched");
});

// POST /api/v1/wishlist/:productId  — toggle (add if absent, remove if present)
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404);

  const user = await User.findById(req.user._id);
  const idx = user.wishlist.findIndex((id) => id.toString() === productId);

  let action;
  if (idx === -1) {
    user.wishlist.push(productId);
    action = "added";
  } else {
    user.wishlist.splice(idx, 1);
    action = "removed";
  }

  await user.save();
  success(res, { wishlist: user.wishlist, action }, `Product ${action} from wishlist`);
});

// DELETE /api/v1/wishlist  — clear all
export const clearWishlist = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { wishlist: [] });
  success(res, [], "Wishlist cleared");
});