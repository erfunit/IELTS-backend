import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodRawShape } from "zod";

export const validateSchema =
  (schema: ZodObject<ZodRawShape>, partial: boolean = false) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const schemaToValidate = partial ? schema.partial() : schema;
    try {
      const parsedData = schemaToValidate.parse(req.body);
      req.body = parsedData;
      next();
    } catch (error: any) {
      res.status(400).json({ errors: error.errors });
    }
  };
