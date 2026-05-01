import { api } from "./api";
import type { ReservationCreateReq, ReservationRes } from "../types/reservation";

export const reservationService = {
  create: (payload: ReservationCreateReq) =>
    api.post<ReservationRes>("/reservations", payload),
};
