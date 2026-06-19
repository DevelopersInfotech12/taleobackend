import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";

export const adminGetUsers = async (req, res) => {
  const { search, role, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).sort("-createdAt").skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);
  success(res, { users, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, "Users fetched");
};

export const adminGetUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found", 404));
  success(res, user, "User fetched");
};

export const adminToggleUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("User not found", 404));
  user.isActive = !user.isActive;
  await user.save();
  success(res, user, `User ${user.isActive ? "activated" : "deactivated"}`);
};

export const adminUpdateUserRole = async (req, res, next) => {
  const { role } = req.body;
  if (!["customer", "admin"].includes(role)) return next(new AppError("Invalid role", 400));
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return next(new AppError("User not found", 404));
  success(res, user, "User role updated");
};
