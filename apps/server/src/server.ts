import express from "express";
import { env } from "./config/env.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.route.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart-Split API is running",
  });
});

app.use(errorMiddleware);

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});
