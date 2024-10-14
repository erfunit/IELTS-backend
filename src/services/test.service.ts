import { AppDataSource } from "../app";
import { Test } from "../entities/Test";

export const getAllTests = () => {
  const testRepository = AppDataSource.getRepository(Test);
  return testRepository.find();
};

export const getOneTestById = (id: number) => {
  const testRepository = AppDataSource.getRepository(Test);
  return testRepository.findOne({ where: { id } });
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

export const updateTestById = async (id: number, test: Test) => {
  const testsRepositiry = AppDataSource.getRepository(Test);
  const existingTest = await testsRepositiry.findOne({ where: { id } });

  try {
    const updatedTest = await testsRepositiry.save({
      ...existingTest,
      ...test,
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
  const test = await testRepository.findOne({ where: { id } });
  if (!test) {
    throw Error("Test not found");
  }
  try {
    await testRepository.delete(test.id);
    return {
      message: "Test deleted successfully",
      data: test,
    };
  } catch (error: any) {
    return Error(error);
  }
};
