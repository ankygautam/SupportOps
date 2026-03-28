import { apiRequest } from "@/api/client";
import type { TeamMemberDto, UserSummaryDto } from "@/types/api";

export async function getUsers() {
  return apiRequest<UserSummaryDto[]>("/api/users");
}

export async function getTeamMembers(role?: string) {
  return apiRequest<TeamMemberDto[]>("/api/users/team", undefined, role ? { role } : undefined);
}

export async function updateTeamMemberRole(id: string, role: "ADMIN" | "SUPPORT_AGENT" | "TEAM_LEAD") {
  return apiRequest<TeamMemberDto>(`/api/users/${id}/role`, {
    method: "PUT",
    body: JSON.stringify({ role }),
  });
}

export async function updateTeamMemberStatus(id: string, active: boolean, reassignToUserId?: string) {
  return apiRequest<TeamMemberDto>(`/api/users/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ active, reassignToUserId }),
  });
}
