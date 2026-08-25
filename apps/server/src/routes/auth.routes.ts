import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { requestOtpSchema, verifyOtpSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post(
  "/request-otp",
  validate(requestOtpSchema),
  authController.requestOtp,
);
router.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  authController.verifyOtp,
);

export default router;