import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import * as usersController from "../controllers/users.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { searchUsersSchema } from "../schemas/users.schema.js";

const router = Router();

router.get(
  "/me", 
  authenticate, 
  usersController.getCurrentUser
);

router.post(
  "/search",
  authenticate,
  validate(searchUsersSchema),
  usersController.searchUsers,
);

export default router;