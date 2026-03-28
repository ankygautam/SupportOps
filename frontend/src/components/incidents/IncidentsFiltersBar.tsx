import { incidentSeverityOptions, incidentStatusOptions } from "@/app/config/options";
import { SelectField as BaseSelectField } from "@/components/forms/SelectField";
import type { IncidentSeverity, IncidentStatus } from "@/types/models";

export interface IncidentsFiltersState {
  severity: "" | IncidentSeverity;
  status: "" | IncidentStatus;
}

interface IncidentsFiltersBarProps {
  filters: IncidentsFiltersState;
  onChange: (next: IncidentsFiltersState) => void;
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
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
            {option || `All ${label.toLowerCase()}`}
          </option>
        ))}
      </BaseSelectField>
    </label>
  );
}

export function IncidentsFiltersBar({ filters, onChange }: IncidentsFiltersBarProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
      <SelectField
        label="Severity"
        value={filters.severity}
        options={["", ...incidentSeverityOptions]}
        onChange={(value) => onChange({ ...filters, severity: value as IncidentsFiltersState["severity"] })}
      />
      <SelectField
        label="Status"
        value={filters.status}
        options={["", ...incidentStatusOptions]}
        onChange={(value) => onChange({ ...filters, status: value as IncidentsFiltersState["status"] })}
      />
    </div>
  );
}
