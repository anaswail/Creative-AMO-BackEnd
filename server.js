// Import dependencies
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import jwt from "jsonwebtoken";

// Import local modules
import { connectDb } from "./config/db.js";
import users from "./routes/users.js";
import courses from "./routes/courses.js";
import admins from "./routes/admins.js";
import { verifyAdminToken, addAdmin } from "./controlers/admins.js";
import User from "./models/User.js";
import Admin from "./models/Admin.js";

// Initialize app and environment variables
dotenv.config({ path: "./config/config.env" });
const app = express();
const PORT = process.env.PORT || 3000 || 3001 || 9000;

// Middleware setup
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "https://creative-amo.vercel.app/", // Allow the frontend origin
    credentials: true, // Allow cookies and credentials
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    methods: "GET, POST, PUT, DELETE,OPTIONS", // Specify allowed methods
  })
);

// Routes
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

app.use("/api/v1/users", users);
app.use("/api/v1/courses", courses);
app.use("/admin", admins);

// Start the server and connect to the database
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
