import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validateBody } from "../middleware/validate.middleware.js";
import { requestOtpSchema, verifyOtpSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post(
  "/request-otp",
  validateBody(requestOtpSchema),
  authController.requestOtp,
);
router.post(
  "/verify-otp",
  validateBody(verifyOtpSchema),
  authController.verifyOtp,
);

export default router;