import express from "express";
import { registerUser, loginUser, logoutUser, getProfile } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Registro
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Logout
router.post("/logout", logoutUser);

// Perfil protegido
router.get("/profile", protect, getProfile);

export default router;
