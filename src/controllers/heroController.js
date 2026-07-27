import HeroSlide from "../models/HeroSlide.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const BOOL_FIELDS = ["isIntro", "isActive"];

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
    const r = await uploadToCloudinary(desktop.buffer, "taleo/hero");
    data.image = r.secure_url;
  } else if (data.keepImage !== undefined) {
    data.image = data.keepImage;
  }

  if (mobile) {
    const r = await uploadToCloudinary(mobile.buffer, "taleo/hero");
    data.mobileImage = r.secure_url;
  } else if (data.keepMobileImage !== undefined) {
    data.mobileImage = data.keepMobileImage;
  }

  delete data.keepImage;
  delete data.keepMobileImage;
  return data;
};

/** GET /api/v1/hero  — public (active only) unless ?includeInactive=true */
export const getHeroSlides = asyncHandler(async (req, res) => {
  const filter = req.query.includeInactive ? {} : { isActive: true };
  const slides = await HeroSlide.find(filter).sort("sortOrder createdAt");
  success(res, slides, "Hero slides fetched");
});

/** GET /api/v1/hero/:id */
export const getHeroSlide = asyncHandler(async (req, res, next) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) return next(new AppError("Hero slide not found", 404));
  success(res, slide, "Hero slide fetched");
});

/** POST /api/v1/hero */
export const createHeroSlide = asyncHandler(async (req, res, next) => {
  const data = await applyImages(normaliseBody(req.body), req.files);
  if (!data.title) return next(new AppError("Title is required", 400));

  if (data.sortOrder === undefined || data.sortOrder === "") {
    data.sortOrder = await HeroSlide.countDocuments();
  }

  const slide = await HeroSlide.create(data);
  success(res, slide, "Hero slide created", 201);
});

/** PUT /api/v1/hero/:id */
export const updateHeroSlide = asyncHandler(async (req, res, next) => {
  const slide = await HeroSlide.findById(req.params.id);
  if (!slide) return next(new AppError("Hero slide not found", 404));

  const data = await applyImages(normaliseBody(req.body), req.files);
  Object.assign(slide, data);
  await slide.save();
  success(res, slide, "Hero slide updated");
});

/** DELETE /api/v1/hero/:id */
export const deleteHeroSlide = asyncHandler(async (req, res, next) => {
  const slide = await HeroSlide.findByIdAndDelete(req.params.id);
  if (!slide) return next(new AppError("Hero slide not found", 404));
  success(res, null, "Hero slide deleted");
});

/** PUT /api/v1/hero/reorder  — body: { order: [id, id, ...] } */
export const reorderHeroSlides = asyncHandler(async (req, res, next) => {
  const { order } = req.body;
  if (!Array.isArray(order)) return next(new AppError("order must be an array of ids", 400));
  await Promise.all(order.map((id, idx) => HeroSlide.findByIdAndUpdate(id, { sortOrder: idx })));
  const slides = await HeroSlide.find().sort("sortOrder createdAt");
  success(res, slides, "Hero slides reordered");
});
