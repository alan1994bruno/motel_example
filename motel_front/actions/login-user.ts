"use server";

import { api } from "@/lib/api";
import { cookies } from "next/headers";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginResponse = {
  email: string;
};

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
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

  return { email };
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post("/auth/forgot-password", { email });
}

export async function resetPassword(data: {
  code: string;
  newPassword: string;
}): Promise<void> {
  await api.post("/auth/reset-password", data);
}
