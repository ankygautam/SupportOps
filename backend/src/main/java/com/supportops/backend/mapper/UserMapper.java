package com.supportops.backend.mapper;

import com.supportops.backend.dto.common.UserSummaryResponse;
import com.supportops.backend.dto.user.TeamMemberResponse;
import com.supportops.backend.dto.user.UpdateUserPreferencesRequest;
import com.supportops.backend.dto.user.UserPreferencesResponse;
import com.supportops.backend.entity.User;
import com.supportops.backend.entity.UserPreference;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserSummaryResponse toSummary(User user) {
        return new UserSummaryResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getTeam(),
                user.getRole().getName().name(),
                user.isActive()
        );
    }

    public TeamMemberResponse toTeamMember(User user, long activeTickets, long resolvedThisWeek, long averageResponseMinutes) {
        return new TeamMemberResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getTeam(),
                user.getRole().getName().name(),
                activeTickets,
                resolvedThisWeek,
                averageResponseMinutes,
                user.isActive()
        );
    }

    public UserPreferencesResponse toPreferences(User user, UserPreference preference) {
        return new UserPreferencesResponse(
                new UserPreferencesResponse.ProfileSection(
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole().getName().name(),
                        preference.getTimezone(),
                        preference.getDateFormat()
                ),
                new UserPreferencesResponse.NotificationSection(
                        preference.isEmailAlerts(),
                        preference.isAssignmentAlerts(),
                        preference.isSlaBreachAlerts(),
                        preference.isEscalationAlerts(),
                        preference.isIncidentAlerts(),
                        preference.isIncidentResolvedAlerts(),
                        preference.isDailySummary(),
                        preference.isSound()
                ),
                new UserPreferencesResponse.DisplaySection(
                        preference.isCompactTableMode(),
                        preference.getDefaultDashboardView(),
                        preference.getDefaultLandingPage(),
                        preference.getTableDensity(),
                        preference.isShowResolvedTickets(),
                        preference.isSidebarCollapsed()
                ),
                new UserPreferencesResponse.OperationsSection(
                        preference.getBusinessHours(),
                        preference.getWorkingHours(),
                        preference.getDefaultSlaTargets(),
                        preference.getEscalationRules(),
                        preference.isAutoAssignment()
                )
        );
    }

    public void applyPreferences(UserPreference preference, UpdateUserPreferencesRequest request) {
        preference.setTimezone(request.profile().timezone());
        preference.setDateFormat(request.profile().dateFormat());
        preference.setEmailAlerts(request.notifications().emailAlerts());
        preference.setAssignmentAlerts(request.notifications().assignmentAlerts());
        preference.setSlaBreachAlerts(request.notifications().slaBreachAlerts());
        preference.setEscalationAlerts(request.notifications().escalationAlerts());
        preference.setIncidentAlerts(request.notifications().incidentAlerts());
        preference.setIncidentResolvedAlerts(request.notifications().incidentResolvedAlerts());
        preference.setDailySummary(request.notifications().dailySummary());
        preference.setSound(request.notifications().sound());
        preference.setCompactTableMode(request.display().compactTableMode());
        preference.setDefaultDashboardView(request.display().defaultDashboardView());
        preference.setDefaultLandingPage(request.display().defaultLandingPage());
        preference.setTableDensity(request.display().tableDensity());
        preference.setShowResolvedTickets(request.display().showResolvedTickets());
        preference.setSidebarCollapsed(request.display().sidebarCollapsed());
        preference.setBusinessHours(request.operations().businessHours());
        preference.setWorkingHours(request.operations().workingHours());
        preference.setDefaultSlaTargets(request.operations().defaultSlaTargets());
        preference.setEscalationRules(request.operations().escalationRules());
        preference.setAutoAssignment(request.operations().autoAssignment());
    }
}
