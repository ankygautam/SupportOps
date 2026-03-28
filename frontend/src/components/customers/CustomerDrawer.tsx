import { BriefcaseBusiness, ClipboardList, ContactRound, FileText } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { DetailPanel } from "@/components/ui/DetailPanel";
import { InfoCard } from "@/components/ui/InfoCard";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { customerHealthTone, formatCurrency } from "@/lib/operations";
import type { Customer, CustomerActivity, Ticket } from "@/types/models";

interface CustomerDrawerProps {
  customer: Customer | null;
  relatedTickets: Ticket[];
  activity: CustomerActivity[];
  notes: string[];
  onClose: () => void;
}

export function CustomerDrawer({ customer, relatedTickets, activity, notes, onClose }: CustomerDrawerProps) {
  return (
    <DetailPanel
      open={Boolean(customer)}
      onClose={onClose}
      eyebrow={customer ? `${customer.segment} Account` : undefined}
      title={customer?.company}
      size="xl"
      headerMeta={
        customer ? (
          <>
            <Badge tone={customerHealthTone[customer.health]}>{customer.health}</Badge>
            <Badge tone="default">{customer.plan}</Badge>
            <Badge tone="info">{customer.region}</Badge>
          </>
        ) : null
      }
    >
      {customer ? (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <InfoCard title="Customer profile" muted>
              <p className="text-xl font-semibold text-slate-950">{customer.name}</p>
              <p className="mt-2 text-sm text-slate-600">{customer.primaryEmail}</p>
              <p className="mt-1 text-sm text-slate-500">{customer.primaryPhone}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white px-4 py-4 shadow-soft">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Company</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{customer.company}</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-4 shadow-soft">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Plan</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{customer.plan}</p>
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Company and plan info"
              description="Commercial and segment context for this support relationship."
              icon={<BriefcaseBusiness className="h-5 w-5" />}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Segment", value: customer.segment },
                  { label: "Industry", value: customer.industry },
                  { label: "Renewal", value: customer.renewalAt },
                  { label: "MRR", value: formatCurrency(customer.mrr) },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </InfoCard>

            <InfoCard
              title="Support history overview"
              description="Key support signals for operational context and account risk."
              icon={<ClipboardList className="h-5 w-5" />}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Tickets opened", value: String(customer.ticketsOpenedCount) },
                  { label: "Last incident affected", value: customer.lastIncidentAffected },
                  { label: "Average response time", value: customer.averageResponseTime },
                  { label: "Last escalation date", value: customer.lastEscalationDate },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </InfoCard>

            <InfoCard title="Recent tickets" description="The most recent support issues tied to this account.">
              <div className="space-y-3">
                {relatedTickets.map((ticket) => (
                  <div key={ticket.id} className="rounded-2xl bg-slate-50 px-4 py-4 transition hover:bg-slate-100/80">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{ticket.id}</p>
                        <p className="mt-2 text-sm text-slate-600">{ticket.subject}</p>
                      </div>
                      <Badge tone="default">{ticket.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </InfoCard>
          </div>

          <div className="space-y-6">
            <InfoCard title="Health">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <Badge tone={customerHealthTone[customer.health]}>{customer.health}</Badge>
                <p className="mt-3 text-sm text-slate-600">
                  {customer.health === "At Risk"
                    ? "Account needs proactive support follow-up and close escalation visibility."
                    : customer.health === "Watchlist"
                      ? "Operational risk is elevated and should remain visible across shifts."
                      : "Account is currently stable with low support risk."}
                </p>
              </div>
            </InfoCard>

            <InfoCard
              title="Owner / contact"
              description="Support ownership and primary customer coordination points."
              icon={<ContactRound className="h-5 w-5" />}
            >
              <div className="space-y-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Assigned CSM / Owner</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{customer.ownerName ?? "Account owner"}</p>
                  <p className="mt-1 text-sm text-slate-500">{customer.ownerTitle}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Primary contact</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{customer.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{customer.primaryPhone}</p>
                </div>
              </div>
            </InfoCard>

            <InfoCard
              title="Notes"
              description="Handling notes and communication preferences for this customer."
              icon={<FileText className="h-5 w-5" />}
            >
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                    {note}
                  </div>
                ))}
              </div>
            </InfoCard>

            <InfoCard title="Recent activity" description="Latest support and ownership changes across the account.">
              <div className="space-y-4">
                {activity.map((event) => (
                  <TimelineItem
                    key={event.id}
                    title={event.title}
                    description={event.description}
                    actor={event.actor}
                    occurredAt={event.occurredAt}
                  />
                ))}
              </div>
            </InfoCard>
          </div>
        </div>
      ) : null}
    </DetailPanel>
  );
}
