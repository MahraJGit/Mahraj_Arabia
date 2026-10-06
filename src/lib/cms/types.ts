export type PublishStatus = "draft" | "published";
export type UserRole = "admin" | "editor";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type SessionPayload = {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  exp: number;
};
