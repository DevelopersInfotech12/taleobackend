import Task from "../models/Task.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";

export const adminGetTasks = async (req, res) => {
  const { status, priority, page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: "i" };
  const skip = (Number(page) - 1) * Number(limit);
  const [tasks, total] = await Promise.all([
    Task.find(filter).populate("createdBy", "name email").sort("-createdAt").skip(skip).limit(Number(limit)),
    Task.countDocuments(filter),
  ]);
  success(res, { tasks, total, page: Number(page), pages: Math.ceil(total / Number(limit)) }, "Tasks fetched");
};

export const adminGetTask = async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate("createdBy", "name email");
  if (!task) return next(new AppError("Task not found", 404));
  success(res, task, "Task fetched");
};

export const adminCreateTask = async (req, res, next) => {
  const { title, description, priority, status, dueDate, assignedTo } = req.body;
  if (!title) return next(new AppError("Task title is required", 400));
  const task = await Task.create({
    title, description, priority, status, dueDate, assignedTo,
    createdBy: req.user._id,
  });
  success(res, task, "Task created", 201);
};

export const adminUpdateTask = async (req, res, next) => {
  const { title, description, priority, status, dueDate, assignedTo } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task) return next(new AppError("Task not found", 404));
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (status !== undefined) task.status = status;
  if (dueDate !== undefined) task.dueDate = dueDate;
  if (assignedTo !== undefined) task.assignedTo = assignedTo;
  await task.save();
  success(res, task, "Task updated");
};

export const adminDeleteTask = async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) return next(new AppError("Task not found", 404));
  await task.deleteOne();
  success(res, null, "Task deleted");
};
