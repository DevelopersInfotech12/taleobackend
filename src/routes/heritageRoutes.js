import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { uploadProduct } from "../config/multer.js";
import {
  getHeritage,
  updateHeritage,
  addHeritageImage,
  updateHeritageImage,
  deleteHeritageImage,
  reorderHeritageImages,
} from "../controllers/heritageController.js";

const router = express.Router();

// Public — homepage "Masterfully crafted in India" section reads this
router.get("/", getHeritage);

// Admin
router.use(protect, adminOnly);
router.put("/", updateHeritage);
router.put("/images/reorder", reorderHeritageImages);
router.post("/images", uploadProduct.single("image"), addHeritageImage);
router.put("/images/:imageId", uploadProduct.single("image"), updateHeritageImage);
router.delete("/images/:imageId", deleteHeritageImage);

export default router;
