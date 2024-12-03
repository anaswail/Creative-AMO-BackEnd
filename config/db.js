import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.3ntop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

export const connectDb = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
