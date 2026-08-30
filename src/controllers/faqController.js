import FaqSection from "../models/FaqSection.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const TEXT_FIELDS = ["eyebrow", "headingMain", "headingAccent", "subtitle", "badgeText"];

/** There's only ever one FAQ section — fetch it, creating the default on first use. */
const getSingleton = async () => {
  let doc = await FaqSection.findOne();
  if (!doc) doc = await FaqSection.create({});
  return doc;
};

/** GET /api/v1/faq — public. Returns null if never configured (frontend keeps its built-in fallback). */
export const getFaq = asyncHandler(async (_req, res) => {
  const doc = await FaqSection.findOne();
  success(res, doc, "FAQ section fetched");
});

/** PUT /api/v1/faq — admin. multipart: text fields + optional "image" file. */
export const updateFaq = asyncHandler(async (req, res) => {
  const doc = await getSingleton();
  for (const f of TEXT_FIELDS) {
    if (req.body[f] !== undefined) doc[f] = req.body[f];
  }
  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "taleo/faq");
    doc.image = result.secure_url;
  } else if (req.body.keepImage !== undefined) {
    doc.image = req.body.keepImage;
  }
  await doc.save();
  success(res, doc, "FAQ section updated");
});

/** POST /api/v1/faq/items — admin. body: { question, answer } */
export const addFaqItem = asyncHandler(async (req, res, next) => {
  const { question, answer } = req.body;
  if (!question || !answer) return next(new AppError("Question and answer are required", 400));
  const doc = await getSingleton();
  doc.items.push({ question, answer, sortOrder: doc.items.length });
  await doc.save();
  success(res, doc, "FAQ item added", 201);
});

/** PUT /api/v1/faq/items/:itemId — admin. body: { question?, answer? } */
export const updateFaqItem = asyncHandler(async (req, res, next) => {
  const doc = await getSingleton();
  const item = doc.items.id(req.params.itemId);
  if (!item) return next(new AppError("FAQ item not found", 404));
  if (req.body.question !== undefined) item.question = req.body.question;
  if (req.body.answer !== undefined) item.answer = req.body.answer;
  await doc.save();
  success(res, doc, "FAQ item updated");
});

/** DELETE /api/v1/faq/items/:itemId — admin. */
export const deleteFaqItem = asyncHandler(async (req, res, next) => {
  const doc = await getSingleton();
  const item = doc.items.id(req.params.itemId);
  if (!item) return next(new AppError("FAQ item not found", 404));
  item.deleteOne();
  doc.items.forEach((it, idx) => { it.sortOrder = idx; });
  await doc.save();
  success(res, doc, "FAQ item deleted");
});

/** PUT /api/v1/faq/items/reorder — admin. body: { order: [itemId, ...] } */
export const reorderFaqItems = asyncHandler(async (req, res, next) => {
  const { order } = req.body;
  if (!Array.isArray(order)) return next(new AppError("order must be an array of ids", 400));
  const doc = await getSingleton();
  order.forEach((id, idx) => {
    const item = doc.items.id(id);
    if (item) item.sortOrder = idx;
  });
  doc.items.sort((a, b) => a.sortOrder - b.sortOrder);
  await doc.save();
  success(res, doc, "FAQ items reordered");
});
