import { Request, Response } from "express";
import { Book } from "../entities/Book";
import { createNewBook, getAllBooks } from "../services/book.service";
import { controllerWrapper } from "../utils/controllerWrapper";

export const createBookController = async (req: Request, res: Response) => {
  await controllerWrapper(res, createNewBook, req.body as Book);
};

export const getAllBooksController = async (req: Request, res: Response) => {
  await controllerWrapper(res, getAllBooks);
};
