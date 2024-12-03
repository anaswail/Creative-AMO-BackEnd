// Import dependencies
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

// Import local modules
import { connectDb } from "./config/db.js";
import users from "./routes/users.js";

// Initialize app and environment variables
dotenv.config({ path: "./config/config.env" });
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(morgan("dev"));

// Debug: Log every request
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// CORS Middleware
app.use(
  cors({
    origin: "https://creative-amo.vercel.app", // Allow only this origin
    credentials: true, // Allow cookies and credentials
    methods: "GET, POST, PUT, DELETE, OPTIONS", // Specify allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

// Handle Preflight Requests
app.options("*", (req, res) => {
  res.sendStatus(200); // Respond to OPTIONS requests for preflight
});

// Routes
app.use("/api/v1/users", users);

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
