import { Request, Response } from "express";
import * as expensesService from "../services/expenses.service.js";
import { GroupParams } from "../schemas/groups.schema.js";
import { CreateExpenseInput, GroupExpenseParams } from "../schemas/expenses.schema.js";
import { ExpensePaginationInput } from "../schemas/pagination.schema.js";

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

export const getExpense = async (
  req: Request<GroupExpenseParams>,
  res: Response,
) => {
  const result = await expensesService.getExpense(
    req.params.groupId,
    req.params.expenseId,
    req.user.id,
  );

  res.status(200).json(result);
};

export const getAllExpenses = async (
  req: Request<GroupParams, {}, {}, ExpensePaginationInput, {}>,
  res: Response,
) => {
  const result = await expensesService.getAllExpenses(
    req.params.groupId,
    req.user.id,
    req.query,
  );

  res.status(200).json(result);
};