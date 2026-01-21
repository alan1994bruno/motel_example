"use server";
import { api } from "@/lib/api";
import { ReservationSummary } from "@/types/reresvation.type";

export async function getPenalty(): Promise<ReservationSummary> {
  const res = await api.get(`/penalties/my-penalty`);

  return res.data;
}

export async function removePenalty(id: string): Promise<void> {
  await api.delete(`/penalties/${id}`);
}
