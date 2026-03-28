package com.supportops.backend.dto.user;

public record UserPreferencesResponse(
        ProfileSection profile,
        NotificationSection notifications,
        DisplaySection display,
        OperationsSection operations
) {
    public record ProfileSection(
            String name,
            String email,
            String role,
            String timezone,
            String dateFormat
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
            String defaultDashboardView,
            String defaultLandingPage,
            String tableDensity,
            boolean showResolvedTickets,
            boolean sidebarCollapsed
    ) {
    }

    public record OperationsSection(
            String businessHours,
            String workingHours,
            String defaultSlaTargets,
            String escalationRules,
            boolean autoAssignment
        ) {
    }
}
