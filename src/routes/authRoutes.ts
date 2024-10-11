import { Router } from "express";
import {
  loginController,
  verifyOtpController,
  getMeController,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const authRouter = Router();

// Login route
authRouter.post("/login", loginController);

// Verify OTP
authRouter.post("/verify", verifyOtpController);

// Get user info (protected)
authRouter.get("/get-me", authMiddleware, getMeController);

export default authRouter;
