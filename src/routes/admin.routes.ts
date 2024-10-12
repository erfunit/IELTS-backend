import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { adminOnlyEndpoint } from "../controllers/admin.controller";

const adminRouter = Router();

// Admin-only route
adminRouter.get("/checkAdmin", adminMiddleware, adminOnlyEndpoint);

export default adminRouter;
