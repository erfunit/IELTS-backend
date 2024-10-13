import { Router } from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import bookRouter from "./book.routes";

const router = Router();

// Combine all route files
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/books", bookRouter);

export default router;
