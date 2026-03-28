package com.supportops.backend.service.impl;

import com.supportops.backend.dto.notification.NotificationResponse;
import com.supportops.backend.entity.Notification;
import com.supportops.backend.entity.User;
import com.supportops.backend.enums.NotificationType;
import com.supportops.backend.exception.ResourceNotFoundException;
import com.supportops.backend.repository.NotificationRepository;
import com.supportops.backend.repository.UserRepository;
import com.supportops.backend.service.NotificationService;
import java.time.Instant;
import java.util.List;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getMyNotifications() {
        User user = currentUser();
        return buildResponse(user.getId());
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(String notificationId) {
        User user = currentUser();
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found."));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new ResourceNotFoundException("Notification not found.");
        }

        notification.setUnread(false);
        notification.setReadAt(Instant.now());
        notificationRepository.save(notification);
        return buildResponse(user.getId());
    }

    @Override
    @Transactional
    public NotificationResponse markAllAsRead() {
        User user = currentUser();
        List<Notification> notifications = notificationRepository.findTop20ByUserIdOrderByCreatedAtDesc(user.getId());
        Instant now = Instant.now();
        notifications.forEach(notification -> {
            notification.setUnread(false);
            notification.setReadAt(now);
        });
        notificationRepository.saveAll(notifications);
        return buildResponse(user.getId());
    }

    @Override
    @Transactional
    public void create(User user, NotificationType type, String title, String message, String link) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setLink(link);
        notificationRepository.save(notification);
    }

    private NotificationResponse buildResponse(String userId) {
        List<NotificationResponse.NotificationItem> items = notificationRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(notification -> new NotificationResponse.NotificationItem(
                        notification.getId(),
                        notification.getType().name(),
                        notification.getTitle(),
                        notification.getMessage(),
                        notification.getLink(),
                        notification.isUnread(),
                        notification.getCreatedAt(),
                        notification.getReadAt()
                ))
                .toList();
        return new NotificationResponse(items, notificationRepository.countByUserIdAndUnreadTrue(userId));
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found."));
    }
}
