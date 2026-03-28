package com.supportops.backend.dto.user;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateUserPreferencesRequest(
        @Valid @NotNull ProfileSection profile,
        @Valid @NotNull NotificationSection notifications,
        @Valid @NotNull DisplaySection display,
        @Valid @NotNull OperationsSection operations
    ) {
    public record ProfileSection(
            @NotBlank String timezone,
            @NotBlank String dateFormat
    ) {
    }

    public record NotificationSection(
            boolean emailAlerts,
            boolean assignmentAlerts,
            boolean slaBreachAlerts,
            boolean escalationAlerts,
            boolean incidentAlerts,
            boolean incidentResolvedAlerts,
            boolean dailySummary,
            boolean sound
    ) {
    }

    public record DisplaySection(
            boolean compactTableMode,
            @NotBlank String defaultDashboardView,
            @NotBlank String defaultLandingPage,
            @NotBlank String tableDensity,
            boolean showResolvedTickets,
            boolean sidebarCollapsed
    ) {
    }

    public record OperationsSection(
            @NotBlank String businessHours,
            @NotBlank String workingHours,
            @NotBlank String defaultSlaTargets,
            @NotBlank String escalationRules,
            boolean autoAssignment
    ) {
    }
}
