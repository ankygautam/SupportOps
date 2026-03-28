package com.supportops.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_preferences")
public class UserPreference extends BaseEntity {

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 80)
    private String timezone = "America/Edmonton";

    @Column(nullable = false, length = 40)
    private String dateFormat = "MMM d, yyyy";

    @Column(nullable = false)
    private boolean emailAlerts = true;

    @Column(nullable = false)
    private boolean assignmentAlerts = true;

    @Column(nullable = false)
    private boolean slaBreachAlerts = true;

    @Column(nullable = false)
    private boolean escalationAlerts = true;

    @Column(nullable = false)
    private boolean incidentAlerts = true;

    @Column(nullable = false)
    private boolean incidentResolvedAlerts = true;

    @Column(nullable = false)
    private boolean dailySummary = false;

    @Column(nullable = false)
    private boolean sound = false;

    @Column(nullable = false)
    private boolean compactTableMode = false;

    @Column(nullable = false, length = 120)
    private String defaultDashboardView = "Operations Overview";

    @Column(nullable = false, length = 64)
    private String defaultLandingPage = "/dashboard";

    @Column(nullable = false, length = 24)
    private String tableDensity = "comfortable";

    @Column(nullable = false)
    private boolean showResolvedTickets = true;

    @Column(nullable = false)
    private boolean sidebarCollapsed = false;

    @Column(nullable = false, length = 120)
    private String businessHours = "08:00 - 18:00 MT";

    @Column(nullable = false, length = 120)
    private String workingHours = "08:00 - 17:00 local";

    @Column(nullable = false, length = 120)
    private String defaultSlaTargets = "Priority Based Policy";

    @Column(nullable = false, length = 160)
    private String escalationRules = "Manager review for critical or breached queues";

    @Column(nullable = false)
    private boolean autoAssignment = true;

    @PrePersist
    void prePersist() {
        ensureId();
    }

    public UserPreference() {
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getDateFormat() {
        return dateFormat;
    }

    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }

    public boolean isEmailAlerts() {
        return emailAlerts;
    }

    public void setEmailAlerts(boolean emailAlerts) {
        this.emailAlerts = emailAlerts;
    }

    public boolean isAssignmentAlerts() {
        return assignmentAlerts;
    }

    public void setAssignmentAlerts(boolean assignmentAlerts) {
        this.assignmentAlerts = assignmentAlerts;
    }

    public boolean isSlaBreachAlerts() {
        return slaBreachAlerts;
    }

    public void setSlaBreachAlerts(boolean slaBreachAlerts) {
        this.slaBreachAlerts = slaBreachAlerts;
    }

    public boolean isEscalationAlerts() {
        return escalationAlerts;
    }

    public void setEscalationAlerts(boolean escalationAlerts) {
        this.escalationAlerts = escalationAlerts;
    }

    public boolean isIncidentAlerts() {
        return incidentAlerts;
    }

    public void setIncidentAlerts(boolean incidentAlerts) {
        this.incidentAlerts = incidentAlerts;
    }

    public boolean isIncidentResolvedAlerts() {
        return incidentResolvedAlerts;
    }

    public void setIncidentResolvedAlerts(boolean incidentResolvedAlerts) {
        this.incidentResolvedAlerts = incidentResolvedAlerts;
    }

    public boolean isDailySummary() {
        return dailySummary;
    }

    public void setDailySummary(boolean dailySummary) {
        this.dailySummary = dailySummary;
    }

    public boolean isSound() {
        return sound;
    }

    public void setSound(boolean sound) {
        this.sound = sound;
    }

    public boolean isCompactTableMode() {
        return compactTableMode;
    }

    public void setCompactTableMode(boolean compactTableMode) {
        this.compactTableMode = compactTableMode;
    }

    public String getDefaultDashboardView() {
        return defaultDashboardView;
    }

    public void setDefaultDashboardView(String defaultDashboardView) {
        this.defaultDashboardView = defaultDashboardView;
    }

    public String getDefaultLandingPage() {
        return defaultLandingPage;
    }

    public void setDefaultLandingPage(String defaultLandingPage) {
        this.defaultLandingPage = defaultLandingPage;
    }

    public String getTableDensity() {
        return tableDensity;
    }

    public void setTableDensity(String tableDensity) {
        this.tableDensity = tableDensity;
    }

    public boolean isShowResolvedTickets() {
        return showResolvedTickets;
    }

    public void setShowResolvedTickets(boolean showResolvedTickets) {
        this.showResolvedTickets = showResolvedTickets;
    }

    public boolean isSidebarCollapsed() {
        return sidebarCollapsed;
    }

    public void setSidebarCollapsed(boolean sidebarCollapsed) {
        this.sidebarCollapsed = sidebarCollapsed;
    }

    public String getBusinessHours() {
        return businessHours;
    }

    public void setBusinessHours(String businessHours) {
        this.businessHours = businessHours;
    }

    public String getWorkingHours() {
        return workingHours;
    }

    public void setWorkingHours(String workingHours) {
        this.workingHours = workingHours;
    }

    public String getDefaultSlaTargets() {
        return defaultSlaTargets;
    }

    public void setDefaultSlaTargets(String defaultSlaTargets) {
        this.defaultSlaTargets = defaultSlaTargets;
    }

    public String getEscalationRules() {
        return escalationRules;
    }

    public void setEscalationRules(String escalationRules) {
        this.escalationRules = escalationRules;
    }

    public boolean isAutoAssignment() {
        return autoAssignment;
    }

    public void setAutoAssignment(boolean autoAssignment) {
        this.autoAssignment = autoAssignment;
    }
}
