import { apiRequest } from "@/api/client";
import type { NotificationResponseDto } from "@/types/api";

export async function getNotifications() {
  return apiRequest<NotificationResponseDto>("/api/notifications");
}

export async function markNotificationRead(id: string) {
  return apiRequest<NotificationResponseDto>(`/api/notifications/${id}/read`, {
    method: "PUT",
  });
}

export async function markAllNotificationsRead() {
  return apiRequest<NotificationResponseDto>("/api/notifications/read-all", {
    method: "PUT",
  });
}
