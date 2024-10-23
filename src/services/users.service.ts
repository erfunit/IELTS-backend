import { AppDataSource } from "../app";
import { User, UserRole } from "../entities/User";
import { Repository } from "typeorm";

// Create a new user
const createUser = async (phoneNumber: string, role = UserRole) => {
  const usersRepository: Repository<User> = AppDataSource.getRepository(User);

  const newUser = usersRepository.create({
    phoneNumber,
    role: UserRole.USER,
  });

  return await usersRepository.save(newUser);
};

// Get a user by their ID
const getUserById = async (id: number) => {
  const usersRepository: Repository<User> = AppDataSource.getRepository(User);
  return await usersRepository.findOne({ where: { id } });
};

// Update an existing user by ID
const updateUser = async (id: number, updateData: Partial<User>) => {
  const usersRepository: Repository<User> = AppDataSource.getRepository(User);
  const user = await usersRepository.findOne({ where: { id } });

  if (!user) throw new Error(`User with ID ${id} not found`);

  // Merge existing user data with new data
  const updatedUser = Object.assign(user, updateData);
  const data = await usersRepository.save(updatedUser);
  return {
    message: "user updated successfully!",
    data,
  };
};

// Delete a user by ID
const deleteUser = async (id: number) => {
  const usersRepository: Repository<User> = AppDataSource.getRepository(User);
  const user = await usersRepository.findOne({ where: { id } });

  if (!user) throw new Error(`User with ID ${id} not found`);

  return await usersRepository.remove(user);
};

// Get all users (already provided)
const getAllUsers = async () => {
  const usersRepository: Repository<User> = AppDataSource.getRepository(User);
  return await usersRepository.find();
};

export { createUser, getUserById, updateUser, deleteUser, getAllUsers };
