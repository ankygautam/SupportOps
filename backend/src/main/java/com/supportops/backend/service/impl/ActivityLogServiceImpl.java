package com.supportops.backend.service.impl;

import com.supportops.backend.dto.common.ActivityLogResponse;
import com.supportops.backend.entity.ActivityLog;
import com.supportops.backend.mapper.ActivityLogMapper;
import com.supportops.backend.repository.ActivityLogRepository;
import com.supportops.backend.service.ActivityLogService;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ActivityLogServiceImpl implements ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final ActivityLogMapper activityLogMapper;

    public ActivityLogServiceImpl(ActivityLogRepository activityLogRepository, ActivityLogMapper activityLogMapper) {
        this.activityLogRepository = activityLogRepository;
        this.activityLogMapper = activityLogMapper;
    }

    @Override
    @Transactional
    public void log(String entityType, String entityId, String action, String description, String actorName) {
        ActivityLog activityLog = new ActivityLog();
        activityLog.setEntityType(entityType);
        activityLog.setEntityId(entityId);
        activityLog.setAction(action);
        activityLog.setDescription(description);
        activityLog.setActorName(actorName);
        activityLogRepository.save(activityLog);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityLogResponse> getTimeline(String entityType, String entityId) {
        return activityLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtAsc(entityType, entityId)
                .stream()
                .map(activityLogMapper::toResponse)
                .toList();
    }
}
