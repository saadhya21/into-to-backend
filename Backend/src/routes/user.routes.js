import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";

const router = express.Router();

// User authentication routes
router.post("/register", registerUser);
router.post("/signup", registerUser); // Alias for register
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
