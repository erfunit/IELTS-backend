import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { Otp } from "../entities/Otp";
import { AppDataSource } from "../app";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const login = async (phoneNumber: string) => {
  const otpRepository = AppDataSource.getRepository(Otp);

  // Check if a new OTP can be generated (every 30 seconds)
  const existingOtp = await otpRepository.findOne({
    where: { phoneNumber },
    order: { createdAt: "DESC" },
  });

  const currentTime = new Date();
  if (existingOtp) {
    const timeSinceLastOtp =
      (currentTime.getTime() - existingOtp.createdAt.getTime()) / 1000;
    if (timeSinceLastOtp < 30) {
      return { message: "You can request a new OTP after 30 seconds." };
    }
  }

  // Generate a new OTP (this should be securely generated in real use)
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Set OTP with a 5-minute expiry (maxAge is 300 seconds)
  const otp = otpRepository.create({ otpCode, phoneNumber, maxAge: 300 });
  await otpRepository.save(otp);

  // Simulate sending OTP via SMS here (e.g., integration with Twilio)
  return { message: "OTP sent", otp: otp.otpCode };
};

export const verifyOtp = async (phoneNumber: string, otpCode: string) => {
  const userRepository = AppDataSource.getRepository(User);
  const otpRepository = AppDataSource.getRepository(Otp);

  // Fetch the most recent OTP for the provided phone number
  const otp = await otpRepository.findOne({
    where: { otpCode, phoneNumber },
    order: { createdAt: "DESC" }, // Get the most recent OTP
  });

  if (!otp) throw new Error("Invalid OTP");

  // Check if OTP is already used
  if (otp.isUsed) {
    throw new Error("This OTP has already been used.");
  }

  // Check if OTP is expired
  const currentTime = new Date();
  const otpAgeInSeconds =
    (currentTime.getTime() - otp.createdAt.getTime()) / 1000;
  if (otpAgeInSeconds > otp.maxAge) {
    otp.isExpired = true;
    await otpRepository.save(otp); // Mark as expired
    throw new Error("This OTP has expired.");
  }

  // Mark the OTP as used
  otp.isUsed = true;
  await otpRepository.save(otp);

  // Check if the user exists
  let user = await userRepository.findOne({ where: { phoneNumber } });

  if (!user) {
    // Create a new user
    user = userRepository.create({ phoneNumber });
    await userRepository.save(user);
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, phoneNumber: user.phoneNumber, role: user.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { message: user ? "Welcome back!" : "User created", token };
};

export const getMe = (user: any) => {
  const userRepository = AppDataSource.getRepository(User);
  const foundUser = userRepository.findOne({
    where: { id: user.id },
  });
  if (!foundUser) {
    throw new Error("User not found!");
  } else {
    return foundUser;
  }
};
