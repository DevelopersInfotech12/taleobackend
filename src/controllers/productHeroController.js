import ProductHeroSlide from "../models/ProductHeroSlide.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const BOOL_FIELDS = ["isActive"];

/** multipart/form-data sends everything as strings — coerce back. */
const normaliseBody = (body) => {
  const data = { ...body };
  for (const f of BOOL_FIELDS) {
    if (data[f] !== undefined) data[f] = data[f] === true || data[f] === "true";
  }
  if (data.sortOrder !== undefined && data.sortOrder !== "") {
    data.sortOrder = Number(data.sortOrder) || 0;
  }
  return data;
};

/**
 * Handles the two named file fields (`image`, `mobileImage`).
 * If no new file was sent for a field, the existing URL sent from the client
 * (keepImage / keepMobileImage) is preserved.
 */
const applyImages = async (data, files) => {
  const desktop = files?.image?.[0];
  const mobile = files?.mobileImage?.[0];

  if (desktop) {
    const r = await uploadToCloudinary(desktop.buffer, "taleo/product-hero");
    data.image = r.secure_url;
  } else if (data.keepImage !== undefined) {
    data.image = data.keepImage;
  }

  if (mobile) {
    const r = await uploadToCloudinary(mobile.buffer, "taleo/product-hero");
    data.mobileImage = r.secure_url;
  } else if (data.keepMobileImage !== undefined) {
    data.mobileImage = data.keepMobileImage;
  }

  delete data.keepImage;
  delete data.keepMobileImage;
  return data;
};

/** GET /api/v1/product-hero — public (active only) unless ?includeInactive=true */
export const getProductHeroSlides = asyncHandler(async (req, res) => {
  const filter = req.query.includeInactive ? {} : { isActive: true };
  const slides = await ProductHeroSlide.find(filter).sort("sortOrder createdAt");
  success(res, slides, "Product hero slides fetched");
});

/** GET /api/v1/product-hero/:id */
export const getProductHeroSlide = asyncHandler(async (req, res, next) => {
  const slide = await ProductHeroSlide.findById(req.params.id);
  if (!slide) return next(new AppError("Slide not found", 404));
  success(res, slide, "Product hero slide fetched");
});

/** POST /api/v1/product-hero */
export const createProductHeroSlide = asyncHandler(async (req, res, next) => {
  const data = await applyImages(normaliseBody(req.body), req.files);
  if (!data.heading) return next(new AppError("Heading is required", 400));

  if (data.sortOrder === undefined || data.sortOrder === "") {
    data.sortOrder = await ProductHeroSlide.countDocuments();
  }

  const slide = await ProductHeroSlide.create(data);
  success(res, slide, "Product hero slide created", 201);
});

/** PUT /api/v1/product-hero/:id */
export const updateProductHeroSlide = asyncHandler(async (req, res, next) => {
  const slide = await ProductHeroSlide.findById(req.params.id);
  if (!slide) return next(new AppError("Slide not found", 404));

  const data = await applyImages(normaliseBody(req.body), req.files);
  Object.assign(slide, data);
  await slide.save();
  success(res, slide, "Product hero slide updated");
});

/** DELETE /api/v1/product-hero/:id */
export const deleteProductHeroSlide = asyncHandler(async (req, res, next) => {
  const slide = await ProductHeroSlide.findByIdAndDelete(req.params.id);
  if (!slide) return next(new AppError("Slide not found", 404));
  success(res, null, "Product hero slide deleted");
});

/** PUT /api/v1/product-hero/reorder — body: { order: [id, id, ...] } */
export const reorderProductHeroSlides = asyncHandler(async (req, res, next) => {
  const { order } = req.body;
  if (!Array.isArray(order)) return next(new AppError("order must be an array of ids", 400));
  await Promise.all(order.map((id, idx) => ProductHeroSlide.findByIdAndUpdate(id, { sortOrder: idx })));
  const slides = await ProductHeroSlide.find().sort("sortOrder createdAt");
  success(res, slides, "Product hero slides reordered");
});
