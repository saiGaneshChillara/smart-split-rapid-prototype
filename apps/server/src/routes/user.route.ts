import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.get("/me", authenticate, userController.getCurrentUser);

export default router;