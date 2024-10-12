import { Request, Response } from "express";
import { getMe, login, verifyOtp } from "../services/auth.service";
import { AuthenticatedRequest } from "../types";
import { controllerWrapper } from "../utils/controllerWrapper";

export const loginController = async (req: Request, res: Response) => {
  const { phoneNumber } = req.body;
  controllerWrapper(res, login, phoneNumber);
};

export const verifyOtpController = async (req: Request, res: Response) => {
  const { phoneNumber, otpCode } = req.body;
  controllerWrapper(res, verifyOtp, phoneNumber, otpCode);
};

export const getMeController = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const user = req?.user;
  controllerWrapper(res, getMe, user);
};
