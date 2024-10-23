import { AppDataSource } from "../app";
import { Part } from "../entities/Part";
import { Skill } from "../entities/Skill";
import { Test } from "../entities/Test";

export const getAllTests = () => {
  const testRepository = AppDataSource.getRepository(Test);
  return testRepository.find({ relations: ["skills"] });
};

export const getTestsByBookId = async (bookId: string) => {
  const testRepository = AppDataSource.getRepository(Test);
  const result = await testRepository.find({
    where: {
      book: {
        id: +bookId,
      },
    },
    relations: ["book", "skills"], // To load the associated book entity if needed
  });
  return result;
};

export const getOneTestById = (id: number) => {
  const testRepository = AppDataSource.getRepository(Test);
  return testRepository.findOne({ where: { id }, loadRelationIds: true });
};

export const createNewTest = async (test: Test & { bookId: number }) => {
  const testRepository = AppDataSource.getRepository(Test);

  try {
    const newTest = testRepository.create({
      ...test,
      book: { id: test.bookId }, // Ensure this is correctly set
    });
    await testRepository.save(newTest);
    return {
      message: "New test were added successfully",
      data: newTest,
    };
  } catch (error) {
    throw new Error("an error occured while creating new test");
  }
};

export const updateTestById = async (
  id: number,
  test: Test & { bookId: number }
) => {
  const testsRepositiry = AppDataSource.getRepository(Test);
  const existingTest = await testsRepositiry.findOne({ where: { id } });

  try {
    const updatedTest = await testsRepositiry.save({
      ...existingTest,
      ...test,
      book: { id: test.bookId },
    });
    return {
      message: "Test updated successfully",
      data: updatedTest,
    };
  } catch (error: any) {
    return Error(error);
  }
};

export const deleteTestById = async (id: number) => {
  const testRepository = AppDataSource.getRepository(Test);
  const skillRepository = AppDataSource.getRepository(Skill);
  const partRepository = AppDataSource.getRepository(Part);

  // Fetch the test by ID
  const test = await testRepository.findOne({ where: { id } });

  if (!test) {
    console.error(`Test not found for ID: ${id}`);
    throw new Error("Test not found");
  }

  try {
    // Fetch all skills related to the test
    const skills = await skillRepository.find({ where: { test: { id } } });

    // Loop through each skill and delete its related parts
    for (const skill of skills) {
      await partRepository.delete({ skill: { id: skill.id } });
    }

    // Delete all skills related to the test
    await skillRepository.delete({ test: { id } });

    // Finally, delete the test itself
    await testRepository.delete(id);

    console.log(`Successfully deleted test with ID: ${id}`);
    return {
      message: "Test deleted successfully",
      data: test, // Consider returning the deleted test object or just the message.
    };
  } catch (error: any) {
    console.error(
      `Error deleting test with ID: ${id}. Error: ${error.message}`
    );
    throw new Error("Error deleting test");
  }
};
