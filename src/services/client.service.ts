import { AppDataSource } from "../app";
import { User, UserRole } from "../entities/User";
import { Repository } from "typeorm";
import { isValidPersianPhoneNumber } from "../utils/phoneNumberCheck";
import { Book } from "../entities/Book";
import { UserBook } from "../entities/UserBook";
import { Test } from "../entities/Test";
import { Skill } from "../entities/Skill";

const purchaseBook = async (userdata: any, bookId: number) => {
  const userRepository = AppDataSource.getRepository(User);
  const bookRepository = AppDataSource.getRepository(Book);
  const userBookRepository = AppDataSource.getRepository(UserBook);

  // Check if user already purchased the book
  const existingPurchase = await userBookRepository.findOne({
    where: { user: { id: userdata.id }, book: { id: bookId } },
  });
  if (existingPurchase) {
    throw new Error("User has already purchased this book.");
  }

  // Retrieve the user and book
  const user = await userRepository.findOneBy({ id: userdata.id });
  const book = await bookRepository.findOneBy({ id: bookId });
  if (!user || !book) throw new Error("User or book not found");

  // Calculate the price at purchase
  const priceAtPurchase = book.discountedPrice ?? book.originalPrice;

  // Create and save the UserBook purchase
  const userBook = new UserBook();
  userBook.user = user;
  userBook.book = book;
  userBook.priceAtPurchase = priceAtPurchase;
  // userBook.purchaseDate = new Date();

  return await userBookRepository.save(userBook);
};

const getClientBooks = async (user: any) => {
  const bookRepository = AppDataSource.getRepository(Book);
  const userBookRepository = AppDataSource.getRepository(UserBook);

  // Fetch all books and include associated tests
  const books = await bookRepository.find({
    relations: ["tests"],
  });

  // If userId is null, return all books with boughtByUser: false
  if (!user) {
    return books.map((book) => ({
      ...book,
      boughtByUser: false,
    }));
  }
  const { id: userId } = user;
  // Otherwise, get all userBooks for the given userId
  const userBooks = await userBookRepository.find({
    where: { user: { id: userId } },
    relations: ["book"],
  });
  const purchasedBookIds = userBooks.map((userBook) => userBook.book.id);

  // Map through books to add "boughtByUser" field
  return books.map((book) => ({
    ...book,
    boughtByUser: purchasedBookIds.includes(book.id),
  }));
};

const getClientSkills = async (testId: number, user: any) => {
  if (!user) {
    throw new Error("Unauthorized access. User must be logged in.");
  }

  const userBookRepository = AppDataSource.getRepository(UserBook);
  const testRepository = AppDataSource.getRepository(Test);
  const skillRepository = AppDataSource.getRepository(Skill);

  // Step 1: Retrieve the test by ID to get the associated book ID
  const test = await testRepository.findOne({
    where: { id: testId },
    relations: ["book"],
  });

  if (!test || !test.book) {
    throw new Error("Test or associated book not found.");
  }

  const bookId = test.book.id;

  // Step 2: Check if the user has purchased the book
  const userBook = await userBookRepository.findOne({
    where: { user: { id: user.id }, book: { id: bookId } },
  });

  if (!userBook) {
    throw new Error("Access denied: User has not purchased the required book.");
  }

  // Step 3: Fetch and return the skills associated with the test
  const skills = await skillRepository.find({
    where: { test: { id: testId } },
  });

  return skills;
};

export { purchaseBook, getClientBooks, getClientSkills };
