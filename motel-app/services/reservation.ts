import { ReservationRequest, ReservationSummary } from "@/@types/reresvation";
import { api } from "./api";

export async function saveReservation(data: ReservationRequest): Promise<void> {
  await api.post("/reservations", data);
}

export async function getMyReservation(): Promise<ReservationSummary> {
  const res = await api.get("/reservations/my-reservation");
  return res.data;
}

export async function cancelReservation(publicId: string): Promise<void> {
  await api.delete(`/reservations/${publicId}`);
}
