import Announcement from "../models/Announcement.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";

export const createAnnouncement = async (req, res) => {
  const announcement = await Announcement.create(req.body);
  success(res, announcement, "Announcement created", 201);
};

export const getAnnouncements = async (req, res) => {
  const { includeInactive } = req.query;
  const filter = includeInactive ? {} : { isActive: true };
  const announcements = await Announcement.find(filter).sort("sortOrder createdAt");
  success(res, announcements, "Announcements fetched");
};

export const updateAnnouncement = async (req, res, next) => {
  const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!announcement) return next(new AppError("Announcement not found", 404));
  success(res, announcement, "Announcement updated");
};

export const deleteAnnouncement = async (req, res, next) => {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);
  if (!announcement) return next(new AppError("Announcement not found", 404));
  success(res, null, "Announcement deleted");
};

export const reorderAnnouncements = async (req, res, next) => {
  const { order } = req.body; // array of ids in desired order
  if (!Array.isArray(order)) return next(new AppError("order must be an array of ids", 400));
  await Promise.all(order.map((id, idx) => Announcement.findByIdAndUpdate(id, { sortOrder: idx })));
  const announcements = await Announcement.find().sort("sortOrder createdAt");
  success(res, announcements, "Announcements reordered");
};
