interface SettingFieldRowProps {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
  disabled?: boolean;
}

export function SettingFieldRow({ label, hint, value, onChange, type = "text", disabled = false }: SettingFieldRowProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label}</p>
        <p className="mt-1 text-sm text-slate-500">{hint}</p>
      </div>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-300 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      />
    </div>
  );
}
