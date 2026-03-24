import { api } from "./api";

export type CategoryRes = { id: number; name: string; };

export const categoryService = {
  list: () => api.get<CategoryRes[]>("/categories"),
  create: (name: string) => api.post<CategoryRes>("/categories", { name }),
  update: (id: number, name: string) => api.put<CategoryRes>(`/categories/${id}`, { name }),
  delete: (id: number) => api.delete<void>(`/categories/${id}`),
}