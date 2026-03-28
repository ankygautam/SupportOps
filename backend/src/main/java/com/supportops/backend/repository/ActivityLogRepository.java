package com.supportops.backend.repository;

import com.supportops.backend.entity.ActivityLog;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, String> {

    List<ActivityLog> findByEntityTypeAndEntityIdOrderByCreatedAtAsc(String entityType, String entityId);

    List<ActivityLog> findTop20ByOrderByCreatedAtDesc();
}
