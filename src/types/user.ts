import type { Page } from "./product";

export type UserListItem = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  enabled: boolean;
  roles: string[];
};

export type UsersPage = Page<UserListItem>;

export type UpdateUserRolesReq = {
  roles: string[];
};

export type ChangePasswordReq = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ChangePasswordRes = {
  message: string;
};