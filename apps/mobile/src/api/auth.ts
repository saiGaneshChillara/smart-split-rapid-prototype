import { User } from "../types/user";
import { api } from "./client";

type RequestOtpResponse = {
  message: string;
};

type VerifyOtpResponse = {
  requiresRegistration?: boolean;
  phoneNumber?: string;
  accessToken?: string;
  user?: User;
};

type GetCurrentUserResponse = {
  user: User;
};

export const requestOtp = async (phoneNumber: string) => {
  const response = await api.post<RequestOtpResponse>("/auth/request-otp", {
    phoneNumber,
  });

  return response.data;
};

export const verifyOtp = async (
  phoneNumber: string,
  otp: string,
  name?: string,
) => {
  const response = await api.post<VerifyOtpResponse>("/auth/verify-otp", {
    phoneNumber,
    otp,
    name,
  });

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get<GetCurrentUserResponse>("/users/me");

  return response.data.user;
};