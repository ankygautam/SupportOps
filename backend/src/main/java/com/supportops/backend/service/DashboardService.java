package com.supportops.backend.service;

import com.supportops.backend.dto.common.ActivityLogResponse;
import com.supportops.backend.dto.dashboard.DashboardSummaryResponse;
import java.util.List;

public interface DashboardService {

    DashboardSummaryResponse getSummary();

    List<ActivityLogResponse> getRecentActivity();
}
