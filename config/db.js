import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const dbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.cf6q7.mongodb.net`;

console.log(process.env.DB_USERNAME);
console.log(process.env.DB_PASSWORD);
console.log(dbUrl);

export const connectDb = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};
