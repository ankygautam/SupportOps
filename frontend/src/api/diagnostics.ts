import { apiRequest } from "@/api/client";

export interface HealthStatus {
  status: string;
  service: string;
  timestamp: string;
}

export async function getHealthStatus() {
  return apiRequest<HealthStatus>("/api/health");
}
