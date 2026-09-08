import { Router } from "express";
import * as expensesController from "../controllers/expenses.controller.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  expensesController.addExpense,
);

export default router;