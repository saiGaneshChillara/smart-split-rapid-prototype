import { eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { db } from "../db/client.js";
import { users } from "../db/schema/users.js";
import { ApiError } from "../errors/ApiError.js";

type JwtPayload = {
  sub: string;
};

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.header("Authorization");

  if (!authorization) {
    return next(new ApiError(401, "Authorization header is required"));
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Invalid authorization header"));
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.sub),
    });

    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    req.user = user;

    next();

  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};