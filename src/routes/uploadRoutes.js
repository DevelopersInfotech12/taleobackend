import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { uploadBlog } from "../config/multer.js";
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();
router.use(protect, adminOnly);
router.post("/image", uploadBlog.single("image"), uploadImage);
export default router;
