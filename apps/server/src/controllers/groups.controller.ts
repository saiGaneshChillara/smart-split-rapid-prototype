import { Request, Response } from "express";
import * as groupsService from "../services/groups.service.js";
import { AddMembersInput, CreateGroupInput, GroupParams } from "../schemas/groups.schema.js";

export const createGroup = async (
  req: Request<{}, {}, CreateGroupInput>,
  res: Response,
) => {
  const { name } = req.body;

  const result = await groupsService.createGroup(
    name,
    req.user.id,
  );

  res.status(201).json(result);
};

export const listGroups = async (
  req: Request,
  res: Response,
) => {
  const result = await groupsService.listGroups(req.user.id);

  res.status(200).json(result);
};

export const getGroup = async (
  req: Request<GroupParams>,
  res: Response,
) => {
  const result = await groupsService.getGroup(
    req.params.groupId, 
    req.user.id
  );

  res.status(200).json(result);
};

export const addMembers = async (
  req: Request<
    GroupParams,
    {},
    AddMembersInput
  >,
  res: Response,
) => {
  const result = await groupsService.addMembers(
    req.params.groupId,
    req.user.id,
    req.body.phoneNumbers,
  );

  res.status(200).json(result);
};
