import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { uploadProduct } from "../config/multer.js";
import {
  getPromoBanners,
  createPromoBanner,
  updatePromoBanner,
  deletePromoBanner,
  reorderPromoBanners,
} from "../controllers/promoBannerController.js";

const router = express.Router();

const bannerUpload = uploadProduct.fields([
  { name: "image", maxCount: 1 },
  { name: "mobileImage", maxCount: 1 },
]);

// Public — homepage promo slider reads this
router.get("/", getPromoBanners);

// Admin
router.use(protect, adminOnly);
router.put("/reorder", reorderPromoBanners);
router.post("/", bannerUpload, createPromoBanner);
router.put("/:id", bannerUpload, updatePromoBanner);
router.delete("/:id", deletePromoBanner);

export default router;
