import { Book } from "../entities/Book";

export const createNewBook = async (book: Book) => {
  if (book.discountPercentage)
    book.discountedPrice =
      book.originalPrice - (book.originalPrice * book.discountPercentage) / 100;

  console.log(book);
  return {
    message: "New book created successfully",
  };
};
