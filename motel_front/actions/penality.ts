"use server";
import { api } from "@/lib/api";

export async function getPenalty(): Promise<ReservationSummary | null> {
  try {
    const res = await api.get<String>(`/penalties/my-penalty`);

    return res.data;
  } catch {
    return null;
  }
}

export async function removePenalty(id: string): Promise<void> {
  try {
    await api.delete(`/penalties/${id}`);
  } catch (e) {
    console.error("Erro ao remover penalidade:", e);
  }
}
