import express from "express";
import {
    register,
    login,
    userData,
    updateCourseProgress
} from "../controlers/users.js";
const router = express.Router();

// GET request to fetch all notes and POST request to create a new note
router.route("/register").post(register)
router.route("/login").post(login);
router.route("/me").get(userData);
router.route("/progress").post(updateCourseProgress);


export default router;
