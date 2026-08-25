import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
import { ApiError } from "../errors/ApiError.js";


/**
 * Validates and replaces req.body with the parsed result of schema.
 * Rejects with a 400 ApiError on failure.
 */
type RequestProperty = "body" | "params" | "query"

export const validate = 
  (
    schema: ZodType,
    property: RequestProperty = "body",
  )  => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
        .join(", ");

      return next(new ApiError(400, message));
    }

    req[property] = result.data;

    next();
  }