import { CreateUserData } from "@/@types/user";
import { api } from "@/services/api";

export async function createUser(data: CreateUserData) {
  await api.post("/users", data);
}
