import { apiRequest } from "@/api/client";
import type { AuthUserDto, LoginResponseDto } from "@/types/api";

export async function login(email: string, password: string) {
  return apiRequest<LoginResponseDto>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe() {
  return apiRequest<AuthUserDto>("/api/auth/me");
}
