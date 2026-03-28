package com.supportops.backend.service;

import com.supportops.backend.dto.analytics.AnalyticsIssuesResponse;
import com.supportops.backend.dto.analytics.AnalyticsSummaryResponse;
import com.supportops.backend.dto.analytics.AnalyticsTeamPerformanceResponse;

public interface AnalyticsService {

    AnalyticsSummaryResponse getSummary(String range, String team);

    AnalyticsTeamPerformanceResponse getTeamPerformance(String team);

    AnalyticsIssuesResponse getIssues(String range, String team);
}
