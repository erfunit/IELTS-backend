import { Router } from "express";
import { getUsersController } from "../controllers/users.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";

const userRouter = Router();

userRouter.get("/", adminMiddleware, getUsersController);
// userRouter.post("/", adminMiddleware, getUsersController);
// userRouter.get("/:userId", adminMiddleware, getUsersController);
// userRouter.put("/:userId", adminMiddleware, getUsersController);
// userRouter.delete("/:userId", adminMiddleware, getUsersController);

export default userRouter;
