import jwt from "jsonwebtoken";
import { User, UserRole } from "../entities/User";
import { Otp } from "../entities/Otp";
import { AppDataSource } from "../app";
import { isValidPersianPhoneNumber } from "../utils/phoneNumberCheck";
import { UserTestResult } from "../entities/UserTestResults";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const login = async (phoneNumber: string) => {
  const otpRepository = AppDataSource.getRepository(Otp);

  if (!isValidPersianPhoneNumber(phoneNumber)) {
    throw new Error("phone number must start with 09..., and be valid");
  }

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
      throw { message: "You can request a new OTP after 30 seconds." };
    }
  }

  // Generate a new OTP (this should be securely generated in real use)
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Set OTP with a 5-minute expiry (maxAge is 300 seconds)
  const otp = otpRepository.create({ otpCode, phoneNumber, maxAge: 600 });
  await otpRepository.save(otp);

  console.log("Saved OTP:", otp);

  fetch(
    `https://api.kavenegar.com/v1/7376776B766665366272747277564E673053394C75367937417062413561734177486B384A5774683976553D/verify/lookup.json?receptor=${phoneNumber}&token=${otp.otpCode}&template=login`
  );

  // Simulate sending OTP via SMS here (e.g., integration with Twilio)
  return { message: "OTP sent" };
};

export const verifyOtp = async (phoneNumber: string, otpCode: string) => {
  const userRepository = AppDataSource.getRepository(User);
  const otpRepository = AppDataSource.getRepository(Otp);
  const userTestResultRepository = AppDataSource.getRepository(UserTestResult);

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
  console.log("------------------");

  console.log({
    otpCreatedAt: otp.createdAt,
    serverCurrentTime: currentTime,
  });

  console.log("------------------");
  console.log({
    otpAgeInSeconds,
    otpAge: otp.maxAge,
  });

  const serverTime = new Date();
  const otpCreatedTime = new Date(otp.createdAt);
  const adjustedOtpAgeInSeconds =
    (serverTime.getTime() - otpCreatedTime.getTime() - 3.5 * 60 * 60 * 1000) /
    1000;

  if (adjustedOtpAgeInSeconds > otp.maxAge) {
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
    user = userRepository.create({
      phoneNumber,
      role: phoneNumber === "09162630612" ? UserRole.ADMIN : UserRole.USER,
    });
    await userRepository.save(user);
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, phoneNumber: user.phoneNumber, role: user.role },
    JWT_SECRET,
    { expiresIn: "30d" }
  );

  // Fetch the latest test result for the user
  const lastTestResult = await userTestResultRepository.findOne({
    where: { userId: user.id },
    order: { createdAt: "DESC" }, // Order by the most recent
  });

  const userData = { ...user, lastTestResult };
  return {
    message: user ? "Welcome back!" : "User created",
    token,
    user: userData,
  };
};

export const getMe = async (user: any) => {
  const userTestResultRepository = AppDataSource.getRepository(UserTestResult);
  const userRepository = AppDataSource.getRepository(User);

  const foundUser = await userRepository.findOne({
    where: { id: user.id },
  });

  const lastTestResult = await userTestResultRepository.findOne({
    where: { userId: user.id },
    order: { createdAt: "DESC" }, // Order by the most recent
  });

  const userData = { ...foundUser, lastTestResult };

  if (!foundUser) {
    throw new Error("User not found!");
  } else {
    return userData;
  }
};
