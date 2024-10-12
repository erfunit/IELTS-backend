import { AuthenticatedRequest } from "../types";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../app";
import { User } from "../entities/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const adminMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).send("Access denied. No token provided.");
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      phoneNumber: string;
      role: string;
    };

    // Verify if the user exists in the database and check their role
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id } });

    if (!user) {
      res.status(401).json({
        error: "User not found!",
      });
      return;
    }

    if (user.role !== "ADMIN") {
      res.status(403).json({
        error: "Access forbidden. Admins only.",
      });
      return;
    }

    req.user = decoded; // Optionally, attach the user info to the request
    next();
  } catch (error) {
    res.status(400).json({
      error: "Invalid token.",
    });
  }
};
