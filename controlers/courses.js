import jwt from "jsonwebtoken";
import fs from "fs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

dotenv.config({ path: "./config/config.env" });

export const verifyToken = (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; 

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }


  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = decoded;

    saveCourseData(req.body, res);
  });
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveCourseData = (courseData, res) => {
  const filePath = path.join(__dirname, '../data/courses.json');

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  fs.readFile(filePath, 'utf8', (err, data) => {
    let courses = [];

    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ message: 'Error reading the courses file' });
    }

    if (data) {
      courses = JSON.parse(data); 
    }

    const { category, instructor, playListId, discription } = courseData;

    // Validate the category field
    if (!category) {
      return res.status(400).json({ message: 'Category is required and cannot be undefined' });
    }

    const newId = courses.reduce((maxId, courseCategory) => {
      const maxCategoryId = Math.max(...(courseCategory[category]?.map(course => course.id) || []), 0);
      return Math.max(maxId, maxCategoryId);
    }, 0) + 1;

    const newCourse = { id: newId, instructor, playListId, lang: category, discription };

    const categoryExists = courses.find(course => course[category]);
    if (categoryExists) {
      categoryExists[category].push(newCourse);
    } else {
      courses.push({
        [category]: [newCourse]
      });
    }

    fs.writeFile(filePath, JSON.stringify(courses, null, 2), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to write data to file' });
      }
      return res.status(200).json({ message: 'Course added successfully', courses });
    });
  });
};


export const getCources = (req, res) => {
  const filePath = path.join(__dirname, '../data/courses.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      return res.status(500).json({ message: 'Error reading the courses file' });
    }

    const courses = data ? JSON.parse(data) : [];

    return res.status(200).json({ courses });
  });
}