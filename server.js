import express from "express";
const app = express();
app.use(express.json());

// import dotenv
import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT || 3000;

// import morgan
import morgan from "morgan";
app.use(morgan("dev"));

import cors from "cors";

app.use(
  cors({
    origin: [process.env.CLIENT_DEV_URL, process.env.CLIENT_PROD_URL],
    credentials: true,
  })
);

// import connect Db
import { connectDb } from "./config/db.js";

// import router
import users from "./routes/users.js";
import courses from "./routes/courses.js";
import admins from "./routes/admins.js";

// routes
import { verifyAdminToken, addAdmin } from "./controlers/admins.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Admin from "./models/Admin.js";

app.get("/api/v1/admin/check", verifyAdminToken, (req, res) => {
  res.json({
    message: "Authorized access",
    admin: req.admin.role,
  });
});
app.post("/api/v1/admin/add", async (req, res) => {
  const admin = await addAdmin(req, res);
  res = admin;
});

// app.use("/admin", admins);
app.use("/api/v1/users", users);
app.use("/api/v1/courses", courses);

app.listen(PORT, async () => {
  try {
    await connectDb();
    console.log(`Server is running on port ${PORT}`);
    console.log("Database is connected");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
});
