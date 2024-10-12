import { Router } from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import adminRouter from "./admin.routes";
import publicRouter from "./public.routes";
import protectedRouter from "./protected.routes";

const router = Router();

// Combine all route files
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use(adminRouter);
router.use(publicRouter);
router.use(protectedRouter);

export default router;
