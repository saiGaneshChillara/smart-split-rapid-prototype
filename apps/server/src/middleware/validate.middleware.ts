import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { ApiError } from "../errors/ApiError.js";


/**
 * Validates and replaces req.body with the parsed result of schema.
 * Rejects with a 400 ApiError on failure.
 */
export const validateBody = (schema: ZodType) 
  => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
        .join(", ");

      return next(new ApiError(400, message));
    }

    req.body = result.data;

    next();
  }