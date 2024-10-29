import { AppDataSource } from "../app";
import { User, UserRole } from "../entities/User";
import { Repository } from "typeorm";
import { isValidPersianPhoneNumber } from "../utils/phoneNumberCheck";

// Create a new user
const createUser = async (
  phoneNumber: string,
  role: UserRole = UserRole.USER
) => {
  const usersRepository: Repository<User> = AppDataSource.getRepository(User);

  if (!isValidPersianPhoneNumber(phoneNumber)) {
    throw new Error("Phone number must start with 09..., and be valid");
  }

  const newUser = usersRepository.create({
    phoneNumber,
    role,
  });

  const result = await usersRepository.save(newUser);
  return {
    message: "new user added",
    data: result,
  };
};

// Get a user by their ID
const getUserById = async (id: number) => {
  const usersRepository: Repository<User> = AppDataSource.getRepository(User);
  return await usersRepository.findOne({ where: { id } });
};

// Update an existing user by ID
const updateUser = async (
  id: number,
  updateData: Partial<User>,
  fromUser: any
) => {
  const usersRepository: Repository<User> = AppDataSource.getRepository(User);
  const user = await usersRepository.findOne({ where: { id } });
  const fromUserData = await usersRepository.findOne({
    where: { id: fromUser.id },
  });

  if (!user) throw new Error(`User with ID ${id} not found`);

  if (user.id === fromUserData?.id && updateData.role) {
    throw new Error("You cannot edit your own info");
  }

  if (
    updateData.phoneNumber &&
    !isValidPersianPhoneNumber(updateData.phoneNumber)
  ) {
    throw new Error("Phone number must start with 09..., and be valid");
  }

  // Merge existing user data with new data
  const updatedUser = Object.assign(user, updateData);
  const data = await usersRepository.save(updatedUser);
  return {
    message: "user updated successfully!",
    data,
  };
};

// Delete a user by ID
const deleteUser = async (id: number, fromUser: any) => {
  const usersRepository: Repository<User> = AppDataSource.getRepository(User);
  const user = await usersRepository.findOne({ where: { id } });
  const fromUserData = await usersRepository.findOne({
    where: { id: fromUser.id },
  });

  if (!user) throw new Error(`User with ID ${id} not found`);

  if (user.id === fromUserData?.id)
    throw new Error("You cannot remove your own account");

  const result = await usersRepository.remove(user);
  return {
    message: `user -${user.phoneNumber}- deleted`,
    data: result,
  };
};

// Get all users (already provided)
const getAllUsers = async () => {
  const usersRepository: Repository<User> = AppDataSource.getRepository(User);
  return await usersRepository.find();
};

export { createUser, getUserById, updateUser, deleteUser, getAllUsers };
