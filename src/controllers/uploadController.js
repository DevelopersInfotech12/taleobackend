import { success } from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";

export const uploadImage = async (req, res, next) => {
  if (!req.file) return next(new AppError("No file uploaded", 400));
  // Cloudinary returns full HTTPS URL in req.file.path
  const url = req.file.path;
  success(res, { url, filename: req.file.filename }, "Image uploaded");
};
