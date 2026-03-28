package com.supportops.backend.service;

import com.supportops.backend.dto.notification.NotificationResponse;
import com.supportops.backend.entity.User;
import com.supportops.backend.enums.NotificationType;

public interface NotificationService {

    NotificationResponse getMyNotifications();

    NotificationResponse markAsRead(String notificationId);

    NotificationResponse markAllAsRead();

    void create(User user, NotificationType type, String title, String message, String link);
}
