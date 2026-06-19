import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Blog from "../models/Blog.js";
import { success } from "../utils/apiResponse.js";

export const getDashboard = async (_req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalOrders, monthOrders, lastMonthOrders,
    totalRevenue, monthRevenue,
    totalCustomers, newCustomers,
    lowStockProducts, totalProducts,
    totalBlogs, recentOrders, topProducts,
    monthlySales,
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }),
    Order.aggregate([{ $match: { status: { $nin: ["cancelled", "returned"] } } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
    Order.aggregate([{ $match: { status: { $nin: ["cancelled", "returned"] }, createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
    User.countDocuments({ role: "customer" }),
    User.countDocuments({ role: "customer", createdAt: { $gte: startOfMonth } }),
    Product.countDocuments({ stock: { $lt: 10 }, isActive: true }),
    Product.countDocuments({ isActive: true }),
    Blog.countDocuments({ isPublished: true }),
    Order.find().populate("user", "name email").sort("-createdAt").limit(8).select("orderNumber total status createdAt user"),
    Product.find({ isActive: true }).sort("-soldCount").limit(5).select("name images price soldCount stock"),
    Order.aggregate([
      { $match: { status: { $nin: ["cancelled", "returned"] }, createdAt: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
      { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, revenue: { $sum: "$total" }, orders: { $sum: 1 } } },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]),
  ]);

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlySalesFormatted = monthlySales.map(m => ({
    name: `${monthNames[m._id.month - 1]} ${m._id.year}`,
    revenue: m.revenue,
    orders: m.orders,
  }));

  success(res, {
    stats: {
      totalRevenue: totalRevenue[0]?.total || 0,
      monthRevenue: monthRevenue[0]?.total || 0,
      totalOrders, monthOrders, lastMonthOrders,
      totalCustomers, newCustomers,
      lowStockProducts, totalProducts, totalBlogs,
    },
    recentOrders,
    topProducts,
    monthlySales: monthlySalesFormatted,
  }, "Dashboard fetched");
};
