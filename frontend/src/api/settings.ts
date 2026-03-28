import { apiRequest } from "@/api/client";
import type { UserPreferencesDto } from "@/types/api";

export async function getUserPreferences() {
  return apiRequest<UserPreferencesDto>("/api/users/me/preferences");
}

export async function updateUserPreferences(payload: UserPreferencesDto) {
  return apiRequest<UserPreferencesDto>("/api/users/me/preferences", {
    method: "PUT",
    body: JSON.stringify({
      profile: {
        timezone: payload.profile.timezone,
        dateFormat: payload.profile.dateFormat,
      },
      notifications: payload.notifications,
      display: payload.display,
      operations: payload.operations,
    }),
  });
}
