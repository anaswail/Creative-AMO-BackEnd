import User from "../models/User.js";
import Validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
dotenv.config({path:"./config/config.env"});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

export const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Please provide an email and password" });
  }
  if (!firstname) {
    return res
    .status(400)
    .json({ success: false, error: "Please provide an firstname"})
  }
  if (!Validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, error: "Please provide a valid email" });
  }
  if (!Validator.isStrongPassword(password)) {
    return res
      .status(400)
      .json({ success: false, error: "Please provide a strong password" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const savedUser = await new User({
  firstname,
  lastname,
  email,
  password: hashedPassword,
 courses: [],
}).save();

    const token = generateToken(savedUser._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Please provide an email and password" });
  }
  if (!Validator.isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, error: "Please provide a valid email" });
  }
  try {
    const userExist = await User.findOne({email});
    if(!userExist) {
      return res
        .status(400)
        .json({success: false, error: "Invalid credentials"})
    }
    const isMatch = await bcrypt.compare(password, userExist.password);
    if(!isMatch) {
      return res
        .status(400)
        .json({success: false, error: "Invalid credentials"})
    }
    const token = generateToken(userExist._id);
    res.status(200).json({success: true, token});
  } catch (error) {
    res.status(500).json({success: false, error: error.message})
  }
};


export const userData = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, error: "Unauthorized: Invalid token" });
      }

      try {
        const user = await User.findById(decoded.id).select("firstname lastname email courses");

        if (!user) {
          return res.status(404).json({ success: false, error: "User not found" });
        }
        res.json({ success: true, fname: user.firstname, lname: user.lastname, email: user.email, courses: user.courses });
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ success: false, error: "Error fetching user data from database" });
      }
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ success: false, error: "Error fetching user data" });
  }
};

export const updateCourseProgress = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, error: "Unauthorized: No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ success: false, error: "Unauthorized: Invalid token" });
      }

      const { playlistId, videoIndex } = req.body;

      if (!playlistId || typeof videoIndex !== "number") {
        return res.status(400).json({
          success: false,
          error: "Please provide a valid playlistId and videoIndex",
        });
      }

      try {
        const user = await User.findById(decoded.id);

        if (!user) {
          return res.status(404).json({ success: false, error: "User not found" });
        }

        const course = user.courses.find((course) => course.playlistId === playlistId);

        if (course) {
          course.currentVideoIndex = videoIndex;
          course.progressDate = new Date();
        } else {
          user.courses.push({
            playlistId,
            currentVideoIndex: videoIndex,
            progressDate: new Date(),
          });
        }

        await user.save();
        res.json({ success: true, message: "Course progress updated successfully" });
      } catch (dbError) {
        console.error("Database error:", dbError);
        res.status(500).json({ success: false, error: "Error updating course progress in database" });
      }
    });
  } catch (error) {
    console.error("Error updating course progress:", error);
    res.status(500).json({ success: false, error: "Error updating course progress" });
  }
};
