export interface SettingsState {
  profile: {
    name: string;
    email: string;
    role: string;
    timezone: string;
    dateFormat: string;
  };
  notifications: {
    emailAlerts: boolean;
    assignmentAlerts: boolean;
    slaBreachAlerts: boolean;
    escalationAlerts: boolean;
    incidentAlerts: boolean;
    incidentResolvedAlerts: boolean;
    dailySummary: boolean;
    sound: boolean;
  };
  display: {
    compactTableMode: boolean;
    defaultDashboardView: string;
    defaultLandingPage: string;
    tableDensity: string;
    showResolvedTickets: boolean;
    sidebarCollapsed: boolean;
  };
  operations: {
    businessHours: string;
    workingHours: string;
    defaultSlaTargets: string;
    escalationRules: string;
    autoAssignment: boolean;
  };
}

export const defaultSettingsState: SettingsState = {
  profile: {
    name: "Daniel Kim",
    email: "daniel@supportops.local",
    role: "Senior Agent",
    timezone: "America/Edmonton",
    dateFormat: "MMM d, yyyy",
  },
  notifications: {
    emailAlerts: true,
    assignmentAlerts: true,
    slaBreachAlerts: true,
    escalationAlerts: true,
    incidentAlerts: true,
    incidentResolvedAlerts: true,
    dailySummary: false,
    sound: false,
  },
  display: {
    compactTableMode: false,
    defaultDashboardView: "Operations Overview",
    defaultLandingPage: "/dashboard",
    tableDensity: "comfortable",
    showResolvedTickets: true,
    sidebarCollapsed: false,
  },
  operations: {
    businessHours: "08:00 - 18:00 MT",
    workingHours: "08:00 - 17:00 local",
    defaultSlaTargets: "Priority Based Policy",
    escalationRules: "Manager review for critical or breached queues",
    autoAssignment: true,
  },
};
