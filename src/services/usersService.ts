import { AppDataSource } from "../app";
import { User } from "../entities/User";

const getAllUsers = () => {
  const usersRepository = AppDataSource.getRepository(User);
  return usersRepository.find();
};

export { getAllUsers };
