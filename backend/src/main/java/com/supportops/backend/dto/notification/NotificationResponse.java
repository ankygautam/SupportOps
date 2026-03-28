package com.supportops.backend.dto.notification;

import java.time.Instant;
import java.util.List;

public record NotificationResponse(
        List<NotificationItem> items,
        long unreadCount
) {
    public record NotificationItem(
            String id,
            String type,
            String title,
            String message,
            String link,
            boolean unread,
            Instant createdAt,
            Instant readAt
    ) {
    }
}
