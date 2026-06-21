import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  adminGetTasks, adminGetTask, adminCreateTask, adminUpdateTask, adminDeleteTask,
} from "../controllers/taskController.js";

const router = express.Router();
router.use(protect, adminOnly);
router.get("/",        adminGetTasks);
router.post("/",       adminCreateTask);
router.get("/:id",     adminGetTask);
router.put("/:id",     adminUpdateTask);
router.delete("/:id",  adminDeleteTask);
export default router;
