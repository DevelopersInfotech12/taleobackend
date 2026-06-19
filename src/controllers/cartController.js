import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";

const populateOpts = {
  path: "items.product",
  select: "name slug images price comparePrice variants stock isActive",
};

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

// Build the frontend-friendly cart payload, dropping items whose product was deleted
const serializeCart = (cart) => {
  const items = cart.items
    .filter((i) => i.product)
    .map((i) => ({
      key: `${i.product._id}-${i.variant || ""}-${i.size || ""}`,
      _id: i._id,
      id: i.product._id,
      slug: i.product.slug,
      name: i.product.name,
      image: i.product.images?.[0] || "",
      price: i.product.price,
      originalPrice: i.product.comparePrice > 0 ? i.product.comparePrice : null,
      stock: i.product.stock,
      variant: i.variant || "",
      size: i.size || "",
      qty: i.qty,
    }));
  return { _id: cart._id, items };
};

export const getCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate(populateOpts);
  success(res, serializeCart(cart), "Cart fetched");
};

export const addItem = async (req, res, next) => {
  const { productId, variant = "", size = "", qty = 1 } = req.body;
  if (!productId) return next(new AppError("productId is required", 400));

  const product = await Product.findById(productId);
  if (!product || !product.isActive) return next(new AppError("Product not found", 404));

  const cart = await getOrCreateCart(req.user._id);
  const existing = cart.items.find(
    (i) => i.product.toString() === productId && i.variant === variant && i.size === size
  );
  if (existing) {
    existing.qty += Number(qty) || 1;
  } else {
    cart.items.push({ product: productId, variant, size, qty: Number(qty) || 1 });
  }
  await cart.save();
  await cart.populate(populateOpts);
  success(res, serializeCart(cart), "Item added to cart");
};

export const updateItem = async (req, res, next) => {
  const { itemId } = req.params;
  const { qty } = req.body;
  if (!qty || qty < 1) return next(new AppError("qty must be at least 1", 400));

  const cart = await getOrCreateCart(req.user._id);
  const item = cart.items.find((i) => i._id.toString() === itemId);
  if (!item) return next(new AppError("Cart item not found", 404));

  item.qty = Number(qty);
  await cart.save();
  await cart.populate(populateOpts);
  success(res, serializeCart(cart), "Cart updated");
};

export const removeItem = async (req, res, next) => {
  const { itemId } = req.params;
  const cart = await getOrCreateCart(req.user._id);
  cart.items = cart.items.filter((i) => i._id.toString() !== itemId);
  await cart.save();
  await cart.populate(populateOpts);
  success(res, serializeCart(cart), "Item removed from cart");
};

export const clearCart = async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.items = [];
  await cart.save();
  success(res, serializeCart(cart), "Cart cleared");
};

// Merge a guest cart (array of { productId, variant, size, qty }) into the user's cart on login
export const mergeCart = async (req, res, next) => {
  const { items = [] } = req.body;
  if (!Array.isArray(items)) return next(new AppError("items must be an array", 400));

  const cart = await getOrCreateCart(req.user._id);

  for (const guestItem of items) {
    const { productId, variant = "", size = "", qty = 1 } = guestItem;
    if (!productId) continue;
    const product = await Product.findById(productId);
    if (!product || !product.isActive) continue;

    const existing = cart.items.find(
      (i) => i.product.toString() === productId && i.variant === variant && i.size === size
    );
    if (existing) {
      existing.qty += Number(qty) || 1;
    } else {
      cart.items.push({ product: productId, variant, size, qty: Number(qty) || 1 });
    }
  }

  await cart.save();
  await cart.populate(populateOpts);
  success(res, serializeCart(cart), "Cart merged");
};
