import { AppDataSource } from "../app";
import { Book } from "../entities/Book";
import { uploadFile } from "../utils/uploadFile";
import multer from "multer";

import dotenv from "dotenv";
import { Request } from "express";
dotenv.config();

// Middleware for handling multipart requests
const storage = multer.memoryStorage();
export const uploadMiddleware = multer({ storage }).single("image");

export const createNewBook = async (req: Request) => {
  const booksRepository = AppDataSource.getRepository(Book);

  const { name, originalPrice, discountPercentage, publisher } = req.body;
  const file = req.file;

  if (!name || !originalPrice || !publisher || !file) {
    throw new Error("Missing required fields or file");
  }

  // Calculate discounted price
  const discountedPrice = discountPercentage
    ? Number(originalPrice) -
      (Number(originalPrice) * Number(discountPercentage)) / 100
    : undefined;

  try {
    // Upload the image (adjust the uploadFile logic to handle Buffer if using memoryStorage)
    const imagePath = (await uploadFile(file)) || "";

    // Create book object
    const newBook = booksRepository.create({
      name,
      originalPrice: Number(originalPrice),
      discountPercentage: discountPercentage
        ? Number(discountPercentage)
        : undefined,
      discountedPrice,
      publisher,
      image: imagePath,
    });

    await booksRepository.save(newBook);

    return {
      message: "New book created successfully",
      data: newBook,
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const updateBookById = async (req: Request, id: number) => {
  const booksRepository = AppDataSource.getRepository(Book);
  const file = req.file; // Optional uploaded file
  console.log(req.body);
  const { name, originalPrice, discountPercentage, publisher } = req.body;

  // Fetch the existing book
  const existingBook = await booksRepository.findOne({ where: { id } });
  if (!existingBook) {
    throw new Error("Book not found");
  }

  try {
    // Update fields if provided
    const updatedFields: Partial<Book> = {};

    if (name) updatedFields.name = name;
    if (originalPrice) updatedFields.originalPrice = Number(originalPrice);
    if (discountPercentage)
      updatedFields.discountPercentage = Number(discountPercentage);
    if (publisher) updatedFields.publisher = publisher;

    // Recalculate discounted price if needed
    if (updatedFields.originalPrice && updatedFields.discountPercentage) {
      updatedFields.discountedPrice =
        updatedFields.originalPrice -
        (updatedFields.originalPrice * updatedFields.discountPercentage) / 100;
    }

    // Upload new image if provided
    if (file) {
      const imagePath = (await uploadFile(file)) || undefined; // Adjust for memory storage handling
      updatedFields.image = imagePath;
    }

    // Merge updates into the existing book
    const updatedBook = booksRepository.merge(existingBook, updatedFields);

    await booksRepository.save(updatedBook);

    return {
      message: "Book updated successfully",
      data: updatedBook,
    };
  } catch (error: any) {
    throw new Error(error.message);
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

export const deleteBookById = async (id: number) => {
  const booksRepositiry = AppDataSource.getRepository(Book);
  const book = await booksRepositiry.findOne({
    where: { id },
    relations: [
      "tests",
      "tests.skills",
      "tests.skills.parts",
      "tests.skills.parts.questions",
    ],
  });

  if (!book) {
    throw Error("Book not found");
  }

  try {
    await booksRepositiry.remove(book); // Cascade delete should now work
    return {
      message: "Book and its related data deleted successfully",
      data: book,
    };
  } catch (error: any) {
    return Error(error);
  }
};
