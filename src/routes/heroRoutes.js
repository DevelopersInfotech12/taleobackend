import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { uploadProduct } from "../config/multer.js";
import {
  getHeroSlides,
  getHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  reorderHeroSlides,
} from "../controllers/heroController.js";

const router = express.Router();

// Two named image fields: desktop + mobile
const heroUpload = uploadProduct.fields([
  { name: "image", maxCount: 1 },
  { name: "mobileImage", maxCount: 1 },
]);

// Public — homepage hero reads this
router.get("/", getHeroSlides);

// Admin
router.use(protect, adminOnly);
router.put("/reorder", reorderHeroSlides);
router.get("/:id", getHeroSlide);
router.post("/", heroUpload, createHeroSlide);
router.put("/:id", heroUpload, updateHeroSlide);
router.delete("/:id", deleteHeroSlide);

export default router;
