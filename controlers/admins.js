import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

dotenv.config({ path: "./config/config.env" });


export const verifyAdminToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // التحقق من التوكن
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const userId = decoded.id;
    console.log(userId); // هذا الـ ID سيكون من جدول المستخدمين (Users)

    try {
      // الخطوة 1: استرجاع بيانات المستخدم باستخدام الـ ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // الخطوة 2: التحقق إذا كان المستخدم هو Admin عبر الـ email
      const admin = await Admin.findOne({ email: user.email });

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      // الخطوة 3: التأكد من أن الدور (role) هو "admin"
      if (admin.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to access this resource" });
      }

      // إضافة admin إلى الـ request لكي نتمكن من استخدامه في المسار التالي
      req.admin = admin;

      // إذا كان كل شيء صحيحًا، نمرر التنفيذ إلى الـ middleware التالي
      next();
    } catch (err) {
      return res.status(500).json({ message: "Server error", error: err });
    }
  });
};

export const addAdmin = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    const userId = decoded.id;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const admin = await Admin.findOne({ email: user.email });

      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      if (admin.role !== "admin") {
        return res.status(403).json({ message: "You are not authorized to access this resource" });
      }

      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const existingAdmin = await Admin.findOne({ email });

      if (existingAdmin) {
        return res.status(400).json({ message: "Admin already exists" });
      }

      const newAdmin = new Admin({
        email,
        role: "admin",
      });

      await newAdmin.save();

      return res.status(201).json({ message: "Admin added successfully", admin: newAdmin });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  });
};
