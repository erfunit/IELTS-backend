import { Request, Response } from "express";

export const adminOnlyEndpoint = (req: Request, res: Response) => {
  res.send("You're a admin!");
};
