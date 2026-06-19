import express from "express";
import { getCart, addItem, updateItem, removeItem, clearCart, mergeCart } from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/",            getCart);
router.post("/",           addItem);
router.post("/merge",      mergeCart);
router.put("/:itemId",     updateItem);
router.delete("/:itemId",  removeItem);
router.delete("/",         clearCart);

export default router;
