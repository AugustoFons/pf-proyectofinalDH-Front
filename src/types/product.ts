export type ProductRes = {
  id: number; name: string; description?: string; price?: number;
  images: string[]; categories: number[]; productType?: string;
};

export type Page<T> = {
  content: T[]; totalElements: number; totalPages: number; number: number; size: number;
};

export type ProductCreateReq = {
  name: string; description?: string; price?: number; imageUrls?: string[]; categoryIds?: number[]; productType?: string;
};

export type ProductUpdateReq = ProductCreateReq;
