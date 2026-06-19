import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `taleo/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    },
  });

const imageFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  if (
    allowed.test(path.extname(file.originalname).toLowerCase()) &&
    allowed.test(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const uploadProduct = multer({
  storage: storage("products"),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadBlog = multer({
  storage: storage("blogs"),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
