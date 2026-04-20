export type FeatureReq = { icon: string; label: string };
export type FeatureRes = { icon: string; label: string };

export type ProductRes = {
  id: number; name: string; description?: string; price?: number;
  images: string[]; categories: number[]; productType?: string;
  features?: FeatureRes[];
};

export type Page<T> = {
  content: T[]; totalElements: number; totalPages: number; number: number; size: number;
};

export type ProductCreateReq = {
  name: string; description?: string; price?: number; imageUrls?: string[];
  categoryIds?: number[]; productType?: string; features?: FeatureReq[];
};

export type ProductUpdateReq = ProductCreateReq;

export type ProductSearchParams = {
  page?: number;
  size?: number;
  query?: string;
  categoryId?: number;
  productType?: "VENTA" | "RESERVA";
  dateFrom?: string;
  dateTo?: string;
};
