import { Request, Response } from "express";
import { controllerWrapper } from "../utils/controllerWrapper";
import { createNewTest, getAllTests } from "../services/test.service";
import { Test } from "../entities/Test";

export const getAllTestsController = (req: Request, res: Response) => {
  controllerWrapper(res, getAllTests);
};

export const createTestController = (req: Request, res: Response) => {
  controllerWrapper(res, createNewTest, req.body as Test);
};
