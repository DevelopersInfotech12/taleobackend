import Collection from "../models/Collection.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";
import { generateSlug } from "../utils/slugify.js";

export const createCollection = async (req, res, next) => {
  const data = { ...req.body };
  if (!data.slug) data.slug = generateSlug(data.name);
  if (req.files?.image?.[0])  data.image       = `/uploads/products/${req.files.image[0].filename}`;
  if (req.files?.banner?.[0]) data.bannerImage  = `/uploads/products/${req.files.banner[0].filename}`;
  const col = await Collection.create(data);
  success(res, col, "Collection created", 201);
};

export const getCollections = async (req, res) => {
  const { featured, includeInactive } = req.query;
  const filter = includeInactive ? {} : { isActive: true };
  if (featured) filter.isFeatured = true;
  const cols = await Collection.find(filter).sort("sortOrder name");
  success(res, cols, "Collections fetched");
};

export const getCollection = async (req, res, next) => {
  const filter = req.params.id.match(/^[0-9a-fA-F]{24}$/) ? { _id: req.params.id } : { slug: req.params.id };
  const col = await Collection.findOne(filter);
  if (!col) return next(new AppError("Collection not found", 404));
  success(res, col, "Collection fetched");
};

export const updateCollection = async (req, res, next) => {
  const data = { ...req.body };
  if (req.files?.image?.[0])  data.image       = `/uploads/products/${req.files.image[0].filename}`;
  if (req.files?.banner?.[0]) data.bannerImage  = `/uploads/products/${req.files.banner[0].filename}`;
  const col = await Collection.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!col) return next(new AppError("Collection not found", 404));
  success(res, col, "Collection updated");
};

export const deleteCollection = async (req, res, next) => {
  const col = await Collection.findByIdAndDelete(req.params.id);
  if (!col) return next(new AppError("Collection not found", 404));
  success(res, null, "Collection deleted");
};
