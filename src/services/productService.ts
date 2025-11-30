import { api } from "./api";
import type { ProductRes, Page, ProductCreateReq, ProductUpdateReq } from "../types/product";

export const productService = {

  list: (page: number = 0, size: number = 10) =>
    api.get<Page<ProductRes>>(`/products?page=${page}&size=${size}`),

  getById: (id: string) =>
    api.get<ProductRes>(`/products/${id}`),

  create: (data: ProductCreateReq) =>
    api.post<ProductRes>("/products", data),

  update: (id: number, data: ProductUpdateReq) =>
    api.put<ProductRes>(`/products/${id}`, data),

  delete: (id: number) =>
    api.delete<void>(`/products/${id}`),

  search: (params: { page?: number; size?: number; query?: string; categoryId?: number }) => {
    const p = new URLSearchParams();
    p.set("page", String(params.page ?? 0));
    p.set("size", String(Math.min(params.size ?? 10, 10)));
    if (params.query?.trim()) p.set("query", params.query.trim());
    if (params.categoryId) p.set("categoryId", String(params.categoryId));
    return api.get<Page<ProductRes>>(`/products/search?${p.toString()}`);
  },
}