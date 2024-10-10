import { Request, Response } from "express";

export const publicEndpoint = (req: Request, res: Response) => {
  res.send("This is a public endpoint.");
};
