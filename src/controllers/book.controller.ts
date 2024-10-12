import { Request, Response } from "express";
import { Book } from "../entities/Book";
import { createNewBook } from "../services/book.service";

export const createBookController = async (req: Request, res: Response) => {
  try {
    const result = await createNewBook(req.body as Book);
    res.json(result);
  } catch (error) {
    if (error instanceof Error)
      res.status(400).json({ message: error.message });
    else res.status(500).json({ message: "Internal Server Error" });
  }
};
