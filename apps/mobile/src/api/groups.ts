import { api } from "./client";

export const createGroup = async (name: string) => {
  const response = await api.post("/groups", { 
    name 
  });

  return response.data.group;
};

export const getGroups = async () => {
  const response = await api.get("/groups");

  return response.data.groups;
};

export const getGroup = async (groupId: string) => {
  const response = await api.get(`/groups/${groupId}`);

  return response.data;
};