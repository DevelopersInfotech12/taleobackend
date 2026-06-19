import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { getDashboard } from "../controllers/dashboardController.js";
const router = express.Router();
router.get("/", protect, adminOnly, getDashboard);
export default router;
