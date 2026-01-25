"use server";

import { api } from "@/lib/api";
import {
  ReservationApiResponse,
  ReservationSummary,
  ReservationRequest,
} from "@/types/reresvation.type";

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

export async function conclusionReservation(publicId: string): Promise<void> {
  await api.put(`/reservations/${publicId}/complete`);
}

export async function checkin(publicId: string): Promise<void> {
  await api.put(`/reservations/${publicId}/checkin`);
}

async function getReservationsByStatus(
  status: string,
): Promise<ReservationApiResponse> {
  const res = await api.get(`/reservations/status/${status}`);
  return res.data;
}

export async function getReservationActive(): Promise<ReservationApiResponse> {
  return getReservationsByStatus("active");
}

export async function getReservationCancelled(): Promise<ReservationApiResponse> {
  return getReservationsByStatus("cancelled");
}

export async function getReservationCompleted(): Promise<ReservationApiResponse> {
  return getReservationsByStatus("completed");
}
