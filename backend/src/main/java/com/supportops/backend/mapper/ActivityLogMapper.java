package com.supportops.backend.mapper;

import com.supportops.backend.dto.common.ActivityLogResponse;
import com.supportops.backend.entity.ActivityLog;
import org.springframework.stereotype.Component;

@Component
public class ActivityLogMapper {

    public ActivityLogResponse toResponse(ActivityLog activityLog) {
        return new ActivityLogResponse(
                activityLog.getId(),
                activityLog.getEntityType(),
                activityLog.getEntityId(),
                activityLog.getAction(),
                activityLog.getDescription(),
                activityLog.getActorName(),
                activityLog.getCreatedAt()
        );
    }
}
