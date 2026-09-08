import { Request, Response } from "express";
import * as expensesService from "../services/expenses.service.js";
import { GroupParams } from "../schemas/groups.schema.js";
import { CreateExpenseInput } from "../schemas/expenses.schema.js";

export const addExpense = async (
  req: Request<GroupParams, {}, CreateExpenseInput>,
  res: Response,
) => {
  const result = await expensesService.addExpense(
    req.params.groupId,
    req.user.id,
    req.body,
  );

  res.status(201).json(result);
};