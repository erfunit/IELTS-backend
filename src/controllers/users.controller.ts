import { Request, Response } from "express";
import { getAllUsers } from "../services/users.service";
import { controllerWrapper } from "../utils/controllerWrapper";

export const getUsersController = async (req: Request, res: Response) => {
  controllerWrapper(res, getAllUsers);
};
