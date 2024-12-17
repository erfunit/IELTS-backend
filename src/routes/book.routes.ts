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
import { uploadMiddleware } from "../services/book.service";

const bookRouter = Router();

bookRouter.post(
  "/",
  adminMiddleware,
  uploadMiddleware,
  // validateSchema(bookSchema),
  createBookController
);
bookRouter.get("/", adminMiddleware, getAllBooksController);
bookRouter.get("/:bookId", adminMiddleware, getOneBookController);
bookRouter.put(
  "/:bookId",
  adminMiddleware,
  uploadMiddleware,
  // validateSchema(bookSchema, true),
  updateBookController
);
bookRouter.delete("/:bookId", adminMiddleware, deleteBookController);

export default bookRouter;
