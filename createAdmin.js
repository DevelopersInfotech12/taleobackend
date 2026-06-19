import "dotenv/config";

import mongoose from "mongoose";
import User from "./src/models/User.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/amama";

await mongoose.connect(MONGO_URI);

const existing = await User.findOne({ email: "admin@amama.com" });
if (existing) {
  console.log("Admin already exists. Email: admin@amama.com");
  process.exit(0);
}

await User.create({
  name: "Admin",
  email: "admin@amama.com",
  password: "Admin@1234",
  role: "admin",
  isActive: true,
});

console.log("✅ Admin created!");
console.log("   Email:    admin@amama.com");
console.log("   Password: Admin@1234");
await mongoose.disconnect();
