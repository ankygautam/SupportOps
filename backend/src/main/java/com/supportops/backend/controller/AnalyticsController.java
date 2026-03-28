package com.supportops.backend.controller;

import com.supportops.backend.dto.analytics.AnalyticsIssuesResponse;
import com.supportops.backend.dto.analytics.AnalyticsSummaryResponse;
import com.supportops.backend.dto.analytics.AnalyticsTeamPerformanceResponse;
import com.supportops.backend.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD')")
    public ResponseEntity<AnalyticsSummaryResponse> getSummary(
            @RequestParam(defaultValue = "30d") String range,
            @RequestParam(defaultValue = "All Teams") String team
    ) {
        return ResponseEntity.ok(analyticsService.getSummary(range, team));
    }

    @GetMapping("/team-performance")
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD')")
    public ResponseEntity<AnalyticsTeamPerformanceResponse> getTeamPerformance(
            @RequestParam(defaultValue = "All Teams") String team
    ) {
        return ResponseEntity.ok(analyticsService.getTeamPerformance(team));
    }

    @GetMapping("/issues")
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD')")
    public ResponseEntity<AnalyticsIssuesResponse> getIssues(
            @RequestParam(defaultValue = "30d") String range,
            @RequestParam(defaultValue = "All Teams") String team
    ) {
        return ResponseEntity.ok(analyticsService.getIssues(range, team));
    }
}
