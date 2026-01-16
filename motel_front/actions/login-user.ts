"use server";

import { ERRO_INESPERADO } from "@/common/constants";
import { api } from "@/lib/api";
import axios from "axios";
import { cookies } from "next/headers";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginResponse = {
  success: boolean;
  data?: string;
  msg: string;
};

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  try {
    const response = await api.post("/auth/login", data);
    const token = response.data.token;
    const email = response.data.email;

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: true, data: email, msg: "" };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.status == 400) {
        return {
          success: false,
          msg: "Falha confira se o email ou senha estão corretos",
        };
      } else if (error.status == 403) {
        return {
          success: false,
          msg: "Você está com acesso bloqueado!",
        };
      }
    }
  }
  return {
    success: false,
    msg: ERRO_INESPERADO,
  };
}
