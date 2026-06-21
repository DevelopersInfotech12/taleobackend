import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";
import { generateSlug } from "../utils/slugify.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const parseJsonFields = (data, fields) => {
  for (const f of fields) {
    let val = data[f];
    if (Array.isArray(val) && val.length === 1 && typeof val[0] === "string") val = val[0];
    if (typeof val === "string" && val.trim() !== "") {
      try { data[f] = JSON.parse(val); }
      catch { data[f] = f === "tags" ? val.split(",").map((t) => t.trim()).filter(Boolean) : val; }
    } else if (Array.isArray(val)) data[f] = val;
  }
  return data;
};

const filesToUrls = async (files, folder) => {
  const results = await Promise.all(files.map((f) => uploadToCloudinary(f.buffer, folder)));
  return results.map((r) => r.secure_url);
};

export const createProduct = asyncHandler(async (req, res) => {
  const data = parseJsonFields({ ...req.body }, ["variants", "tags", "collections"]);
  if (!data.slug) data.slug = generateSlug(data.name);
  if (req.files?.length) data.images = await filesToUrls(req.files, "taleo/products");
  const product = await Product.create(data);
  success(res, product, "Product created", 201);
});

export const getProducts = asyncHandler(async (req, res) => {
  const { category, collection, tag, featured, newArrival, bestseller, search, minPrice, maxPrice, sort, inStock, page = 1, limit = 20 } = req.query;
  const filter = { isActive: { $ne: false } };
  if (category)   filter.category = category;
  if (collection) filter.collections = collection;
  if (tag) { const tags = tag.split(",").map(t => t.trim()).filter(Boolean); filter.tags = tags.length === 1 ? tags[0] : { $in: tags }; }
  if (featured)   filter.isFeatured = true;
  if (newArrival) filter.isNewArrival = true;
  if (bestseller) filter.isBestseller = true;
  if (inStock)    filter.stock = { $gt: 0 };
  if (search)     filter.$or = [{ name: { $regex: search, $options: "i" } }, { tags: { $regex: search, $options: "i" } }];
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
  const sortMap = { newest: "-createdAt", oldest: "createdAt", "price-asc": "price", "price-desc": "-price", popular: "-soldCount" };
  const sortStr = sortMap[sort] || "-createdAt";
  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter).populate("category", "name slug").populate("collections", "name slug").sort(sortStr).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  success(res, { products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, "Products fetched");
});

export const getProduct = asyncHandler(async (req, res, next) => {
  const filter = req.params.id.match(/^[0-9a-fA-F]{24}$/) ? { _id: req.params.id } : { slug: req.params.id };
  const product = await Product.findOne({ ...filter, isActive: { $ne: false } })
    .populate("category", "name slug").populate("collections", "name slug").populate("reviews.user", "name");
  if (!product) return next(new AppError("Product not found", 404));
  success(res, product, "Product fetched");
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("Product not found", 404));
  const data = parseJsonFields({ ...req.body }, ["variants", "tags", "collections"]);
  let baseImages = product.images || [];
  if (typeof data.existingImages === "string") {
    try { baseImages = JSON.parse(data.existingImages); } catch {}
    delete data.existingImages;
  }
  data.images = req.files?.length ? [...baseImages, ...(await filesToUrls(req.files, "taleo/products"))] : baseImages;
  Object.assign(product, data);
  await product.save();
  success(res, product, "Product updated");
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return next(new AppError("Product not found", 404));
  success(res, null, "Product deleted");
});

export const addReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("Product not found", 404));
  const already = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
  if (already) return next(new AppError("You have already reviewed this product", 400));
  product.reviews.push({ user: req.user._id, name: req.user.name, rating: req.body.rating, comment: req.body.comment });
  product.updateRating();
  await product.save();
  success(res, product, "Review added");
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new AppError("Product not found", 404));
  product.reviews = product.reviews.filter((r) => r._id.toString() !== req.params.reviewId);
  product.updateRating();
  await product.save();
  success(res, null, "Review deleted");
});

export const adminGetProducts = asyncHandler(async (req, res) => {
  const { search, category, isActive, isFeatured, isNewArrival, isBestseller, stock, sort, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (search)   filter.$or = [{ name: { $regex: search, $options: "i" } }, { sku: { $regex: search, $options: "i" } }];
  if (category) filter.category = category;
  if (isActive !== undefined)     filter.isActive = isActive === "true";
  if (isFeatured !== undefined)   filter.isFeatured = isFeatured === "true";
  if (isNewArrival !== undefined) filter.isNewArrival = isNewArrival === "true";
  if (isBestseller !== undefined) filter.isBestseller = isBestseller === "true";
  if (stock === "low") filter.stock = { $lt: 10, $gt: 0 };
  if (stock === "out") filter.stock = 0;
  const sortMap = { newest: "-createdAt", oldest: "createdAt", "price-asc": "price", "price-desc": "-price", "name-asc": "name", "stock-asc": "stock", "stock-desc": "-stock", popular: "-soldCount" };
  const sortStr = sortMap[sort] || "-createdAt";
  const skip = (Number(page) - 1) * Number(limit);
  const [products, total] = await Promise.all([
    Product.find(filter).populate("category", "name").sort(sortStr).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  success(res, { products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, "Products fetched");
});