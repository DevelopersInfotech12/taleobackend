import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { getAttributes, createAttribute, deleteAttribute } from "../controllers/attributeController.js";

const router = express.Router();
router.get("/",              protect,             getAttributes);
router.post("/",             protect, adminOnly,  createAttribute);
router.delete("/:type/:value", protect, adminOnly, deleteAttribute);

export default router;
