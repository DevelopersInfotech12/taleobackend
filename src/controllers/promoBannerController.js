import PromoBanner from "../models/PromoBanner.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const normaliseBody = (body) => {
  const data = { ...body };
  if (data.isActive !== undefined) data.isActive = data.isActive === true || data.isActive === "true";
  if (data.sortOrder !== undefined && data.sortOrder !== "") data.sortOrder = Number(data.sortOrder) || 0;
  return data;
};

const applyImages = async (data, files) => {
  const desktop = files?.image?.[0];
  const mobile = files?.mobileImage?.[0];

  if (desktop) {
    const r = await uploadToCloudinary(desktop.buffer, "taleo/promo-banners");
    data.image = r.secure_url;
  } else if (data.keepImage !== undefined) {
    data.image = data.keepImage;
  }

  if (mobile) {
    const r = await uploadToCloudinary(mobile.buffer, "taleo/promo-banners");
    data.mobileImage = r.secure_url;
  } else if (data.keepMobileImage !== undefined) {
    data.mobileImage = data.keepMobileImage;
  }

  delete data.keepImage;
  delete data.keepMobileImage;
  return data;
};

/** GET /api/v1/promo-banners — public (active only) unless ?includeInactive=true */
export const getPromoBanners = asyncHandler(async (req, res) => {
  const filter = req.query.includeInactive ? {} : { isActive: true };
  const banners = await PromoBanner.find(filter).sort("sortOrder createdAt");
  success(res, banners, "Promo banners fetched");
});

/** POST /api/v1/promo-banners */
export const createPromoBanner = asyncHandler(async (req, res, next) => {
  const data = await applyImages(normaliseBody(req.body), req.files);
  if (!data.image) return next(new AppError("A desktop image is required", 400));

  if (data.sortOrder === undefined || data.sortOrder === "") {
    data.sortOrder = await PromoBanner.countDocuments();
  }

  const banner = await PromoBanner.create(data);
  success(res, banner, "Promo banner created", 201);
});

/** PUT /api/v1/promo-banners/:id */
export const updatePromoBanner = asyncHandler(async (req, res, next) => {
  const banner = await PromoBanner.findById(req.params.id);
  if (!banner) return next(new AppError("Banner not found", 404));

  const data = await applyImages(normaliseBody(req.body), req.files);
  Object.assign(banner, data);
  await banner.save();
  success(res, banner, "Promo banner updated");
});

/** DELETE /api/v1/promo-banners/:id */
export const deletePromoBanner = asyncHandler(async (req, res, next) => {
  const banner = await PromoBanner.findByIdAndDelete(req.params.id);
  if (!banner) return next(new AppError("Banner not found", 404));
  success(res, null, "Promo banner deleted");
});

/** PUT /api/v1/promo-banners/reorder — body: { order: [id, id, ...] } */
export const reorderPromoBanners = asyncHandler(async (req, res, next) => {
  const { order } = req.body;
  if (!Array.isArray(order)) return next(new AppError("order must be an array of ids", 400));
  await Promise.all(order.map((id, idx) => PromoBanner.findByIdAndUpdate(id, { sortOrder: idx })));
  const banners = await PromoBanner.find().sort("sortOrder createdAt");
  success(res, banners, "Promo banners reordered");
});
