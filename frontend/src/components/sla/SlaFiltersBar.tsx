import { ticketSlaStateOptions } from "@/app/config/options";
import { SelectField as BaseSelectField } from "@/components/forms/SelectField";

interface SlaFiltersState {
  team: string;
  state: string;
}

interface SlaFiltersBarProps {
  filters: SlaFiltersState;
  teams: string[];
  onChange: (next: SlaFiltersState) => void;
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

export type { SlaFiltersState };

export function SlaFiltersBar({ filters, teams, onChange }: SlaFiltersBarProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SelectField label="Team" value={filters.team} options={["", ...teams]} onChange={(value) => onChange({ ...filters, team: value })} />
      <SelectField
        label="SLA State"
        value={filters.state}
        options={["", ...ticketSlaStateOptions]}
        onChange={(value) => onChange({ ...filters, state: value })}
      />
    </div>
  );
}
