import { Request, Response } from "express";
import { Book } from "../entities/Book";
import {
  createNewBook,
  deleteBookById,
  getAllBooks,
  getBookById,
  updateBookById,
} from "../services/book.service";
import { controllerWrapper } from "../utils/controllerWrapper";

export const createBookController = async (req: Request, res: Response) => {
  await controllerWrapper(res, createNewBook, req);
};

export const getAllBooksController = async (req: Request, res: Response) => {
  await controllerWrapper(res, getAllBooks);
};

export const getOneBookController = async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  await controllerWrapper(res, getBookById, bookId);
};

export const updateBookController = async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  await controllerWrapper(res, updateBookById, req, bookId);
};

export const deleteBookController = async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  await controllerWrapper(res, deleteBookById, bookId);
};
