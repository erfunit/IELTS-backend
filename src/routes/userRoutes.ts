import { Router } from "express";
import { getUsersController } from "../controllers/usersController";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const userRouter = Router();

userRouter.get("/", adminMiddleware, getUsersController);
// userRouter.post("/", adminMiddleware, getUsersController);
// userRouter.get("/:userId", adminMiddleware, getUsersController);
// userRouter.put("/:userId", adminMiddleware, getUsersController);
// userRouter.delete("/:userId", adminMiddleware, getUsersController);

export default userRouter;
