export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  email: string;
}

export interface RequestResetPassword {
  code: string;
  newPassword: string;
}
