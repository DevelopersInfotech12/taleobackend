import Attribute from "../models/Attribute.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// No built-in starter options — dropdowns are fully dynamic: they only show
// values an admin has added via "+ Add new…" in the product form.
export const DEFAULT_ATTRIBUTES = {
  gemstone:   [],
  metal:      [],
  stoneColor: [],
};

const ATTRIBUTE_TYPES = Object.keys(DEFAULT_ATTRIBUTES);

// Merge built-in defaults with any admin-added custom values for a type, de-duped case-insensitively.
const mergedList = async (type) => {
  const custom = await Attribute.find({ type }).sort("value").select("value -_id");
  const merged = [...DEFAULT_ATTRIBUTES[type]];
  for (const { value } of custom) {
    if (!merged.some((v) => v.toLowerCase() === value.toLowerCase())) merged.push(value);
  }
  return merged;
};

// GET /attributes           -> { gemstone: [...], metal: [...], stoneColor: [...] }
// GET /attributes?type=xyz  -> { type, values: [...] }
export const getAttributes = asyncHandler(async (req, res, next) => {
  const { type } = req.query;

  if (type) {
    if (!ATTRIBUTE_TYPES.includes(type)) return next(new AppError("Invalid attribute type", 400));
    const values = await mergedList(type);
    return success(res, { type, values }, "Attributes fetched");
  }

  const data = {};
  for (const t of ATTRIBUTE_TYPES) data[t] = await mergedList(t);
  success(res, data, "Attributes fetched");
});

// POST /attributes  { type, value }
// Adds a new custom option (no-op if it already exists, case-insensitively) and
// returns the full refreshed list for that type so the dropdown can update instantly.
export const createAttribute = asyncHandler(async (req, res, next) => {
  const { type, value } = req.body;
  if (!ATTRIBUTE_TYPES.includes(type)) return next(new AppError("Invalid attribute type", 400));

  const trimmed = (value || "").trim();
  if (!trimmed) return next(new AppError("Value is required", 400));

  const valueKey = trimmed.toLowerCase();
  const isDefault = DEFAULT_ATTRIBUTES[type].some((v) => v.toLowerCase() === valueKey);
  if (!isDefault) {
    await Attribute.findOneAndUpdate(
      { type, valueKey },
      { $setOnInsert: { type, value: trimmed, valueKey } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const values = await mergedList(type);
  success(res, { type, value: trimmed, values }, "Attribute added", 201);
});

// DELETE /attributes/:type/:value
export const deleteAttribute = asyncHandler(async (req, res, next) => {
  const { type, value } = req.params;
  if (!ATTRIBUTE_TYPES.includes(type)) return next(new AppError("Invalid attribute type", 400));

  await Attribute.deleteOne({ type, valueKey: decodeURIComponent(value).trim().toLowerCase() });
  const values = await mergedList(type);
  success(res, { type, values }, "Attribute removed");
});
