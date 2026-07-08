import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  reorderAnnouncements,
} from "../controllers/announcementController.js";

const router = express.Router();

router.get("/", getAnnouncements);
router.use(protect, adminOnly);
router.post("/", createAnnouncement);
router.put("/reorder", reorderAnnouncements);
router.put("/:id", updateAnnouncement);
router.delete("/:id", deleteAnnouncement);

export default router;
