import dotenv from "dotenv";
dotenv.config({path:"./config/config.env"});
import mongoose from 'mongoose';
const password = process.env.PASSWORD;
const username = 'reqpingrespong';


const dbUrl = `mongodb+srv://reqpingrespong:${password}@cluster0.3ntop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


export const connectDb = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); 
  }
};
