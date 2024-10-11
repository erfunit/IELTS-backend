import { Router } from "express";
import { protectedEndpoint } from "../controllers/protectedController";
import { authMiddleware } from "../middlewares/authMiddleware";

const protectedRouter = Router();

// Protected route
protectedRouter.get("/protected", authMiddleware, protectedEndpoint);

export default protectedRouter;
