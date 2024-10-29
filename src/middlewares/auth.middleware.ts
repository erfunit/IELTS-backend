import { AuthenticatedRequest } from "../types";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  // Return type set to void
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
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: number;
        phoneNumber: string;
        role: string;
      };
      req.user = decoded; // Set the user data if the token is valid
    } catch (error) {
      req.user = null; // Set user as null if the token is invalid
    }
  } else {
    req.user = null; // Set user as null if there's no token
  }

  next(); // Continue to the next middleware or route handler
};
