import HeritageSection from "../models/HeritageSection.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const TEXT_FIELDS = ["eyebrow", "headingMain", "headingAccent", "buttonLabel", "buttonHref"];

/** There's only ever one Heritage section — fetch it, creating the default on first use. */
const getSingleton = async () => {
  let doc = await HeritageSection.findOne();
  if (!doc) doc = await HeritageSection.create({});
  return doc;
};

/** GET /api/v1/heritage — public. Returns null if never configured (frontend keeps its built-in fallback). */
export const getHeritage = asyncHandler(async (_req, res) => {
  const doc = await HeritageSection.findOne();
  success(res, doc, "Heritage section fetched");
});

/** PUT /api/v1/heritage — admin. Upserts the copy fields only. */
export const updateHeritage = asyncHandler(async (req, res) => {
  const doc = await getSingleton();
  for (const f of TEXT_FIELDS) {
    if (req.body[f] !== undefined) doc[f] = req.body[f];
  }
  await doc.save();
  success(res, doc, "Heritage section updated");
});

/** POST /api/v1/heritage/images — admin. multipart: file field "image", optional "alt". */
export const addHeritageImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new AppError("An image file is required", 400));
  const doc = await getSingleton();
  const result = await uploadToCloudinary(req.file.buffer, "taleo/heritage");
  doc.images.push({
    url: result.secure_url,
    alt: req.body.alt || "",
    sortOrder: doc.images.length,
  });
  await doc.save();
  success(res, doc, "Image added", 201);
});

/** PUT /api/v1/heritage/images/:imageId — admin. Edit alt text and/or replace the file. */
export const updateHeritageImage = asyncHandler(async (req, res, next) => {
  const doc = await getSingleton();
  const img = doc.images.id(req.params.imageId);
  if (!img) return next(new AppError("Image not found", 404));

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "taleo/heritage");
    img.url = result.secure_url;
  }
  if (req.body.alt !== undefined) img.alt = req.body.alt;

  await doc.save();
  success(res, doc, "Image updated");
});

/** DELETE /api/v1/heritage/images/:imageId — admin. */
export const deleteHeritageImage = asyncHandler(async (req, res, next) => {
  const doc = await getSingleton();
  const img = doc.images.id(req.params.imageId);
  if (!img) return next(new AppError("Image not found", 404));
  img.deleteOne();
  doc.images.forEach((im, idx) => { im.sortOrder = idx; });
  await doc.save();
  success(res, doc, "Image deleted");
});

/** PUT /api/v1/heritage/images/reorder — admin. body: { order: [imageId, ...] } */
export const reorderHeritageImages = asyncHandler(async (req, res, next) => {
  const { order } = req.body;
  if (!Array.isArray(order)) return next(new AppError("order must be an array of ids", 400));
  const doc = await getSingleton();
  order.forEach((id, idx) => {
    const img = doc.images.id(id);
    if (img) img.sortOrder = idx;
  });
  doc.images.sort((a, b) => a.sortOrder - b.sortOrder);
  await doc.save();
  success(res, doc, "Images reordered");
});
