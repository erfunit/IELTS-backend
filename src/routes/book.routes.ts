import { Router } from "express";
import { validateSchema } from "../middlewares/schema.middleware";
import { bookSchema } from "../schemas/book.schema";
import { adminMiddleware } from "../middlewares/admin.middleware";
import {
  createBookController,
  getAllBooksController,
} from "../controllers/book.controller";

const bookRouter = Router();

bookRouter.post(
  "/",
  adminMiddleware,
  validateSchema(bookSchema),
  createBookController
);

bookRouter.get("/", adminMiddleware, getAllBooksController);

export default bookRouter;
