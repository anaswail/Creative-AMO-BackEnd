// import express and config
import express from "express";
const app = express();
app.use(express.json());

// import dotenv
import dotenv from "dotenv";
dotenv.config({path:"./config/config.env"});

// import morgan
import morgan from "morgan";
app.use(morgan("dev"));

import cors from 'cors';


app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));



// import connect Db
import { connectDb } from './config/db.js';

// import router
import users from './routes/users.js';
import courses from './routes/courses.js';
import admins from './routes/admins.js';

// routes
import {
    verifyAdminToken,
    addAdmin
} from "./controlers/admins.js";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Admin from "./models/Admin.js";

app.get('/api/v1/admin/check', verifyAdminToken, (req, res) => {
  res.json({
    message: 'Authorized access',
    admin: req.admin.role
  });
});
app.post('/api/v1/admin/add', async (req, res) => {
  const admin = await addAdmin(req, res);
  res = admin;
});

// app.use("/admin", admins);
app.use("/api/v1/users", users);
app.use("/api/v1/courses", courses);

// start the server
app.listen(22756 || 3000 || process.env.PORT , async () => {
    
        await connectDb();
        console.log("Server is running at 22756");
        console.log("db is connected")
    
});
