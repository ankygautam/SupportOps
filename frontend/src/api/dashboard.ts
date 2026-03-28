import { apiRequest } from "@/api/client";
import type { ActivityLogDto, DashboardSummaryDto } from "@/types/api";

export async function getDashboardSummary() {
  return apiRequest<DashboardSummaryDto>("/api/dashboard/summary");
}

export async function getDashboardActivity() {
  return apiRequest<ActivityLogDto[]>("/api/dashboard/activity");
}
