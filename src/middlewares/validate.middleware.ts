import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validate =
  (schema: ZodSchema, property: "body" | "params" | "query" = "body") =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req[property]);
      next();
    } catch (error) {
      next(error);
    }
  };
