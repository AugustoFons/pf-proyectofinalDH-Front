import { api } from "./api";
import type { ProductRes, Page, ProductCreateReq, ProductUpdateReq, ProductSearchParams } from "../types/product";

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

  search: (params: ProductSearchParams) => {
    const p = new URLSearchParams();
    p.set("page", String(params.page ?? 0));
    p.set("size", String(Math.min(params.size ?? 10, 10)));
    if (params.query?.trim()) p.set("query", params.query.trim());
    if (params.categoryId != null) p.set("categoryId", String(params.categoryId));
    if (params.productType) p.set("productType", params.productType);
    if (params.dateFrom) p.set("dateFrom", params.dateFrom);
    if (params.dateTo) p.set("dateTo", params.dateTo);
    return api.get<Page<ProductRes>>(`/products/search?${p.toString()}`);
  },

  suggestions: (q: string, limit: number = 5) => {
    const p = new URLSearchParams();
    p.set("q", q);
    p.set("limit", String(Math.min(Math.max(limit, 1), 10)));
    return api.get<string[]>(`/products/suggestions?${p.toString()}`);
  },
}