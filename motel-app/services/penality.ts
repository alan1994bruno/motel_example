import { Payment } from "@/@types/penality";
import { api } from "@/services/api";

export async function getPenalty(): Promise<Payment> {
  const res = await api.get(`/penalties/my-penalty`);

  return res.data;
}
