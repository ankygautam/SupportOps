package com.supportops.backend.service;

import com.supportops.backend.dto.common.ActivityLogResponse;
import java.util.List;

public interface ActivityLogService {

    void log(String entityType, String entityId, String action, String description, String actorName);

    List<ActivityLogResponse> getTimeline(String entityType, String entityId);
}
