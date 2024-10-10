import { Request, Response } from "express";
import { getAllUsers } from "../services/usersService";

export const getUsersController = async (req: Request, res: Response) => {
  try {
    const result = await getAllUsers();
    res.json(result);
  } catch (error) {
    if (error instanceof Error)
      res.status(400).json({ message: error.message });
    else res.status(500).json({ message: "Internal Server Error" });
  }
};
