import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.middleware";
import {
  createTestController,
  deleteTestController,
  getAllTestsController,
  getBookTestsController,
  getOneTestController,
  updateTestController,
} from "../controllers/test.controller";
import { validateSchema } from "../middlewares/schema.middleware";
import { testSchema } from "../schemas/test.schema";

const testRouter = Router();

testRouter.get("/", adminMiddleware, getAllTestsController);
testRouter.get("/book/:bookId", adminMiddleware, getBookTestsController);
testRouter.get("/:testId", adminMiddleware, getOneTestController);
testRouter.post(
  "/",
  adminMiddleware,
  validateSchema(testSchema),
  createTestController
);
testRouter.put(
  "/:testId",
  adminMiddleware,
  validateSchema(testSchema, true),
  updateTestController
);
testRouter.delete("/:testId", adminMiddleware, deleteTestController);

export default testRouter;
