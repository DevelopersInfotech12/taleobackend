import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { uploadProduct } from "../config/multer.js";
import {
  getProductHeroSlides,
  getProductHeroSlide,
  createProductHeroSlide,
  updateProductHeroSlide,
  deleteProductHeroSlide,
  reorderProductHeroSlides,
} from "../controllers/productHeroController.js";

const router = express.Router();

// Two named image fields: desktop + mobile
const heroUpload = uploadProduct.fields([
  { name: "image", maxCount: 1 },
  { name: "mobileImage", maxCount: 1 },
]);

// Public — /products page hero reads this
router.get("/", getProductHeroSlides);

// Admin
router.use(protect, adminOnly);
router.put("/reorder", reorderProductHeroSlides);
router.get("/:id", getProductHeroSlide);
router.post("/", heroUpload, createProductHeroSlide);
router.put("/:id", heroUpload, updateProductHeroSlide);
router.delete("/:id", deleteProductHeroSlide);

export default router;
