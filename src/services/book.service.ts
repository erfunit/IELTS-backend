import { AppDataSource } from "../app";
import { Book } from "../entities/Book";

export const createNewBook = async (book: Book) => {
  const booksRepositiry = AppDataSource.getRepository(Book);

  if (book.discountPercentage)
    book.discountedPrice =
      book.originalPrice - (book.originalPrice * book.discountPercentage) / 100;

  try {
    const newBook = booksRepositiry.create(book);
    await booksRepositiry.save(newBook);
    return {
      message: "New book created successfully",
      data: newBook,
    };
  } catch (error: any) {
    return Error(error);
  }
};

export const getAllBooks = async () => {
  const booksRepositiry = AppDataSource.getRepository(Book);
  return booksRepositiry.find();
};
