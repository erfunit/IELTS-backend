import { Router } from "express";
import authRouter from "./authRoutes";
import userRouter from "./userRoutes";
import adminRouter from "./adminRoutes";
import publicRouter from "./publicRoutes";
import protectedRouter from "./protectedRoutes";

const router = Router();

// Combine all route files
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use(adminRouter);
router.use(publicRouter);
router.use(protectedRouter);

export default router;
