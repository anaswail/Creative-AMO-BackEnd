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
import { verifyAdminToken, addAdmin } from "./controllers/admins.js";

// Initialize app and environment variables
dotenv.config({ path: "./config/config.env" });
const app = express();
const PORT = process.env.PORT || 22756;

// Middleware setup
app.use(express.json());
app.use(morgan("dev"));

// Configure CORS
app.use(
  cors({
    origin: [
      "https://thoughtless-effectst.surge.sh", // Frontend URL
      "http://localhost:3000", // Local development URL
    ],
    credentials: true, // Allow cookies and credentials
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Specify allowed methods
    optionsSuccessStatus: 204, // Prevent OPTIONS response redirects
  })
);

// Avoid redirects for HTTPS requests
app.enable("trust proxy"); // For proxies (e.g., Vercel)
// Force HTTPS if required
app.use((req, res, next) => {
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    next();
  } else {
    res.status(403).send("HTTPS Required");
  }
});

// Routes
app.get("/api/v1/admin/check", verifyAdminToken, (req, res) => {
  res.json({
    message: "Authorized access",
    admin: req.admin.role,
  });
});

app.post("/api/v1/admin/add", async (req, res) => {
  const admin = await addAdmin(req, res);
  res.json(admin);
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
