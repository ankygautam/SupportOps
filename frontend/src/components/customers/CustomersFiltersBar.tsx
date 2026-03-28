import { customerHealthOptions, customerSegmentOptions } from "@/app/config/options";
import { SelectField as BaseSelectField } from "@/components/forms/SelectField";

export interface CustomersFiltersState {
  segment: string;
  health: string;
}

interface CustomersFiltersBarProps {
  filters: CustomersFiltersState;
  onChange: (next: CustomersFiltersState) => void;
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

export function CustomersFiltersBar({ filters, onChange }: CustomersFiltersBarProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <SelectField
        label="Segment"
        value={filters.segment}
        options={["", ...customerSegmentOptions]}
        onChange={(value) => onChange({ ...filters, segment: value })}
      />
      <SelectField
        label="Health"
        value={filters.health}
        options={["", ...customerHealthOptions]}
        onChange={(value) => onChange({ ...filters, health: value })}
      />
    </div>
  );
}
