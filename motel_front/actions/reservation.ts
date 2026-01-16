"use server";
import { api } from "@/lib/api";
import {
  ReservationApiResponse,
  ReservationSummary,
} from "@/types/reresvation.type";
import { RoomResponse, RoomType, RoomTypeList } from "@/types/rooms.type";

export type ReservationRequest = {
  roomPublicId: string; // uuid
  checkinTime: string; // ISO 8601 datetime
  checkoutTime: string; // ISO 8601 datetime
};

export async function saveReservation(data: ReservationRequest): Promise<void> {
  try {
    await api.post<RoomResponse>("/reservations", data);
  } catch {}
}

export async function getMyReservation(): Promise<ReservationSummary | null> {
  try {
    const res = await api.get<String>(`/reservations/my-reservation`);

    return res.data;
  } catch {
    return null;
  }
}

export async function cancelReservation(publicId: string): Promise<void> {
  try {
    await api.delete<RoomResponse>("/reservations/" + publicId);
  } catch {}
}

export async function getReservationActive(): Promise<ReservationApiResponse> {
  const res = await api.get(`/reservations/status/active`);
  return res.data;
}

export async function getReservationCancelled(): Promise<ReservationApiResponse> {
  const res = await api.get(`/reservations/status/cancelled`);
  return res.data;
}

export async function getReservationCompleted(): Promise<ReservationApiResponse> {
  const res = await api.get(`/reservations/status/completed`);
  return res.data;
}

export async function checkin(publicId: string): Promise<void> {
  await api.put<RoomResponse>(`/reservations/${publicId}/checkin`);
}
