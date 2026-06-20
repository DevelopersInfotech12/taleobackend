import express from "express";
import { protect } from "../middleware/auth.js";
import { getWishlist, toggleWishlist, clearWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

router.use(protect); // all wishlist routes require login

router.get("/",                  getWishlist);
router.post("/:productId",       toggleWishlist);
router.delete("/",               clearWishlist);

export default router;