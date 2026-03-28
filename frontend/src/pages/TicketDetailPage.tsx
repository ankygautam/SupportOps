import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, Clock3, Flag, LifeBuoy, Siren, UserRound } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/forms/Button";
import { SelectField } from "@/components/forms/SelectField";
import { TextInput } from "@/components/forms/TextInput";
import { TextareaField } from "@/components/forms/TextareaField";
import { TicketCommentsSection } from "@/components/tickets/TicketCommentsSection";
import { TicketTimeline } from "@/components/tickets/TicketTimeline";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { PageErrorState } from "@/components/ui/PageErrorState";
import { createTicketComment, getCustomer, getIncident, getIncidents, getTicket, getTickets, getUsers, updateTicket } from "@/api";
import { mapCustomer, mapCustomerActivity, mapCustomerNotes, mapIncident, mapTicket, mapUser } from "@/api/mappers";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useApiQuery } from "@/hooks/useApiQuery";
import { ticketPriorityTone, slaDisplayTone as ticketSlaTone, ticketStatusTone } from "@/utils/badges";
import type { TicketStatus } from "@/types/models";

const quickStatuses: TicketStatus[] = ["New", "In Progress", "Waiting on Customer", "Resolved", "Closed"];

function toApiTicketStatus(value: TicketStatus) {
  switch (value) {
    case "In Progress":
      return "IN_PROGRESS";
    case "Waiting on Customer":
      return "WAITING_ON_CUSTOMER";
    case "Resolved":
      return "RESOLVED";
    case "Closed":
      return "CLOSED";
    default:
      return "NEW";
  }
}

