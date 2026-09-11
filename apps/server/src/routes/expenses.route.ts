import { RequestHandler, Router } from "express";
import * as expensesController from "../controllers/expenses.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { groupParamsSchema } from "../schemas/groups.schema.js";
import { createExpenseSchema, groupExpenseParamsSchema } from "../schemas/expenses.schema.js";
import { expensePaginationSchema } from "../schemas/pagination.schema.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  authenticate,
  validate(groupParamsSchema, "params"),
  validate(createExpenseSchema),
  expensesController.addExpense,
);

router.get(
  "/",
  authenticate,
  validate(groupParamsSchema, "params"),
  validate(expensePaginationSchema, "query"),
  expensesController.getAllExpenses,
);

router.get(
  "/:expenseId",
  authenticate,
  validate(groupExpenseParamsSchema, "params"),
  expensesController.getExpense,
);

export default router;