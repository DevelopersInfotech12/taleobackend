import Category from "../models/Category.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";
import { generateSlug } from "../utils/slugify.js";

export const createCategory = async (req, res, next) => {
  const data = { ...req.body };
  if (!data.slug) data.slug = generateSlug(data.name);
  if (req.file) data.image = `/uploads/products/${req.file.filename}`;
  if (data.collection === "") data.collection = null;
  if (data.parentCategory === "") data.parentCategory = null;
  const cat = await Category.create(data);
  success(res, cat, "Category created", 201);
};

export const getCategories = async (req, res) => {
  const { includeInactive, collection } = req.query;
  const filter = includeInactive ? {} : { isActive: true };
  if (collection) filter.collection = collection;
  const cats = await Category.find(filter).populate("parentCategory", "name slug").populate("collection", "name slug").sort("sortOrder name");
  success(res, cats, "Categories fetched");
};

export const getCategory = async (req, res, next) => {
  const filter = req.params.id.match(/^[0-9a-fA-F]{24}$/) ? { _id: req.params.id } : { slug: req.params.id };
  const cat = await Category.findOne(filter).populate("parentCategory", "name slug").populate("collection", "name slug");
  if (!cat) return next(new AppError("Category not found", 404));
  success(res, cat, "Category fetched");
};

export const updateCategory = async (req, res, next) => {
  const data = { ...req.body };
  if (req.file) data.image = `/uploads/products/${req.file.filename}`;
  if (data.collection === "") data.collection = null;
  if (data.parentCategory === "") data.parentCategory = null;
  const cat = await Category.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!cat) return next(new AppError("Category not found", 404));
  success(res, cat, "Category updated");
};

export const deleteCategory = async (req, res, next) => {
  const cat = await Category.findByIdAndDelete(req.params.id);
  if (!cat) return next(new AppError("Category not found", 404));
  success(res, null, "Category deleted");
};
