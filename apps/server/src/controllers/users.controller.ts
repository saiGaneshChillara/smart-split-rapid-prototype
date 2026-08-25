import { Request, Response } from "express";

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