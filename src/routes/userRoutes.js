import express from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  adminGetUsers, adminGetUser, adminToggleUser, adminUpdateUserRole,
  adminGetCustomers, adminGetCustomer,
} from "../controllers/userController.js";
const router = express.Router();
router.use(protect, adminOnly);
router.get("/customers",     adminGetCustomers);
router.get("/customers/:id", adminGetCustomer);
router.get("/",              adminGetUsers);
router.get("/:id",           adminGetUser);
router.patch("/:id/toggle",  adminToggleUser);
router.patch("/:id/role",    adminUpdateUserRole);
export default router;
