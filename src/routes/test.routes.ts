import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.middleware";
import {
  createTestController,
  getAllTestsController,
} from "../controllers/test.controller";
import { validateSchema } from "../middlewares/schema.middleware";
import { testSchema } from "../schemas/test.schema";

const testRouter = Router();

testRouter.get("/", adminMiddleware, getAllTestsController);
testRouter.post(
  "/",
  adminMiddleware,
  validateSchema(testSchema),
  createTestController
);

export default testRouter;
