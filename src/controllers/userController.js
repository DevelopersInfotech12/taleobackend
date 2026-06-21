import User from "../models/User.js";
import Order from "../models/Order.js";
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

// ── Customers (customer accounts + their order history) ────
export const adminGetCustomers = async (req, res) => {
  const { search, page = 1, limit = 10, sort = "newest" } = req.query;
  const filter = { role: "customer" };
  if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }];
  const skip = (Number(page) - 1) * Number(limit);

  const [customers, total] = await Promise.all([
    User.find(filter).sort("-createdAt").skip(skip).limit(Number(limit)),
    User.countDocuments(filter),
  ]);

  const customerIds = customers.map(c => c._id);
  const orderStats = await Order.aggregate([
    { $match: { user: { $in: customerIds } } },
    { $group: {
        _id: "$user",
        orderCount: { $sum: 1 },
        totalSpent: { $sum: { $cond: [{ $in: ["$status", ["cancelled", "returned"]] }, 0, "$total"] } },
        lastOrderAt: { $max: "$createdAt" },
      } },
  ]);
  const statsMap = {};
  orderStats.forEach(s => { statsMap[s._id.toString()] = s; });

  let list = customers.map(c => ({
    ...c.toJSON(),
    orderCount: statsMap[c._id.toString()]?.orderCount || 0,
    totalSpent: statsMap[c._id.toString()]?.totalSpent || 0,
    lastOrderAt: statsMap[c._id.toString()]?.lastOrderAt || null,
  }));

  if (sort === "spent-desc") list = [...list].sort((a, b) => b.totalSpent - a.totalSpent);
  else if (sort === "orders-desc") list = [...list].sort((a, b) => b.orderCount - a.orderCount);
  else if (sort === "oldest") list = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  success(res, { customers: list, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, "Customers fetched");
};

export const adminGetCustomer = async (req, res, next) => {
  const customer = await User.findOne({ _id: req.params.id, role: "customer" });
  if (!customer) return next(new AppError("Customer not found", 404));

  const orders = await Order.find({ user: customer._id }).sort("-createdAt");
  const totalSpent = orders.reduce((sum, o) => (["cancelled", "returned"].includes(o.status) ? sum : sum + o.total), 0);

  success(res, {
    customer,
    orders,
    stats: { orderCount: orders.length, totalSpent },
  }, "Customer fetched");
};
