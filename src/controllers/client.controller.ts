import { Response } from "express";
import { getClientBooks, purchaseBook } from "../services/client.service";
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
