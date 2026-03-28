import { useMemo, useState } from "react";
import { MailPlus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/forms/Button";
import { SelectField } from "@/components/forms/SelectField";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageErrorState } from "@/components/ui/PageErrorState";
import { Badge } from "@/components/ui/Badge";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { TableWrapper } from "@/components/ui/TableWrapper";
import { getTeamMembers, updateTeamMemberRole, updateTeamMemberStatus } from "@/api";
import { mapTeamMember } from "@/api/mappers";
import { useApiQuery } from "@/hooks/useApiQuery";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import type { ApiRole, TeamMember } from "@/types/models";

const roleOptions: Array<{ label: string; value: "" | ApiRole }> = [
  { label: "All roles", value: "" },
  { label: "Admin", value: "ADMIN" },
  { label: "Team Lead", value: "TEAM_LEAD" },
  { label: "Support Agent", value: "SUPPORT_AGENT" },
];

function TeamStatusBadge({ active }: { active: boolean }) {
  return <Badge tone={active ? "success" : "default"}>{active ? "Active" : "Inactive"}</Badge>;
}

export function TeamPage() {
  const { hasRole } = useAuth();
  const { pushToast } = useToast();
  const canManageRoles = hasRole("ADMIN");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | ApiRole>("");
  const [reloadKey, setReloadKey] = useState(0);
  const [notice, setNotice] = useState("Team ownership controls are ready.");

  const teamQuery = useApiQuery(
    [reloadKey, roleFilter],
    async () => (await getTeamMembers(roleFilter || undefined)).map(mapTeamMember),
    { enabled: true },
  );

  const members = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (teamQuery.data ?? []).filter((member) => {
      if (!query) {
        return true;
      }

      return [member.name, member.email, member.team, member.role].some((value) =>
        value.toLowerCase().includes(query),
      );
    });
  }, [search, teamQuery.data]);

  const activeMembers = (teamQuery.data ?? []).filter((member) => member.active);

  async function handleRoleChange(member: TeamMember, nextRole: ApiRole) {
    await updateTeamMemberRole(member.id, nextRole);
    setNotice(`${member.name} is now set as ${nextRole.replace("_", " ").toLowerCase()}.`);
    setReloadKey((value) => value + 1);
    pushToast({ tone: "success", title: "Role updated", description: `${member.name}'s role was updated successfully.` });
  }

  async function handleToggleActive(member: TeamMember) {
    const fallbackOwner = activeMembers.find((candidate) => candidate.id !== member.id);
    await updateTeamMemberStatus(member.id, !member.active, !member.active ? undefined : fallbackOwner?.id);
    setNotice(
      member.active
        ? `${member.name} was deactivated and active ownership moved to ${fallbackOwner?.name ?? "the default queue"}.`
        : `${member.name} was reactivated for queue coverage.`,
    );
    setReloadKey((value) => value + 1);
    pushToast({
      tone: "success",
      title: member.active ? "Member deactivated" : "Member activated",
      description: member.active
        ? `${member.name}'s active workload was updated for safe coverage.`
        : `${member.name} is active again and available for assignment.`,
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations Admin"
        title="Team management"
        description="Review staffing coverage, rebalance ownership, and keep support roles current without leaving the operations workspace."
        actions={
          <Button
            type="button"
            onClick={() =>
              setNotice("Invite workflow prepared. Connect this action to identity provisioning or directory sync when deployment moves beyond demo mode.")
            }
          >
            <MailPlus className="h-4 w-4" />
            Invite user
          </Button>
        }
      />

      <SearchFilterBar
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Search team members by name, email, team, or role"
        filters={
          <label className="block">
            <span className="meta-label mb-2 block">Role filter</span>
            <SelectField value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as "" | ApiRole)}>
              {roleOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
          </label>
        }
        actions={
          <Button type="button" variant="secondary" onClick={() => { setSearch(""); setRoleFilter(""); }}>
            <RefreshCcw className="h-4 w-4" />
            Reset view
          </Button>
        }
      />

      <div className="panel p-4 text-sm text-slate-600">{notice}</div>

      <TableWrapper
        title="Support staff"
        description="Queue ownership and support coverage by teammate."
        loading={teamQuery.loading}
        emptyState={<EmptyState title="No team members found" description="Adjust the search or role filter to broaden the roster view." />}
      >
        {teamQuery.error ? (
          <PageErrorState title="Team roster unavailable" description={teamQuery.error} onRetry={teamQuery.retry} />
        ) : members.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  {["Name", "Email", "Role", "Active Tickets", "Resolved This Week", "Avg Response Time", "Status", "Actions"].map((label) => (
                    <th key={label} className="table-head px-5 py-4">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="group table-row-interactive">
                    <td className="table-cell">
                      <div>
                        <p className="font-semibold text-slate-900">{member.name}</p>
                        <p className="table-meta">{member.team}</p>
                      </div>
                    </td>
                    <td className="table-cell text-sm text-slate-600">{member.email}</td>
                    <td className="table-cell">
                      {canManageRoles ? (
                        <SelectField value={member.roleKey} onChange={(event) => handleRoleChange(member, event.target.value as ApiRole)}>
                          {roleOptions.filter((option) => option.value).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </SelectField>
                      ) : (
                        <span className="text-sm font-medium text-slate-700">{member.role}</span>
                      )}
                    </td>
                    <td className="table-cell text-sm font-semibold text-slate-900">{member.activeTickets}</td>
                    <td className="table-cell text-sm font-semibold text-slate-900">{member.resolvedThisWeek}</td>
                    <td className="table-cell text-sm font-semibold text-slate-900">{member.avgResponseTime}</td>
                    <td className="table-cell">
                      <TeamStatusBadge active={member.active} />
                    </td>
                    <td className="table-cell">
                      <Button type="button" variant="secondary" size="sm" onClick={() => handleToggleActive(member)}>
                        {member.active ? "Deactivate" : "Activate"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </TableWrapper>
    </div>
  );
}
