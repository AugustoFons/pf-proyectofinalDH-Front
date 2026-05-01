export type ReservationCreateReq = {
  productId: number;
  dateFrom: string;
  dateTo: string;
};

export type ReservationRes = {
  id: number;
  productId: number;
  userId: number;
  dateFrom: string;
  dateTo: string;
  status: "PENDING" | "BOOKED" | "CANCELLED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
};
