export type Group = {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  role: "ADMIN" | "MEMBER";
};