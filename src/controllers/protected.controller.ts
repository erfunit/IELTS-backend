import { Request, Response } from "express";

export const protectedEndpoint = (req: Request, res: Response) => {
  res.send("This is a protected endpoint. Only authenticated users can access.");
};
