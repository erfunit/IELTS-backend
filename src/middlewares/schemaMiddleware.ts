import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateSchema =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsedData = schema.parse(req.body); // Validate and parse the body
      req.body = parsedData; // Replace body with validated data
      next(); // Call next middleware if validation succeeds
    } catch (error: any) {
      res.status(400).json({ errors: error.errors }); // Return error response if validation fails
    }
  };
