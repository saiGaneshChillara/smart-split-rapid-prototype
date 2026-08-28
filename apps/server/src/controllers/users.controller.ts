import { Request, Response } from "express";
import { SearchUsersInput } from "../schemas/users.schema.js";
import * as usersService from "../services/users.service.js";

export const getCurrentUser = async (req: Request, res: Response) => {
  const { id, phone_number, name } = req.user;

  res.status(200).json({
    user: {
      id,
      name,
      phone_number,
    },
  });
};

export const searchUsers = async (
  req: Request<{}, {}, SearchUsersInput>,
  res: Response,
) => {
  const result = await usersService.searchUsers(
    req.body.phoneNumbers,
  );

  res.status(200).json(result);
};