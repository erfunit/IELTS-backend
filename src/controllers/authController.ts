import { Request, Response } from "express";
import { getMe, login, verifyOtp } from "../services/authService";
import { AuthenticatedRequest } from "../types";

export const loginController = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;

  try {
    const result = await login(phoneNumber);
    res.json(result);
  } catch (error) {
    if (error instanceof Error)
      res.status(400).json({ message: error.message });
    else res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  const { phoneNumber, otpCode } = req.body;

  try {
    const result = await verifyOtp(phoneNumber, otpCode);
    res.json(result);
  } catch (error) {
    if (error instanceof Error)
      res.status(400).json({ message: error.message });
    else res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMeController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req?.user;

  try {
    const result = await getMe(user);
    res.json(result);
  } catch (error) {
    if (error instanceof Error)
      res.status(400).json({ message: error.message });
    else res.status(500).json({ message: "Internal Server Error" });
  }
};
