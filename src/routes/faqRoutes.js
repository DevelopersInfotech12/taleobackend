import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { uploadProduct } from "../config/multer.js";
import {
  getFaq,
  updateFaq,
  addFaqItem,
  updateFaqItem,
  deleteFaqItem,
  reorderFaqItems,
} from "../controllers/faqController.js";

const router = express.Router();

// Public — homepage FAQ section reads this
router.get("/", getFaq);

// Admin
router.use(protect, adminOnly);
router.put("/", uploadProduct.single("image"), updateFaq);
router.put("/items/reorder", reorderFaqItems);
router.post("/items", addFaqItem);
router.put("/items/:itemId", updateFaqItem);
router.delete("/items/:itemId", deleteFaqItem);

export default router;
