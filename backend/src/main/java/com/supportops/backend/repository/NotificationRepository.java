package com.supportops.backend.repository;

import com.supportops.backend.entity.Notification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, String> {

    List<Notification> findTop20ByUserIdOrderByCreatedAtDesc(String userId);

    long countByUserIdAndUnreadTrue(String userId);
}
