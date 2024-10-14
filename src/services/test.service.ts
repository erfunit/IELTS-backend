import { AppDataSource } from "../app";
import { Test } from "../entities/Test";

export const getAllTests = () => {
  const testRepository = AppDataSource.getRepository(Test);
  return testRepository.find();
};

export const createNewTest = async (test: Test) => {
  const testRepository = AppDataSource.getRepository(Test);

  try {
    const newTest = testRepository.create(test);
    await testRepository.save(newTest);
    return {
      message: "New test were added successfully",
      data: newTest,
    };
  } catch (error) {
    throw new Error("an error occured while creating new test");
  }
};
