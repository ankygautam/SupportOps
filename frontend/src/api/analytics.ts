import { apiRequest } from "@/api/client";
import type { AnalyticsIssuesDto, AnalyticsSummaryDto, AnalyticsTeamPerformanceDto } from "@/types/api";

export async function getAnalyticsSummary(range: string, team: string) {
  return apiRequest<AnalyticsSummaryDto>("/api/analytics/summary", undefined, { range, team });
}

export async function getAnalyticsTeamPerformance(team: string) {
  return apiRequest<AnalyticsTeamPerformanceDto>("/api/analytics/team-performance", undefined, { team });
}

export async function getAnalyticsIssues(range: string, team: string) {
  return apiRequest<AnalyticsIssuesDto>("/api/analytics/issues", undefined, { range, team });
}
