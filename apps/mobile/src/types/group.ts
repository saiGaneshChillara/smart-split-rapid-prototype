export type Group = {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  role: "ADMIN" | "MEMBER";
};

export type GroupMember = {
  id: string;
  name: string;
  phone_number: string;
  role: "ADMIN" | "MEMBER";
};

export type GroupDetails = {
  group: Group;
  members: GroupMember[];
};