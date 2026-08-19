import { api } from "./client";

export const requestOtp = async (phoneNumber: string) => {
  const response = await api.post("/auth/request-otp", {
    phoneNumber,
  });

  return response.data;
};

export const verfiyOtp = async (
  phoneNumber: string,
  otp: string,
  name?: string,
) => {
  const response = await api.post("/auth/verify-otp", {
    phoneNumber,
    otp,
    name,
  });

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/users/me");

  return response.data.user;
};