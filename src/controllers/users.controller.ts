import { Request, Response } from "express";
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllUsers,
} from "../services/users.service";
import { controllerWrapper } from "../utils/controllerWrapper";

// Get all users
export const getUsersController = async (req: Request, res: Response) => {
  await controllerWrapper(res, getAllUsers);
};

// Get a single user by ID
export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  await controllerWrapper(res, getUserById, Number(id));
};

// Create a new user
export const createUserController = async (req: Request, res: Response) => {
  const { phoneNumber, role } = req.body;
  await controllerWrapper(res, createUser, phoneNumber, role);
};

// Update a user by ID
export const updateUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  await controllerWrapper(res, updateUser, parseInt(id, 10), updateData);
};

// Delete a user by ID
export const deleteUserController = async (req: Request, res: Response) => {
  const { id } = req.params;
  await controllerWrapper(res, deleteUser, Number(id));
};
