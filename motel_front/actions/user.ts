"use server";
import { ERRO_INESPERADO } from "@/common/constants";
import { api } from "@/lib/api";
import { PageResponse } from "@/types/page.type";
import { User } from "@/types/users.type";
import axios from "axios";

export async function createUser(data: any) {
  try {
    console.log("Creating user with data:", data, api.getUri());
    await api.post<any>("/users", data);
    return { success: true, msg: "O usuário foi criado com sucesso!" };
  } catch (err: unknown) {
    console.log(JSON.stringify(err), "erro");

    if (axios.isAxiosError(err)) {
      if (err.status === 400) {
        return {
          success: false,
          msg: "Não foi possivél alterar, conferia se já não existe esse e-mail no sistema",
        };
      }
    }
    return {
      success: false,
      msg: ERRO_INESPERADO,
    };
  }
}

export async function getUsersClient(
  page: number
): Promise<PageResponse<User>> {
  try {
    console.log("Fetching users client for page:", page);
    const res = await api.get<any>("/users/clients?page=" + page);
    return res.data;
  } catch (err: unknown) {
    throw err;
  }
}

export async function getUserClientPenalized(
  page: number
): Promise<PageResponse<User>> {
  try {
    const res = await api.get<any>(`/users/penalized?page=${page}`);
    console.log("Fetched users penalized data:", res.data);
    return res.data;
  } catch (err: unknown) {
    throw err;
  }
}

export async function getUserClient(uuid: string): Promise<User> {
  try {
    const res = await api.get<any>(`/users/${uuid}`);

    return res.data;
  } catch (err: unknown) {
    throw err;
  }
}

interface UpdateUserClientData {
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  password?: string; // <--- (Opcional)
}

export async function updateUserClient(
  uuid: string,
  data: UpdateUserClientData
): Promise<void> {
  await api.put(`/users/${uuid}`, data);
}
