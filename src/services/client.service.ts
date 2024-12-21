import { AppDataSource } from "../app";
import { User } from "../entities/User";
import { Book } from "../entities/Book";
import { UserBook } from "../entities/UserBook";
import { Test } from "../entities/Test";
import { Skill, SkillType } from "../entities/Skill";
import { Part } from "../entities/Part";
import { Question, QuestionType } from "../entities/Question";
import { getIeltsBand } from "../utils/calculateBand";
import { UserTestResult } from "../entities/UserTestResults";
import { DeepPartial } from "typeorm";

import crypto from "crypto";

export function encrypt(text: string): string {
  if (!text) throw new Error("Text to encrypt is undefined.");
  const SECRET_KEY = process.env.SECRET_KEY!;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(SECRET_KEY, "hex"),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

const encryptQuestions = (questions: Question[]) => {
  return questions.map((q) => ({
    ...q,
    questionText: q.questionText ? encrypt(q.questionText) : null,
    correctAnswers: q.correctAnswers ? encrypt(q.correctAnswers) : null,
    options: q.options?.map((option) => (option ? encrypt(option) : null)),
  }));
};

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

  if (test.isPaid && !userBook) {
    throw new Error("Access denied: User has not purchased the required book.");
  }

  // Step 3: Fetch and return the skills associated with the test
  const skills = await skillRepository.find({
    where: { test: { id: testId } },
  });

  const sortOrder = ["READING", "LISTENING", "WRITING"];

  // Sort the array based on the skill type
  skills.sort(
    (a, b) => sortOrder.indexOf(a.skillType) - sortOrder.indexOf(b.skillType)
  );

  return {
    title: test.name,
    skills: skills,
  };
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

  if (skill.test.isPaid && !userBook) {
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
    questions: encryptQuestions(
      part.questions.map((question) => {
        // Only remove `correctAnswers` if the question type is not MATCHING_ITEMS
        if (question.questionType !== QuestionType.MATCHING_ITEMS) {
          const { correctAnswers, ...restOfQuestion } = question;
          return restOfQuestion;
        }
        return question;
      })
    ).reverse(),
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
  const partRepository = AppDataSource.getRepository(Part);

  const resultAnswers: {
    questionId: number;
    isCorrect: boolean;
    correctAnswer: string;
    userAnswer: string;
  }[] = [];

  const test = await testRespository.findOne({ where: { id: testId } });
  if (!test) {
    throw Error("Test not found");
  }

  let readingCorrectCounts = 0;
  let listeningCorrectCounts = 0;

  const questions = await questionRespository.find({
    where: { part: { skill: { test: { id: testId } } } },
    relations: ["part", "part.skill"],
  });

  // Group the answers by skill type and then by part
  const groupedAnswers: Record<SkillType, any> = {
    [SkillType.READING]: [],
    [SkillType.LISTENING]: [],
    [SkillType.WRITING]: null,
  };

  answers.forEach((answer: any) => {
    const question = questions.find((item) => item.id === answer.questionId);
    if (!question)
      throw Error(`Question with id ${answer.questionId} not found.`);

    // Find the corresponding skill and part for each answer
    const skillType: SkillType = question.part.skill.skillType;
    const partId = question.part.id;

    // If the part does not exist in the group for the skillType, initialize it
    if (!groupedAnswers[skillType]) {
      groupedAnswers[skillType] = [];
    }
    let part = groupedAnswers[skillType].find((p: any) => p.partId === partId);
    if (!part) {
      part = {
        partId,
        passageOrAudio:
          question.part.passageOrPrompt || question.part.audioUrl || "",
        questions: [],
      };

      groupedAnswers[skillType].push(part);
    }

    // Normalize the correctAnswers and userAnswer
    const correctAnswersArray = question.correctAnswers?.includes(",")
      ? question.correctAnswers
          .split(",")
          .map((item) => item.trim().toLowerCase())
          .sort()
      : [question.correctAnswers?.trim().toLowerCase()];

    const userAnswersArray = answer.answer.includes(",")
      ? answer.answer
          .split(",")
          .map((item: any) => item.trim().toLowerCase())
          .sort()
      : [answer.answer.trim().toLowerCase()];

    let isCorrect = false;
    if (
      JSON.stringify(correctAnswersArray) === JSON.stringify(userAnswersArray)
    ) {
      isCorrect = true;
      if (skillType === SkillType.READING) readingCorrectCounts += 1;
      if (skillType === SkillType.LISTENING) listeningCorrectCounts += 1;
    }

    part.questions.push({
      questionText: question.questionText,
      questionId: question.id,
      isCorrect,
      correctAnswer: question.correctAnswers!,
      userAnswer: answer.answer,
    });
  });

  const readingBand = getIeltsBand(readingCorrectCounts, "READING");
  const listeningBand = getIeltsBand(listeningCorrectCounts, "LISTENING");

  // Prepare result structure for saving
  const result = userTestResultRepository.create({
    answers: resultAnswers,
    userId,
    testId,
    listeningBand,
    readingBand,
    readingResults: groupedAnswers.READING,
    listeningResults: groupedAnswers.LISTENING,
  } as DeepPartial<UserTestResult>);

  const user = await userRespository.findOne({ where: { id: userId } });
  if (user) user.lastTest = result.id;
  else throw Error("User not found");

  // Save the created result to the database
  await userTestResultRepository.save(result);

  return {
    // answers: resultAnswers,
    userId,
    testId,
    listeningBand,
    readingBand,
    readingResults: groupedAnswers.READING,
    listeningResults: groupedAnswers.LISTENING,
  };
};

export {
  purchaseBook,
  getClientBooks,
  getClientSkills,
  getClientParts,
  submitClientQuestions,
};
