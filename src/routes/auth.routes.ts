import { Router } from "express";
import {
  loginController,
  verifyOtpController,
  getMeController,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateSchema } from "../middlewares/schema.middleware";
import { loginSchema, verifySchema } from "../schemas/auth.schema";

const authRouter = Router();

// Login route
authRouter.post("/login", validateSchema(loginSchema), loginController);

// Verify OTP
authRouter.post("/verify", validateSchema(verifySchema), verifyOtpController);

// Get user info (protected)
authRouter.get("/get-me", authMiddleware, getMeController);

export default authRouter;
