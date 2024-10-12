import { Router } from "express";
import {
  loginController,
  verifyOtpController,
  getMeController,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateSchema } from "../middlewares/schemaMiddleware";
import { loginSchema, verifySchema } from "../schemas/authSchema";

const authRouter = Router();

// Login route
authRouter.post("/login", validateSchema(loginSchema), loginController);

// Verify OTP
authRouter.post("/verify", validateSchema(verifySchema), verifyOtpController);

// Get user info (protected)
authRouter.get("/get-me", authMiddleware, getMeController);

export default authRouter;
