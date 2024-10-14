import { Request, Response } from "express";
import { controllerWrapper } from "../utils/controllerWrapper";
import {
  createNewTest,
  deleteTestById,
  getAllTests,
  getOneTestById,
  updateTestById,
} from "../services/test.service";
import { Test } from "../entities/Test";

export const getAllTestsController = (req: Request, res: Response) => {
  controllerWrapper(res, getAllTests);
};

export const getOneTestController = (req: Request, res: Response) => {
  controllerWrapper(res, getOneTestById, req.params.testId);
};

export const createTestController = (req: Request, res: Response) => {
  controllerWrapper(res, createNewTest, req.body as Test);
};

export const updateTestController = (req: Request, res: Response) => {
  controllerWrapper(res, updateTestById, req.params.testId, req.body as Test);
};

export const deleteTestController = (req: Request, res: Response) => {
  controllerWrapper(res, deleteTestById, req.params.testId);
};
