import express from "express";
import authRoutes       from "./authRoutes.js";
import productRoutes    from "./productRoutes.js";
import categoryRoutes   from "./categoryRoutes.js";
import collectionRoutes from "./collectionRoutes.js";
import orderRoutes      from "./orderRoutes.js";
import couponRoutes     from "./couponRoutes.js";
import blogRoutes       from "./blogRoutes.js";
import userRoutes       from "./userRoutes.js";
import dashboardRoutes  from "./dashboardRoutes.js";
import instagramRoutes  from "./instagramRoutes.js";
import cartRoutes       from "./cartRoutes.js";
import paymentRoutes    from "./paymentRoutes.js";
import uploadRoutes     from "./uploadRoutes.js";
import wishlistRoutes from "./wishlistRoutes.js"
import taskRoutes from "./taskRoutes.js";
import announcementRoutes from "./announcementRoutes.js";

const router = express.Router();
router.use("/auth",        authRoutes);
router.use("/products",    productRoutes);
router.use("/categories",  categoryRoutes);
router.use("/collections", collectionRoutes);
router.use("/orders",      orderRoutes);
router.use("/coupons",     couponRoutes);
router.use("/blogs",       blogRoutes);
router.use("/users",       userRoutes);
router.use("/dashboard",   dashboardRoutes);
router.use("/instagram",   instagramRoutes);
router.use("/cart",        cartRoutes);
router.use("/payments",    paymentRoutes);
router.use("/upload",      uploadRoutes);
router.use("/wishlist", wishlistRoutes);            
router.use("/tasks",       taskRoutes);
router.use("/announcements", announcementRoutes);


export default router;
