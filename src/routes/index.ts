import { Router } from "express";
import authRouter from "./auth.routes";
import userRouter from "./user.routes";
import bookRouter from "./book.routes";
import testRouter from "./test.routes";
import skillRouter from "./skill.routes";
import clientRouter from "./client.routes";

const router = Router();

// Combine all route files
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/books", bookRouter);
router.use("/tests", testRouter);
router.use("/skills", skillRouter);
router.use("/client", clientRouter);

export default router;
