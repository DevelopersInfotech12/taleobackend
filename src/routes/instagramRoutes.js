import express from "express";
import { getInstagramPosts } from "../controllers/instagramController.js";

const router = express.Router();

// GET /api/v1/instagram/posts?limit=12
router.get("/posts", getInstagramPosts);

export default router;
