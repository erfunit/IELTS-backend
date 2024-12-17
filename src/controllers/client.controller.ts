import { Response } from "express";
import {
  getClientBooks,
  getClientParts,
  getClientSkills,
  purchaseBook,
  submitClientQuestions,
} from "../services/client.service";
import { AuthenticatedRequest } from "../types";
import { controllerWrapper } from "../utils/controllerWrapper";

export const purchaseBookController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { bookId } = req.params;
  const user = req?.user;
  await controllerWrapper(res, purchaseBook, user, bookId);
};

export const getClientBooksControler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req?.user;
  await controllerWrapper(res, getClientBooks, user);
};

export const getClientSkillsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req?.user;
  const testId = parseInt(req.query.testId as string, 10);
  await controllerWrapper(res, getClientSkills, testId, user);
};

export const getClientPartsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req?.user;
  const skillId = parseInt(req.query.skillId as string, 10);
  await controllerWrapper(res, getClientParts, skillId, user);
};

export const submitQuestionsController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user: any = req?.user;
  const { testId, answers } = req.body;
  await controllerWrapper(
  res,
    submitClientQuestions,
    user.id,
    +testId,
    answers
  );
};
