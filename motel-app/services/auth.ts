import {
  AuthResponse,
  LoginRequest,
  RequestResetPassword,
} from "@/@types/auth";
import { api } from "./api";

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post("/auth/login", data);
  return response.data;
}

export async function forgotPassword(email: string): Promise<void> {
  await api.post("/auth/forgot-password", { email });
}

export async function resetPassword(data: RequestResetPassword): Promise<void> {
  await api.post("/auth/reset-password", data);
}
