import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = (folder) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(__dirname, "../../uploads", folder));
    },
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });

const imageFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const uploadProduct = multer({ storage: storage("products"), fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });
export const uploadBlog    = multer({ storage: storage("blogs"),    fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 } });
