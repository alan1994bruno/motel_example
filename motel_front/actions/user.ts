"use server";
import { api } from "@/lib/api";
import { PageResponse } from "@/types/page.type";
import { User, UpdateUserClientData } from "@/types/users.type";

export async function createUser(data: any) {
  await api.post<any>("/users", data);
}

export async function getUsersClient(
  page: number,
): Promise<PageResponse<User>> {
  const res = await api.get("/users/clients?page=" + page);

  return res.data;
}

export async function getUserClientPenalized(
  page: number,
): Promise<PageResponse<User>> {
  const res = await api.get(`/users/penalized?page=${page}`);
  return res.data;
}

export async function getUserClient(uuid: string): Promise<User> {
  const res = await api.get(`/users/${uuid}`);

  return res.data;
}

export async function updateUserClient(
  uuid: string,
  data: UpdateUserClientData,
): Promise<void> {
  await api.put(`/users/${uuid}`, data);
}
