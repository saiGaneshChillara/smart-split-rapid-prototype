import { api } from "./client";

export type SearchUserResponse = {
  id: string;
  name: string;
  phone_number: string;
};

export const searchUsers = async (
  phoneNumbers: string[],
): Promise<SearchUserResponse[]> => {
  const response = await api.post<{ users: SearchUserResponse[] }>("/users/search", {
    phoneNumbers,
  });

  return response.data.users;
};