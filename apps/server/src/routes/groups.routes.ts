import { Router } from "express";

import * as groupsController from "../controllers/groups.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { addMembersSchema, createGroupSchema, groupParamsSchema } from "../schemas/groups.schema.js";


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

export default router;