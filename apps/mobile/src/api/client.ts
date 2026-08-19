import axios from "axios";
import { authStorage } from "../storage/authStorage";

export const api = axios.create({
  baseURL: "http://192.168.1.20:3000",
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await authStorage.getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});