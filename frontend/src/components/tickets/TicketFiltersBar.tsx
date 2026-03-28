import { RotateCcw } from "lucide-react";
import { ticketPriorityOptions, ticketSlaStateOptions, ticketStatusOptions } from "@/app/config/options";
import { Button } from "@/components/forms/Button";
import { SelectField as BaseSelectField } from "@/components/forms/SelectField";
import type { User } from "@/types/models";
import type { TicketPriority, TicketSlaState, TicketStatus } from "@/types/models";

export interface TicketFiltersState {
  status: "" | TicketStatus;
  priority: "" | TicketPriority;
  assignedAgentId: string;
  slaState: "" | TicketSlaState;
  fromDate: string;
  toDate: string;
}

interface TicketFiltersBarProps {
  filters: TicketFiltersState;
  agents: User[];
  onChange: (next: TicketFiltersState) => void;
  onClear: () => void;
}

const statuses: Array<TicketFiltersState["status"]> = ["", ...ticketStatusOptions];
const priorities: Array<TicketFiltersState["priority"]> = ["", ...ticketPriorityOptions];
const slaStates: Array<TicketFiltersState["slaState"]> = ["", ...ticketSlaStateOptions];

function SelectField({
  label,
  value,
  onChange,
  options,
  emptyLabel,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  emptyLabel?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</span>
      <BaseSelectField
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option || "all"} value={option}>
            {option || emptyLabel || `All ${label.toLowerCase()}`}
          </option>
        ))}
      </BaseSelectField>
    </label>
  );
}

export function TicketFiltersBar({ filters, agents, onChange, onClear }: TicketFiltersBarProps) {
  return (
    <div className="panel p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Filter queue</p>
          <p className="mt-1 text-sm text-slate-500">Slice ticket volume by ownership, urgency, SLA pressure, and intake window.</p>
        </div>
        <Button type="button" variant="secondary" onClick={onClear}>
          <RotateCcw className="h-4 w-4" />
          Clear filters
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <SelectField
          label="Status"
          value={filters.status}
          onChange={(value) => onChange({ ...filters, status: value as TicketFiltersState["status"] })}
          options={statuses}
          emptyLabel="All statuses"
        />
        <SelectField
          label="Priority"
          value={filters.priority}
          onChange={(value) => onChange({ ...filters, priority: value as TicketFiltersState["priority"] })}
          options={priorities}
          emptyLabel="All priorities"
        />
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Assigned Agent</span>
          <BaseSelectField
            value={filters.assignedAgentId}
            onChange={(event) => onChange({ ...filters, assignedAgentId: event.target.value })}
          >
            <option value="">All agents</option>
            {agents.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </BaseSelectField>
        </label>
        <SelectField
          label="SLA"
          value={filters.slaState}
          onChange={(value) => onChange({ ...filters, slaState: value as TicketFiltersState["slaState"] })}
          options={slaStates}
          emptyLabel="All SLA states"
        />
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">From</span>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(event) => onChange({ ...filters, fromDate: event.target.value })}
            className="field-input"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">To</span>
          <input
            type="date"
            value={filters.toDate}
            onChange={(event) => onChange({ ...filters, toDate: event.target.value })}
            className="field-input"
          />
        </label>
      </div>
    </div>
  );
}
