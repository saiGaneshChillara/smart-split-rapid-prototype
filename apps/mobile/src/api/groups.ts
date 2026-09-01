import { Group, GroupDetails, GroupSummary } from "../types/group";
import { api } from "./client";

export const createGroup = async (name: string) => {
  const response = await api.post<{ group: GroupSummary }>("/groups", { 
    name 
  });

  return response.data.group;
};

export const getGroups = async () => {
  const response = await api.get<{ groups: Group[] }>("/groups");

  return response.data.groups;
};

export const getGroup = async (groupId: string): Promise<GroupDetails> => {
  const response = await api.get<GroupDetails>(`/groups/${groupId}`);

  return response.data;
};

export const addMembers = async (
  groupId: string,
  phoneNumbers: string[],
) => {
  await api.post(`/groups/${groupId}/members`, {
    phoneNumbers,
  });
};