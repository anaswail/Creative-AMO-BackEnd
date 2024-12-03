// Import dependencies
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

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
    origin: [process.env.CLIENT_DEV_URL, process.env.CLIENT_PROD_URL],
    credentials: true,
  })
);

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
