import { Response } from "express";

export const controllerWrapper = async (
  res: Response,
  cb: (...args: any) => Promise<any>,
  ...args: any[]
) => {
  try {
    const result = await cb(...args);
    res.json(result);
  } catch (error) {
    if (error instanceof Error)
      res.status(400).json({ message: error.message });
    else res.status(500).json({ message: "Internal Server Error" });
  }
};
