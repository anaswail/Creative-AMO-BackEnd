import express from "express";
import {
    verifyAdminToken,
    addAdmin
} from "../controlers/admins.js";
const router = express.Router();

// GET request to fetch all notes and POST request to create a new note
router.route("/check").get(verifyAdminToken)
router.route("/add").post(addAdmin)


export default router;
