import { Router } from "express";
import {
  getMeController,
  loginController,
  verifyOtpController,
} from "../controllers/authController";
import { publicEndpoint } from "../controllers/publicController";
import { protectedEndpoint } from "../controllers/protectedController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { adminOnlyEndpoint } from "../controllers/adminController";
import { getUsersController } from "../controllers/usersController";

const router = Router();

router.get("/users", adminMiddleware, getUsersController);

router.get("/get-me", authMiddleware, getMeController);

// Public route
router.get("/public", publicEndpoint);

// Login route (public)
router.post("/login", loginController);

// Verify OTP and get token (public)
router.post("/verify", verifyOtpController);

// Protected route
router.get("/protected", authMiddleware, protectedEndpoint);

router.get("/checkAdmin", adminMiddleware, adminOnlyEndpoint);

export default router;
