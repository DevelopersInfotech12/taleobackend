import multer from "multer";

const imageFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  if (allowed.test(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadProduct = upload;
export const uploadBlog = upload;