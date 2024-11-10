import { AppDataSource } from "../app";
import { User } from "../entities/User";
import { Book } from "../entities/Book";
import { UserBook } from "../entities/UserBook";
import { Test } from "../entities/Test";
import { Skill } from "../entities/Skill";
import { Part } from "../entities/Part";
import { Question } from "../entities/Question";
import { getIeltsBand } from "../utils/calculateBand";
import { UserTestResult } from "../entities/UserTestResults";
import { DeepPartial } from "typeorm";

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

const getClientParts = async (skillId: number, user: any) => {
  if (!user) {
    throw new Error("Unauthorized access. User must be logged in.");
  }

  const userBookRepository = AppDataSource.getRepository(UserBook);
  const skillRepository = AppDataSource.getRepository(Skill);
  const partRepository = AppDataSource.getRepository(Part);

  // Retrieve the skill to access the related test and book
  const skill = await skillRepository.findOne({
    where: { id: skillId },
    relations: ["test", "test.book"],
  });

  if (!skill || !skill.test || !skill.test.book) {
    throw new Error("Skill, associated test, or book not found.");
  }

  const bookId = skill.test.book.id;

  // Check if the user has purchased the book associated with this skill
  const userBook = await userBookRepository.findOne({
    where: { user: { id: user.id }, book: { id: bookId } },
  });

  if (!userBook) {
    throw new Error("Access denied: User has not purchased the required book.");
  }

  // Fetch parts and exclude `correctAnswers` from each question
  const parts = await partRepository.find({
    where: { skill: { id: skillId } },
    relations: ["questions"],
  });

  // Remove `correctAnswers` from each question in each part
  return parts.map((part) => ({
    ...part,
    questions: part.questions.map(
      ({ correctAnswers, ...question }) => question
    ),
  }));
};

const submitClientQuestions = async (
  userId: number,
  testId: number,
  answers: any
) => {
  const userRespository = AppDataSource.getRepository(User);
  const testRespository = AppDataSource.getRepository(Test);
  const questionRespository = AppDataSource.getRepository(Question);
  const userTestResultRepository = AppDataSource.getRepository(UserTestResult);

  const resultAnswers: {
    questionId: number;
    isCorrect: boolean;
    correctAnswer: string | string[];
    userAnswer: string | string[];
  }[] = [];

  const test = await testRespository.findOne({ where: { id: testId } });
  if (!test) {
    throw Error("Test not found");
  }

  let readingCorrectCounts = 0;
  let listeningCorrectCounts = 0;

  const questions = await questionRespository.find({
    where: { part: { skill: { test: { id: testId } } } },
  });

  answers.forEach((answer: any) => {
    const question = questions.find((item) => item.id === answer.questionId);
    if (!question)
      throw Error(`Question with id ${answer.questionId} not found.`);
    let isCorrect = false;
    if (question?.correctAnswers === answer.answer) {
      if (answer.skillType === "READING") readingCorrectCounts += 1;
      if (answer.skillType === "LISTENING") listeningCorrectCounts += 1;
      isCorrect = true;
    }
    resultAnswers.push({
      questionId: question.id,
      isCorrect: isCorrect,
      correctAnswer: question?.correctAnswers!,
      userAnswer: answer.answer,
    });
  });

  const readingBand = getIeltsBand(readingCorrectCounts, "READING");
  const listeningBand = getIeltsBand(listeningCorrectCounts, "LISTENING");

  const result = userTestResultRepository.create({
    answers: resultAnswers,
    userId,
    testId,
    listeningBand,
    readingBand,
  } as DeepPartial<UserTestResult>);

  const user = await userRespository.findOne({ where: { id: userId } });

  if (user) user.lastTestResultId = result.id;
  else throw Error("user not found");

  // Save the created result to the database
  await userTestResultRepository.save(result);

  return result;
};

export {
  purchaseBook,
  getClientBooks,
  getClientSkills,
  getClientParts,
  submitClientQuestions,
};
