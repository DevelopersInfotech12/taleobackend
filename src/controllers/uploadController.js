import { success } from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export const uploadImage = async (req, res, next) => {
  if (!req.file) return next(new AppError("No file uploaded", 400));
  try {
    const folder = req.query.folder || "taleo/blogs";
    const result = await uploadToCloudinary(req.file.buffer, folder);
    success(res, { url: result.secure_url, filename: result.public_id }, "Image uploaded");
  } catch (err) {
    return next(new AppError("Image upload failed", 500));
  }
};
