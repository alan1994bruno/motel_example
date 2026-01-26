"use server";
import { api } from "@/lib/api";
import { Payment } from "@/types/penality.type";

export async function getPenalty(): Promise<Payment> {
  const res = await api.get(`/penalties/my-penalty`);

  return res.data;
}

export async function removePenalty(id: string): Promise<void> {
  await api.delete(`/penalties/${id}`);
}
