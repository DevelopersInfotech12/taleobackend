import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { uploadProduct } from "../config/multer.js";
import { getNewCollection, updateNewCollection } from "../controllers/newCollectionController.js";

const router = express.Router();

router.get("/", getNewCollection);

router.use(protect, adminOnly);
router.put("/", uploadProduct.single("image"), updateNewCollection);

export default router;