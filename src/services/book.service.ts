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

export const getBookById = async (id: number) => {
  const booksRepositiry = AppDataSource.getRepository(Book);
  const book = await booksRepositiry.findOne({
    where: { id },
  });

  if (!book) {
    throw Error("Book not found");
  }

  return book;
};

export const updateBookById = async (id: number, book: Book) => {
  const booksRepositiry = AppDataSource.getRepository(Book);
  const existingBook = await booksRepositiry.findOne({ where: { id } });

  if (book.discountPercentage)
    book.discountedPrice =
      book.originalPrice - (book.originalPrice * book.discountPercentage) / 100;

  try {
    const updatedBook = await booksRepositiry.save({
      ...existingBook,
      ...book,
    });
    return {
      message: "Book updated successfully",
      data: updatedBook,
    };
  } catch (error: any) {
    return Error(error);
  }
};

export const deleteBookById = async (id: number) => {
  const booksRepositiry = AppDataSource.getRepository(Book);
  const book = await booksRepositiry.findOne({ where: { id } });
  if (!book) {
    throw Error("Book not found");
  }
  try {
    await booksRepositiry.delete(book.id);
    return {
      message: "Book deleted successfully",
      data: book,
    };
  } catch (error: any) {
    return Error(error);
  }
};
