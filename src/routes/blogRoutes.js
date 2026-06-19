import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  getPublishedBlogs, getBlogBySlug,
  adminGetBlogs, adminGetBlog, getBlogStats,
  createBlog, updateBlog,
  toggleStatus, toggleFeatured,
  deleteBlog, bulkAction,
} from "../controllers/blogController.js";

const router = express.Router();

// Public
router.get("/published",       getPublishedBlogs);
router.get("/public/:slug",    getBlogBySlug);

// Admin protected
router.use(protect, adminOnly);
router.get("/",                adminGetBlogs);
router.get("/stats",           getBlogStats);
router.get("/:id",             adminGetBlog);
router.post("/",               createBlog);
router.post("/bulk",           bulkAction);
router.put("/:id",             updateBlog);
router.patch("/:id/status",    toggleStatus);
router.patch("/:id/featured",  toggleFeatured);
router.delete("/:id",          deleteBlog);

export default router;
