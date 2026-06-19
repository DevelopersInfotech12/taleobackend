import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { success } from "../utils/apiResponse.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwt.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const sendToken = (res, user, statusCode = 200, message = "Success") => {
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  success(res, { user, token }, message, statusCode);
};

export const register = async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) return next(new AppError("Name, email and password required", 400));

  const exists = await User.findOne({ email });
  if (exists) return next(new AppError("Email already registered", 400));

  const user = await User.create({ name, email, password, phone });
  sendToken(res, user, 201, "Registered successfully");
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError("Email and password required", 400));

  const user = await User.findOne({ email }).select("+password +googleId");
  if (!user) return next(new AppError("Invalid email or password", 401));
  if (!user.password) {
    return next(new AppError("This account uses Google Sign-In. Please continue with Google.", 400));
  }
  if (!(await user.comparePassword(password))) {
    return next(new AppError("Invalid email or password", 401));
  }
  if (!user.isActive) return next(new AppError("Account is disabled", 403));
  sendToken(res, user, 200, "Logged in successfully");
};

export const googleLogin = async (req, res, next) => {
  const { credential } = req.body;
  if (!credential) return next(new AppError("Google credential is required", 400));

  if (!process.env.GOOGLE_CLIENT_ID) {
    return next(new AppError("Google Sign-In is not configured on the server", 500));
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    return next(new AppError("Invalid Google credential", 401));
  }

  const { sub: googleId, email, name, picture, email_verified } = payload;
  if (!email || !email_verified) return next(new AppError("Google account email not verified", 400));

  let user = await User.findOne({ $or: [{ googleId }, { email }] }).select("+googleId");

  if (!user) {
    user = await User.create({ name: name || email.split("@")[0], email, googleId, avatar: picture });
  } else if (!user.googleId) {
    user.googleId = googleId;
    if (picture && !user.avatar) user.avatar = picture;
    await user.save();
  }

  if (!user.isActive) return next(new AppError("Account is disabled", 403));
  sendToken(res, user, 200, "Logged in with Google");
};

export const logout = (_req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  success(res, null, "Logged out successfully");
};

export const getMe = (req, res) => {
  success(res, req.user, "Profile fetched");
};

export const updateProfile = async (req, res, next) => {
  const { name, phone } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true, runValidators: true });
  if (!user) return next(new AppError("User not found", 404));
  success(res, user, "Profile updated");
};

export const addAddress = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));
  if (req.body.isDefault) user.addresses.forEach((a) => (a.isDefault = false));
  user.addresses.push(req.body);
  await user.save();
  success(res, user.addresses, "Address added");
};

export const deleteAddress = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addrId);
  await user.save();
  success(res, user.addresses, "Address removed");
};

export const toggleWishlist = async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new AppError("User not found", 404));
  const pid = req.params.productId;
  const idx = user.wishlist.findIndex((id) => id.toString() === pid);
  if (idx > -1) {
    user.wishlist.splice(idx, 1);
  } else {
    user.wishlist.push(pid);
  }
  await user.save();
  success(res, user.wishlist, idx > -1 ? "Removed from wishlist" : "Added to wishlist");
};

export const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  success(res, user.wishlist, "Wishlist fetched");
};
