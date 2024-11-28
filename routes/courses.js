import express from "express";
import {
    verifyToken,
    getCources
} from "../controlers/courses.js";
const router = express.Router();

// GET request to fetch all notes and POST request to create a new note
router.route("/get").get(getCources)
router.route("/add").post(verifyToken)


export default router;
