import { Router } from "express";
import { protectedEndpoint } from "../controllers/protected.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const protectedRouter = Router();

// Protected route
protectedRouter.get("/protected", authMiddleware, protectedEndpoint);

export default protectedRouter;
