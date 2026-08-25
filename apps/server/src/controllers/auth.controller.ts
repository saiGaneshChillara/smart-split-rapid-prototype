import { Request, Response } from "express";
import { RequestOtpInput, VerifyOtpInput } from "../schemas/auth.schema.js";
import * as authService from "../services/auth.service.js";

export const requestOtp = async (
  req: Request<{}, {}, RequestOtpInput>,
  res: Response,
) => {
  const { phoneNumber } = req.body;

  const result = await authService.requestOtp(phoneNumber);

  res.status(200).json(result);
};

export const verifyOtp = async (
  req: Request<{}, {}, VerifyOtpInput>,
  res: Response,
) => {
  const { phoneNumber, otp, name } = req.body;

  const result = await authService.verifyOtp(
    phoneNumber,
    otp,
    name,
  );

  res.status(200).json(result);
};