export function TicketDetailPage() {
  const { id } = useParams();
  const { hasRole } = useAuth();
  const { pushToast } = useToast();
  const canEditTicket = hasRole("ADMIN", "TEAM_LEAD");
  const [reloadKey, setReloadKey] = useState(0);
  const [actionMessage, setActionMessage] = useState("Ready for next action.");
  const [status, setStatus] = useState<TicketStatus>("New");
  const [assignedAgentId, setAssignedAgentId] = useState("");
  const [relatedIncidentId, setRelatedIncidentId] = useState("");
  const [escalatedToTeam, setEscalatedToTeam] = useState("");
  const [escalationReason, setEscalationReason] = useState("");
  const [resolutionSummary, setResolutionSummary] = useState("");
  const [closeNotes, setCloseNotes] = useState("");
  const [reopenReason, setReopenReason] = useState("");

  const usersQuery = useApiQuery([], async () => (await getUsers()).map(mapUser), { enabled: true });
  const incidentsQuery = useApiQuery(
    [usersQuery.data?.length],
    async () => (await getIncidents()).map((incident) => mapIncident(incident, usersQuery.data ?? [])),
    { enabled: Boolean(usersQuery.data) && canEditTicket },
  );
  const ticketQuery = useApiQuery(
    [id, reloadKey, usersQuery.data?.length],
    async () => mapTicket(await getTicket(id ?? ""), usersQuery.data ?? []),
    { enabled: Boolean(id) && Boolean(usersQuery.data) },
  );
  const customerQuery = useApiQuery(
    [ticketQuery.data?.customerId, usersQuery.data?.length],
    async () => {
      const customer = await getCustomer(ticketQuery.data?.customerId ?? "");
      const recentTicketDtos = await getTickets({ customerId: ticketQuery.data?.customerId });
      const relatedTickets = recentTicketDtos.map((ticket) => mapTicket(ticket, usersQuery.data ?? []));
      return {
        customer: mapCustomer(customer, usersQuery.data ?? [], relatedTickets),
        relatedTickets,
      };
    },
    { enabled: Boolean(ticketQuery.data?.customerId) && Boolean(usersQuery.data) },
  );
  const relatedIncidentQuery = useApiQuery(
    [ticketQuery.data?.relatedIncidentId, incidentsQuery.data?.length],
    async () => {
      if (!ticketQuery.data?.relatedIncidentId) {
        return null;
      }
      return mapIncident(await getIncident(ticketQuery.data.relatedIncidentId), usersQuery.data ?? []);
    },
    { enabled: Boolean(ticketQuery.data?.relatedIncidentId) && Boolean(usersQuery.data) },
  );

  useEffect(() => {
    if (!ticketQuery.data) {
      return;
    }

    setStatus(ticketQuery.data.status);
    setAssignedAgentId(ticketQuery.data.assignedAgentId);
    setRelatedIncidentId(ticketQuery.data.relatedIncidentId ?? "");
    setEscalatedToTeam(ticketQuery.data.escalatedToTeam ?? "");
    setEscalationReason(ticketQuery.data.escalationReason ?? "");
    setResolutionSummary(ticketQuery.data.resolutionSummary ?? "");
    setCloseNotes(ticketQuery.data.closeNotes ?? "");
    setReopenReason(ticketQuery.data.reopenReason ?? "");
    setActionMessage("Ready for next action.");
  }, [ticketQuery.data]);

  if (ticketQuery.loading || usersQuery.loading || customerQuery.loading || relatedIncidentQuery.loading) {
    return <EmptyState title="Loading ticket" description="Pulling the latest customer context, ownership history, and operational workflow state." />;
  }

  if (ticketQuery.error || !ticketQuery.data) {
    return (
      <PageErrorState
        title="Ticket unavailable"
        description={ticketQuery.error || "This ticket may have been archived or moved to another workspace."}
        onRetry={() => {
          usersQuery.retry();
          incidentsQuery.retry();
          ticketQuery.retry();
          customerQuery.retry();
          relatedIncidentQuery.retry();
        }}
      />
    );
  }

  const ticket = ticketQuery.data;
  const customer = customerQuery.data?.customer;
  const relatedTickets = (customerQuery.data?.relatedTickets ?? []).filter((item) => item.id !== ticket.id).slice(0, 4);
  const customerActivity = customer ? mapCustomerActivity(customer) : [];
  const customerNotes = customer ? mapCustomerNotes(customer) : [];
  const assignedAgent = usersQuery.data?.find((user) => user.id === assignedAgentId);
  const relatedIncident = relatedIncidentQuery.data;

  async function applyTicketUpdate(
    payload: {
      status?: TicketStatus;
      assignedAgentId?: string;
      relatedIncidentId?: string;
      escalatedToTeam?: string;
      escalationReason?: string;
      resolutionSummary?: string;
      closeNotes?: string;
      reopenReason?: string;
    },
    message: string,
  ) {
    if (!canEditTicket || !id) {
      setActionMessage("Your role can review this case but cannot change assignment or workflow state.");
      return;
    }

    await updateTicket(id, {
      status: payload.status ? toApiTicketStatus(payload.status) : undefined,
      assignedAgentId: payload.assignedAgentId,
      relatedIncidentId: payload.relatedIncidentId,
      escalatedToTeam: payload.escalatedToTeam,
      escalationReason: payload.escalationReason,
      resolutionSummary: payload.resolutionSummary,
      closeNotes: payload.closeNotes,
      reopenReason: payload.reopenReason,
    });

    setActionMessage(message);
    setReloadKey((value) => value + 1);
    pushToast({ tone: "success", title: "Ticket updated", description: message });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Ticket Workspace"
        title={ticket.subject}
        description="Coordinate customer context, assignment history, escalation state, and resolution steps from one workflow-safe workspace."
        actions={
          <Link
            to="/tickets"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-soft"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to tickets
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="space-y-6">
          <div className="panel p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="neutral">{ticket.id}</Badge>
                  <Badge tone={ticketPriorityTone[ticket.priority]}>{ticket.priority}</Badge>
                  <Badge tone={ticketStatusTone[status]}>{status}</Badge>
                  {ticket.slaState ? <Badge tone={ticketSlaTone[ticket.slaState]}>{ticket.slaState}</Badge> : null}
                  {ticket.escalated ? <Badge tone="danger">Escalated</Badge> : null}
                  {ticket.relatedIncidentId ? <Badge tone="info">{ticket.relatedIncidentId}</Badge> : null}
                </div>
                <p className="mt-5 text-2xl font-bold tracking-tight text-slate-950">{ticket.subject}</p>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">{ticket.description}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-5 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Ticket summary</p>
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-semibold text-slate-900">{ticket.service}</p>
                  <p className="text-sm leading-6 text-slate-500">{ticket.impactSummary}</p>
                  {ticket.waitingSince ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
                      Waiting since {ticket.waitingSince} ({ticket.waitingDuration})
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Customer info</p>
                <p className="mt-1 text-sm text-slate-500">Account and contact context for the active support conversation.</p>
              </div>
            </div>
            {customer ? (
              <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl bg-slate-50 px-5 py-5">
                  <p className="text-lg font-semibold text-slate-900">{customer.company}</p>
                  <p className="mt-2 text-sm text-slate-600">{customer.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{customer.primaryEmail}</p>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {[
                      { label: "Plan", value: customer.plan },
                      { label: "Region", value: customer.region },
                      { label: "Open tickets", value: String(customer.openTickets) },
                      { label: "Last contacted", value: customer.lastContactedAt },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl bg-white px-4 py-4 shadow-soft">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                        <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="rounded-3xl border border-slate-100 px-5 py-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Recent account activity</p>
                    <div className="mt-4 space-y-4">
                      {customerActivity.slice(0, 3).map((entry) => (
                        <div key={`${ticket.id}-${entry.id}`} className="rounded-2xl bg-slate-50 px-4 py-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{entry.occurredAt}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600">{entry.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState title="Customer context unavailable" description="The linked customer record could not be loaded." />
            )}
          </div>

          <TicketTimeline activity={ticket.activity} />
          <TicketCommentsSection
            initialComments={ticket.comments}
            onSend={async ({ message, internal }) => {
              if (!id) {
                return;
              }

              await createTicketComment(id, { content: message, internalNote: internal });
              setReloadKey((value) => value + 1);
              pushToast({ tone: "success", title: internal ? "Internal note added" : "Reply sent", description: "The ticket timeline has been updated." });
            }}
          />
        </section>

        <aside className="sticky-side-card space-y-6 self-start">
          <div className="panel p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <UserRound className="h-5 w-5" />
              </div>
              <div>
                <p className="section-title">Assignment</p>
                <p className="section-helper mt-1">Route ownership and incident context without losing ticket history.</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="meta-label mb-2 block">Assigned to</span>
                <SelectField
                  value={assignedAgentId}
                  disabled={!canEditTicket}
                  onChange={async (event) => {
                    const nextAssignedAgentId = event.target.value;
                    setAssignedAgentId(nextAssignedAgentId);
                    await applyTicketUpdate(
                      { assignedAgentId: nextAssignedAgentId },
                      `Ticket reassigned to ${usersQuery.data?.find((user) => user.id === nextAssignedAgentId)?.name ?? "new owner"}.`,
                    );
                  }}
                >
                  {(usersQuery.data ?? []).map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </SelectField>
              </label>
              <label className="block">
                <span className="meta-label mb-2 block">Status</span>
                <SelectField
                  value={status}
                  disabled={!canEditTicket}
                  onChange={(event) => setStatus(event.target.value as TicketStatus)}
                >
                  {quickStatuses.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </SelectField>
              </label>
              <label className="block">
                <span className="meta-label mb-2 block">Related incident</span>
                <SelectField
                  value={relatedIncidentId}
                  disabled={!canEditTicket}
                  onChange={(event) => setRelatedIncidentId(event.target.value)}
                >
                  <option value="">No linked incident</option>
                  {(incidentsQuery.data ?? []).map((incident) => (
                    <option key={incident.id} value={incident.id}>
                      {incident.id} · {incident.title}
                    </option>
                  ))}
                </SelectField>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!canEditTicket}
                  onClick={() => applyTicketUpdate({ status, relatedIncidentId }, `Workflow state updated and saved to ${status}.`)}
                >
                  Save workflow
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!canEditTicket}
                  onClick={() => applyTicketUpdate({ status: "Waiting on Customer" }, "Ticket moved to Waiting on Customer and the wait timer has started.")}
                >
                  Waiting on customer
                </Button>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">{assignedAgent?.name ?? ticket.assignedAgentName ?? "Unassigned"}</p>
                <p className="mt-1 text-sm text-slate-500">{assignedAgent?.team ?? ticket.assignedAgentTeam ?? "Support team"}</p>
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-rose-50 p-3 text-rose-700">
                <Siren className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Escalation and resolution</p>
                <p className="mt-1 text-sm text-slate-500">Capture team handoff, closure context, and reopen reasons cleanly.</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Escalated to team</span>
                <TextInput value={escalatedToTeam} disabled={!canEditTicket} onChange={(event) => setEscalatedToTeam(event.target.value)} placeholder="Network Engineering" />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Escalation reason</span>
                <TextareaField value={escalationReason} disabled={!canEditTicket} onChange={(event) => setEscalationReason(event.target.value)} rows={3} placeholder="Describe why this case needs escalation." />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Resolution summary</span>
                <TextareaField value={resolutionSummary} disabled={!canEditTicket} onChange={(event) => setResolutionSummary(event.target.value)} rows={3} placeholder="Summarize the fix or customer-facing outcome." />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Close notes</span>
                <TextareaField value={closeNotes} disabled={!canEditTicket} onChange={(event) => setCloseNotes(event.target.value)} rows={3} placeholder="Capture close-out detail for the next reviewer." />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Reopen reason</span>
                <TextareaField value={reopenReason} disabled={!canEditTicket} onChange={(event) => setReopenReason(event.target.value)} rows={2} placeholder="Required if a resolved or closed case needs to reopen." />
              </label>
            </div>
          </div>

          <div className="panel p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">SLA and incident state</p>
                <p className="mt-1 text-sm text-slate-500">Response pressure, waiting duration, and linked-incident coordination.</p>
              </div>
            </div>
            <div className="space-y-3">
              {ticket.slaState ? <Badge tone={ticketSlaTone[ticket.slaState]}>{ticket.slaState}</Badge> : null}
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Due date</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{ticket.dueAt}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Waiting duration</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{ticket.waitingDuration ?? "Not waiting on customer"}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Related incident</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">{relatedIncident ? `${relatedIncident.id} · ${relatedIncident.title}` : "No linked incident"}</p>
                {relatedIncident ? <p className="mt-1 text-sm text-slate-500">{relatedIncident.linkedTicketCount} affected tickets · {relatedIncident.affectedCustomerCount} customers</p> : null}
              </div>
            </div>
          </div>

          <div className="panel p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <LifeBuoy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Ticket metadata</p>
                <p className="mt-1 text-sm text-slate-500">Operational details for escalation, closure, and follow-through.</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Channel", value: ticket.channel },
                { label: "Created", value: ticket.createdAt },
                { label: "Last updated", value: ticket.updatedAt },
                { label: "Resolved", value: ticket.resolvedAt ?? "Not resolved" },
                { label: "Reopened", value: ticket.reopenedAt ?? "Not reopened" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-100 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {ticket.tags.map((tag) => (
                <Badge key={tag} tone="info">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
                <Flag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Quick actions</p>
                <p className="mt-1 text-sm text-slate-500">Common support actions with the right workflow context attached.</p>
              </div>
            </div>
            <div className="grid gap-3">
              <Button type="button" variant="secondary" onClick={() => applyTicketUpdate({ status: "In Progress" }, "Status changed to In Progress.")} className="justify-between">
                Change status
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button type="button" variant="secondary" onClick={() => applyTicketUpdate({ escalatedToTeam, escalationReason }, `Ticket escalated to ${escalatedToTeam || "leadership queue"}.`)} className="justify-between">
                Escalate
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => applyTicketUpdate({ status: "Resolved", resolutionSummary }, "Ticket marked resolved with customer-facing summary attached.")}
                className="justify-between"
              >
                Mark resolved
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => applyTicketUpdate({ status: "Closed", closeNotes }, "Ticket moved to Closed with close notes captured.")}
                className="justify-between"
              >
                Close ticket
                <ArrowUpRight className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => applyTicketUpdate({ status: "In Progress", reopenReason }, "Resolved ticket reopened and queued back into active handling.")}
                className="justify-between"
              >
                Reopen
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Latest action</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{actionMessage}</p>
            </div>
          </div>

          {customer ? (
            <div className="panel p-6">
              <p className="text-sm font-semibold text-slate-900">Recent tickets for this account</p>
              <div className="mt-4 space-y-3">
                {relatedTickets.map((relatedTicket) => (
                  <div key={relatedTicket.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-sm font-semibold text-slate-900">{relatedTicket.id}</p>
                    <p className="mt-2 text-sm text-slate-600">{relatedTicket.subject}</p>
                  </div>
                ))}
                {!relatedTickets.length ? <EmptyState title="No recent tickets" description="This account has no additional recently active cases." /> : null}
              </div>
              {customerNotes.length ? (
                <div className="mt-5 space-y-3">
                  {customerNotes.slice(0, 2).map((note) => (
                    <div key={note} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                      {note}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
