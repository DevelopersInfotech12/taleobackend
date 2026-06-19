import { success } from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";

export const uploadImage = async (req, res, next) => {
  if (!req.file) return next(new AppError("No file uploaded", 400));
  const backendBase = process.env.SERVER_URL || "http://localhost:5000";
  const url = `${backendBase}/uploads/blogs/${req.file.filename}`;
  success(res, { url, filename: req.file.filename }, "Image uploaded");
};
