import { api } from "./api";
import type { UpdateUserRolesReq, UserListItem, UsersPage } from "../types/user";

export const userService = {
  list: (page: number = 0, size: number = 10) =>
    api.get<UsersPage>(`/users?page=${page}&size=${size}`),

  updateRoles: (userId: number, body: UpdateUserRolesReq) =>
    api.put<UserListItem>(`/users/${userId}/roles`, body),
};