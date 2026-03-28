package com.supportops.backend.controller;

import com.supportops.backend.dto.common.ActivityLogResponse;
import com.supportops.backend.dto.dashboard.DashboardSummaryResponse;
import com.supportops.backend.service.DashboardService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD','SUPPORT_AGENT')")
    public ResponseEntity<DashboardSummaryResponse> getSummary() {
        return ResponseEntity.ok(dashboardService.getSummary());
    }

    @GetMapping("/activity")
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD','SUPPORT_AGENT')")
    public ResponseEntity<List<ActivityLogResponse>> getActivity() {
        return ResponseEntity.ok(dashboardService.getRecentActivity());
    }
}
