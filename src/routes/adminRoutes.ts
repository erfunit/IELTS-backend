import { Router } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import { adminOnlyEndpoint } from "../controllers/adminController";

const adminRouter = Router();

// Admin-only route
adminRouter.get("/checkAdmin", adminMiddleware, adminOnlyEndpoint);

export default adminRouter;
