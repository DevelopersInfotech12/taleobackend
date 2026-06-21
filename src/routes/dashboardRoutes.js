import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import { getDashboard, getPendingShipments } from "../controllers/dashboardController.js";
const router = express.Router();
router.get("/", protect, adminOnly, getDashboard);
router.get("/pending-shipments", protect, adminOnly, getPendingShipments);
export default router;
