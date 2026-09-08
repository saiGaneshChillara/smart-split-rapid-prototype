import { Router } from "express";

import * as groupsController from "../controllers/groups.controller.js";
import expensesRouter from "./expenses.route.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { addMembersSchema, createGroupSchema, groupParamsSchema } from "../schemas/groups.schema.js";
import { createExpenseSchema } from "../schemas/expenses.schema.js";


const router = Router();

router.post(
  "/",
  authenticate,
  validate(createGroupSchema),
  groupsController.createGroup,
);

router.get(
  "/",
  authenticate,
  groupsController.listGroups,
);

router.get(
  "/:groupId",
  authenticate,
  validate(groupParamsSchema, "params"),
  groupsController.getGroup,
);

router.post(
  "/:groupId/members",
  authenticate,
  validate(groupParamsSchema, "params"),
  validate(addMembersSchema),
  groupsController.addMembers,
);

router.post(
  "/:groupId/expenses",
  authenticate,
  validate(createExpenseSchema),
  expensesRouter,
)

export default router;