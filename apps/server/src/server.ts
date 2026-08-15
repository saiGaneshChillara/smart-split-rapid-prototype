import express from "express";
import { env } from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart-Split API is running",
  });
});

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
