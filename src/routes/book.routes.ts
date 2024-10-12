import { Router } from "express";
import { validateSchema } from "../middlewares/schema.middleware";
import { bookSchema } from "../schemas/book.schema";
import { adminMiddleware } from "../middlewares/admin.middleware";
import {
  createBookController,
  deleteBookController,
  getAllBooksController,
  getOneBookController,
  updateBookController,
} from "../controllers/book.controller";

const bookRouter = Router();

bookRouter.post(
  "/",
  adminMiddleware,
  validateSchema(bookSchema),
  createBookController
);
bookRouter.get("/", adminMiddleware, getAllBooksController);
bookRouter.get("/:bookId", adminMiddleware, getOneBookController);
bookRouter.put(
  "/:bookId",
  adminMiddleware,
  validateSchema(bookSchema, true),
  updateBookController
);
bookRouter.delete("/:bookId", adminMiddleware, deleteBookController);

export default bookRouter;
