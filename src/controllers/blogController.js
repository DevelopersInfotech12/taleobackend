import Blog from "../models/Blog.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";
import { generateSlug } from "../utils/slugify.js";

const buildQuery = (q) => {
  const { status, tag, featured, search } = q;
  const filter = {};
  if (status)              filter.status = status;
  if (tag)                 filter.tag = tag;
  if (featured !== undefined) filter.featured = featured === "true";
  if (search) filter.$or = [
    { title:   { $regex: search, $options: "i" } },
    { excerpt: { $regex: search, $options: "i" } },
    { tags:    { $in: [new RegExp(search, "i")] } },
  ];
  return filter;
};

// Public — published listing
export const getPublishedBlogs = async (req, res) => {
  const blogs = await Blog.find({ status: "published" })
    .select("slug title tag date featured readTime author img excerpt tagStyle heroImg heroGradient tags highlights related")
    .sort({ featured: -1, createdAt: -1 })
    .lean();
  success(res, blogs, "Blogs fetched");
};

// Public — single by slug + view++
export const getBlogBySlug = async (req, res, next) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, status: "published" },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();
  if (!blog) return next(new AppError("Blog not found", 404));
  success(res, blog, "Blog fetched");
};

// Admin — all blogs
export const adminGetBlogs = async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip  = (page - 1) * limit;
  const filter = buildQuery(req.query);

  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .select("slug title tag date status featured readTime author views createdAt updatedAt img heroImg excerpt seo")
      .sort({ createdAt: -1 })
      .skip(skip).limit(limit).lean(),
    Blog.countDocuments(filter),
  ]);

  res.json({ success: true, data: blogs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};

// Admin — single by id or slug
export const adminGetBlog = async (req, res, next) => {
  const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: req.params.id }
    : { slug: req.params.id };
  const blog = await Blog.findOne(query).lean();
  if (!blog) return next(new AppError("Blog not found", 404));
  success(res, blog, "Blog fetched");
};

// Admin — stats
export const getBlogStats = async (req, res) => {
  const [total, published, drafts, featured, byTag] = await Promise.all([
    Blog.countDocuments(),
    Blog.countDocuments({ status: "published" }),
    Blog.countDocuments({ status: "draft" }),
    Blog.countDocuments({ featured: true }),
    Blog.aggregate([{ $group: { _id: "$tag", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
  ]);
  success(res, { total, published, drafts, featured, byTag }, "Stats fetched");
};

// Admin — create
export const createBlog = async (req, res) => {
  const body = { ...req.body };
  if (!body.slug && body.title) body.slug = generateSlug(body.title);
  const existing = await Blog.findOne({ slug: body.slug });
  if (existing) body.slug = `${body.slug}-${Date.now()}`;
  if (body.seo) {
    if (!body.seo.metaTitle)       body.seo.metaTitle = body.title;
    if (!body.seo.metaDescription) body.seo.metaDescription = body.excerpt?.substring(0, 160);
    if (!body.seo.ogTitle)         body.seo.ogTitle = body.title;
    if (!body.seo.ogImage)         body.seo.ogImage = body.img;
  }
  const blog = await Blog.create(body);
  success(res, blog, "Blog created", 201);
};

// Admin — update
export const updateBlog = async (req, res, next) => {
  const body = { ...req.body };
  if (body.regenerateSlug && body.title) {
    const newSlug = generateSlug(body.title);
    const conflict = await Blog.findOne({ slug: newSlug, _id: { $ne: req.params.id } });
    body.slug = conflict ? `${newSlug}-${Date.now()}` : newSlug;
    delete body.regenerateSlug;
  }
  const blog = await Blog.findByIdAndUpdate(req.params.id, body, { new: true, runValidators: true });
  if (!blog) return next(new AppError("Blog not found", 404));
  success(res, blog, "Blog updated");
};

// Admin — toggle status
export const toggleStatus = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new AppError("Blog not found", 404));
  blog.status = blog.status === "published" ? "draft" : "published";
  await blog.save();
  success(res, { status: blog.status }, `Blog ${blog.status}`);
};

// Admin — toggle featured
export const toggleFeatured = async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return next(new AppError("Blog not found", 404));
  if (!blog.featured) await Blog.updateMany({ featured: true }, { featured: false });
  blog.featured = !blog.featured;
  await blog.save();
  success(res, { featured: blog.featured }, "Featured updated");
};

// Admin — delete
export const deleteBlog = async (req, res, next) => {
  const blog = await Blog.findByIdAndDelete(req.params.id);
  if (!blog) return next(new AppError("Blog not found", 404));
  success(res, null, "Blog deleted");
};

// Admin — bulk
export const bulkAction = async (req, res) => {
  const { action, ids } = req.body;
  if (!ids?.length) throw new AppError("No IDs provided", 400);
  let result;
  switch (action) {
    case "publish": result = await Blog.updateMany({ _id: { $in: ids } }, { status: "published" }); break;
    case "draft":   result = await Blog.updateMany({ _id: { $in: ids } }, { status: "draft" }); break;
    case "delete":  result = await Blog.deleteMany({ _id: { $in: ids } }); break;
    default: throw new AppError("Invalid action", 400);
  }
  success(res, null, `Bulk ${action} done. Affected: ${result.modifiedCount || result.deletedCount}`);
};
