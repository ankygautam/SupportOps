import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageErrorState } from "@/components/ui/PageErrorState";
import { SettingFieldRow } from "@/components/settings/SettingFieldRow";
import { SettingSelectRow } from "@/components/settings/SettingSelectRow";
import { SettingsSectionCard } from "@/components/settings/SettingsSectionCard";
import { SettingToggleRow } from "@/components/settings/SettingToggleRow";
import { getUserPreferences, updateUserPreferences } from "@/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useApiQuery } from "@/hooks/useApiQuery";
import { defaultSettingsState, type SettingsState } from "@/data/settingsData";

export function SettingsPage() {
  const { user, hasRole } = useAuth();
  const { pushToast } = useToast();
  const preferencesQuery = useApiQuery([], getUserPreferences, { enabled: true, initialData: defaultSettingsState });
  const [saved, setSaved] = useState<SettingsState>(defaultSettingsState);
  const [draft, setDraft] = useState<SettingsState>(defaultSettingsState);
  const [savedBadge, setSavedBadge] = useState("");

  useEffect(() => {
    if (!preferencesQuery.data) {
      return;
    }

    setSaved(preferencesQuery.data);
    setDraft(preferencesQuery.data);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("supportops:landing-page", preferencesQuery.data.display.defaultLandingPage);
    }
  }, [preferencesQuery.data]);

  function markSaved(label: string) {
    setSavedBadge(`${label} saved`);
    window.setTimeout(() => setSavedBadge(""), 1800);
  }

  async function saveSection<K extends keyof SettingsState>(section: K, label: string) {
    const next = { ...saved, [section]: draft[section] };
    const response = await updateUserPreferences(next);
    setSaved(response);
    setDraft(response);
    if (section === "display" && typeof window !== "undefined") {
      window.localStorage.setItem("supportops:landing-page", response.display.defaultLandingPage);
    }
    markSaved(label);
    pushToast({ tone: "success", title: `${label} saved`, description: "Your workspace preferences were updated successfully." });
  }

  function cancelSection<K extends keyof SettingsState>(section: K) {
    setDraft((current) => ({ ...current, [section]: saved[section] }));
  }

  const profileDirty = JSON.stringify(saved.profile) !== JSON.stringify(draft.profile);
  const notificationsDirty = JSON.stringify(saved.notifications) !== JSON.stringify(draft.notifications);
  const displayDirty = JSON.stringify(saved.display) !== JSON.stringify(draft.display);
  const operationsDirty = JSON.stringify(saved.operations) !== JSON.stringify(draft.operations);
  const canManageOperations = hasRole("ADMIN", "TEAM_LEAD");

  const actionButtons = (dirty: boolean, onCancel: () => void, onSave: () => void) => (
    <>
      <button
        type="button"
        onClick={onCancel}
        disabled={!dirty}
        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={!dirty}
        className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        Save changes
      </button>
    </>
  );

  if (preferencesQuery.error) {
    return <PageErrorState title="Settings unavailable" description={preferencesQuery.error} onRetry={preferencesQuery.retry} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace Preferences"
        title="Settings"
        description="Manage personal preferences, operational defaults, and workspace behavior for the SupportOps environment."
        actions={savedBadge ? <Badge tone="success">{savedBadge}</Badge> : <Badge tone="info">API-backed settings</Badge>}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <SettingsSectionCard
          title="Profile Settings"
          description="Personal identity and account context used throughout the workspace."
          actions={actionButtons(profileDirty, () => cancelSection("profile"), () => saveSection("profile", "Profile settings"))}
        >
          <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-100 text-lg font-bold text-sky-700">
              {user?.initials ?? "SO"}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Profile identity</p>
              <p className="mt-1 text-sm text-slate-500">Profile photos can be synced from your directory provider when identity integration is enabled.</p>
            </div>
          </div>
          <SettingFieldRow
            label="Name"
            hint="Managed from your account profile."
            value={draft.profile.name}
            disabled
            onChange={(value) => setDraft((current) => ({ ...current, profile: { ...current.profile, name: value } }))}
          />
          <SettingFieldRow
            label="Email"
            hint="Primary work email used for notifications and sign-in."
            value={draft.profile.email}
            type="email"
            disabled
            onChange={(value) => setDraft((current) => ({ ...current, profile: { ...current.profile, email: value } }))}
          />
          <SettingSelectRow
            label="Role"
            hint="Workspace role is set by administrators."
            value={draft.profile.role}
            options={["Admin", "Team Lead", "Support Agent"]}
            disabled
            onChange={(value) => setDraft((current) => ({ ...current, profile: { ...current.profile, role: value } }))}
          />
          <SettingSelectRow
            label="Timezone"
            hint="Controls dashboard and queue timestamp display."
            value={draft.profile.timezone}
            options={["America/Edmonton", "America/New_York", "Europe/London", "Asia/Singapore"]}
            onChange={(value) => setDraft((current) => ({ ...current, profile: { ...current.profile, timezone: value } }))}
          />
          <SettingSelectRow
            label="Date format"
            hint="Choose how detailed dates are rendered across queue and analytics views."
            value={draft.profile.dateFormat}
            options={["MMM d, yyyy", "dd MMM yyyy", "yyyy-MM-dd"]}
            onChange={(value) => setDraft((current) => ({ ...current, profile: { ...current.profile, dateFormat: value } }))}
          />
        </SettingsSectionCard>

        <SettingsSectionCard
          title="Notification Preferences"
          description="Control how alerts, summaries, and urgent operational signals reach you."
          actions={actionButtons(
            notificationsDirty,
            () => cancelSection("notifications"),
            () => saveSection("notifications", "Notification preferences"),
          )}
        >
          <SettingToggleRow
            label="Email alerts"
            hint="Receive ticket and workflow updates by email."
            checked={draft.notifications.emailAlerts}
            onChange={(value) => setDraft((current) => ({ ...current, notifications: { ...current.notifications, emailAlerts: value } }))}
          />
          <SettingToggleRow
            label="Assignment alerts"
            hint="Notify me when new tickets are assigned into my queue."
            checked={draft.notifications.assignmentAlerts}
            onChange={(value) =>
              setDraft((current) => ({ ...current, notifications: { ...current.notifications, assignmentAlerts: value } }))
            }
          />
          <SettingToggleRow
            label="SLA breach alerts"
            hint="Highlight breached or near-breach commitments immediately."
            checked={draft.notifications.slaBreachAlerts}
            onChange={(value) =>
              setDraft((current) => ({ ...current, notifications: { ...current.notifications, slaBreachAlerts: value } }))
            }
          />
          <SettingToggleRow
            label="Escalation alerts"
            hint="Surface case escalations that require broader operational visibility."
            checked={draft.notifications.escalationAlerts}
            onChange={(value) =>
              setDraft((current) => ({ ...current, notifications: { ...current.notifications, escalationAlerts: value } }))
            }
          />
          <SettingToggleRow
            label="Incident alerts"
            hint="Send notifications when new incidents are declared or updated."
            checked={draft.notifications.incidentAlerts}
            onChange={(value) =>
              setDraft((current) => ({ ...current, notifications: { ...current.notifications, incidentAlerts: value } }))
            }
          />
          <SettingToggleRow
            label="Incident resolved alerts"
            hint="Notify me when live incidents move into resolved status."
            checked={draft.notifications.incidentResolvedAlerts}
            onChange={(value) =>
              setDraft((current) => ({ ...current, notifications: { ...current.notifications, incidentResolvedAlerts: value } }))
            }
          />
          <SettingToggleRow
            label="Daily summary"
            hint="Receive a daily performance and queue recap."
            checked={draft.notifications.dailySummary}
            onChange={(value) =>
              setDraft((current) => ({ ...current, notifications: { ...current.notifications, dailySummary: value } }))
            }
          />
          <SettingToggleRow
            label="Sound"
            hint="Play audio cues for urgent alerts while SupportOps is open."
            checked={draft.notifications.sound}
            onChange={(value) => setDraft((current) => ({ ...current, notifications: { ...current.notifications, sound: value } }))}
          />
        </SettingsSectionCard>

        <SettingsSectionCard
          title="Display / Workspace Preferences"
          description="Tune how tables, dashboards, and the shell behave during day-to-day operations."
          actions={actionButtons(displayDirty, () => cancelSection("display"), () => saveSection("display", "Display preferences"))}
        >
          <SettingToggleRow
            label="Compact table mode"
            hint="Reduce vertical padding for denser operational review."
            checked={draft.display.compactTableMode}
            onChange={(value) => setDraft((current) => ({ ...current, display: { ...current.display, compactTableMode: value } }))}
          />
          <SettingSelectRow
            label="Default dashboard view"
            hint="Choose the landing perspective after sign-in."
            value={draft.display.defaultDashboardView}
            options={["Operations Overview", "My Queue", "Incident Watch", "Executive Snapshot"]}
            onChange={(value) => setDraft((current) => ({ ...current, display: { ...current.display, defaultDashboardView: value } }))}
          />
          <SettingSelectRow
            label="Default landing page"
            hint="Open the most useful route first after authentication restore."
            value={draft.display.defaultLandingPage}
            options={["/dashboard", "/tickets", "/incidents", "/analytics", "/team"]}
            onChange={(value) => setDraft((current) => ({ ...current, display: { ...current.display, defaultLandingPage: value } }))}
          />
          <SettingSelectRow
            label="Table density"
            hint="Choose the overall visual density for list-heavy workflows."
            value={draft.display.tableDensity}
            options={["comfortable", "compact"]}
            onChange={(value) => setDraft((current) => ({ ...current, display: { ...current.display, tableDensity: value } }))}
          />
          <SettingToggleRow
            label="Show resolved tickets"
            hint="Keep recently completed work visible in list views."
            checked={draft.display.showResolvedTickets}
            onChange={(value) => setDraft((current) => ({ ...current, display: { ...current.display, showResolvedTickets: value } }))}
          />
          <SettingToggleRow
            label="Sidebar collapsed"
            hint="Start with a more compact shell on smaller screens."
            checked={draft.display.sidebarCollapsed}
            onChange={(value) => setDraft((current) => ({ ...current, display: { ...current.display, sidebarCollapsed: value } }))}
          />
        </SettingsSectionCard>

        {canManageOperations ? (
          <SettingsSectionCard
            title="Team / Operational Settings"
            description="Operational defaults that shape queue handling, SLA expectations, and routing behavior."
            actions={actionButtons(
              operationsDirty,
              () => cancelSection("operations"),
              () => saveSection("operations", "Operational settings"),
            )}
          >
          <SettingSelectRow
            label="Business hours"
            hint="Primary operating window for standard support coverage."
            value={draft.operations.businessHours}
            options={["08:00 - 18:00 MT", "24/7 Coverage", "09:00 - 17:00 ET", "Follow regional handoff"]}
            onChange={(value) => setDraft((current) => ({ ...current, operations: { ...current.operations, businessHours: value } }))}
          />
          <SettingSelectRow
            label="Working hours"
            hint="Personal working window used for assignment and notification timing."
            value={draft.operations.workingHours}
            options={["08:00 - 17:00 local", "07:00 - 16:00 local", "09:00 - 18:00 local", "Follow rotating coverage"]}
            onChange={(value) => setDraft((current) => ({ ...current, operations: { ...current.operations, workingHours: value } }))}
          />
          <SettingSelectRow
            label="Default SLA targets"
            hint="Baseline target policy used for newly created queues."
            value={draft.operations.defaultSlaTargets}
            options={["Priority Based Policy", "Enterprise Strict Policy", "Standard Support Policy"]}
            onChange={(value) => setDraft((current) => ({ ...current, operations: { ...current.operations, defaultSlaTargets: value } }))}
          />
          <SettingSelectRow
            label="Escalation rules"
            hint="Default escalation trigger path for urgent work."
            value={draft.operations.escalationRules}
            options={[
              "Manager review for critical or breached queues",
              "Immediate incident command review",
              "Queue lead approval only",
            ]}
            onChange={(value) => setDraft((current) => ({ ...current, operations: { ...current.operations, escalationRules: value } }))}
          />
          <SettingToggleRow
            label="Ticket auto-assignment"
            hint="Automatically route new tickets to the best-fit owner or queue."
            checked={draft.operations.autoAssignment}
            onChange={(value) => setDraft((current) => ({ ...current, operations: { ...current.operations, autoAssignment: value } }))}
          />
          </SettingsSectionCard>
        ) : (
          <SettingsSectionCard title="Role-aware controls" description="Operational defaults are managed by team leads and administrators.">
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-5">
              <p className="text-sm font-semibold text-slate-900">Operations controls are scoped to elevated roles.</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Your role can still manage personal notifications, display preferences, and profile formatting without changing team-wide routing behavior.
              </p>
            </div>
          </SettingsSectionCard>
        )}
      </div>

      <SettingsSectionCard title="Security" description="Security posture, session visibility, and account protection controls.">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4">
            <p className="text-sm font-semibold text-slate-900">Current session</p>
            <p className="mt-2 text-sm text-slate-500">
              Signed in as <span className="font-semibold text-slate-900">{user?.email ?? draft.profile.email}</span>
            </p>
            <p className="mt-1 text-sm text-slate-500">Session status: Active in this browser</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4">
            <p className="text-sm font-semibold text-slate-900">2FA</p>
            <p className="mt-2 text-sm text-slate-500">
              Multi-factor authentication is available as a future identity integration point.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4">
            <p className="text-sm font-semibold text-slate-900">Audit visibility</p>
            <p className="mt-2 text-sm text-slate-500">
              Password changes, sign-in events, and privileged actions will surface here once audit APIs are exposed.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4">
            <p className="text-sm font-semibold text-slate-900">Security actions</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Change password
              </button>
              <button
                type="button"
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Review sessions
              </button>
            </div>
          </div>
        </div>
      </SettingsSectionCard>
    </div>
  );
}
