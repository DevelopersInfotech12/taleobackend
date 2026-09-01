import Collection from "../models/Collection.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";
import { generateSlug } from "../utils/slugify.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

/**
 * Handles the two named file fields (`image`, `banner`).
 * multer uses memoryStorage here (no `.filename`/`.path`), so files must be
 * pushed to Cloudinary — writing `/uploads/products/${file.filename}` directly
 * produces a broken URL since that file is never saved to disk.
 * If no new file was sent for a field, the existing URL sent from the client
 * (keepImage / keepBanner) is preserved instead of being wiped out.
 */
const applyImages = async (data, files) => {
  const image = files?.image?.[0];
  const banner = files?.banner?.[0];

  if (image) {
    const r = await uploadToCloudinary(image.buffer, "taleo/collections");
    data.image = r.secure_url;
  } else if (data.keepImage !== undefined) {
    data.image = data.keepImage;
  }

  if (banner) {
    const r = await uploadToCloudinary(banner.buffer, "taleo/collections");
    data.bannerImage = r.secure_url;
  } else if (data.keepBanner !== undefined) {
    data.bannerImage = data.keepBanner;
  }

  delete data.keepImage;
  delete data.keepBanner;
  return data;
};

export const createCollection = async (req, res, next) => {
  const data = await applyImages({ ...req.body }, req.files);
  if (!data.slug) data.slug = generateSlug(data.name);
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
  const data = await applyImages({ ...req.body }, req.files);
  const col = await Collection.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!col) return next(new AppError("Collection not found", 404));
  success(res, col, "Collection updated");
};

export const deleteCollection = async (req, res, next) => {
  const col = await Collection.findByIdAndDelete(req.params.id);
  if (!col) return next(new AppError("Collection not found", 404));
  success(res, null, "Collection deleted");
};