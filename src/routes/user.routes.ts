import { Router } from "express";
import {
  getUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/users.controller";
import { adminMiddleware } from "../middlewares/admin.middleware";
import { validateSchema } from "../middlewares/schema.middleware";
import { userSchema } from "../schemas/user.schema";

const userRouter = Router();

// Get all users (requires admin access)
userRouter.get("/", adminMiddleware, getUsersController);

// Create a new user (admin access)
userRouter.post(
  "/",
  adminMiddleware,
  validateSchema(userSchema),
  createUserController
);

// Get a user by ID (admin access)
userRouter.get("/:id", adminMiddleware, getUserByIdController);

// Update a user by ID (admin access)
userRouter.put(
  "/:id",
  adminMiddleware,
  validateSchema(userSchema, true),
  updateUserController
);

// Delete a user by ID (admin access)
userRouter.delete("/:id", adminMiddleware, deleteUserController);

export default userRouter;
