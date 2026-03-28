import type { AnalyticsRange } from "@/data/analyticsData";

interface AnalyticsFiltersBarProps {
  range: AnalyticsRange;
  team: string;
  onRangeChange: (range: AnalyticsRange) => void;
  onTeamChange: (team: string) => void;
  onExport: () => void;
  exportLabel: string;
  teams: readonly string[];
}

export function AnalyticsFiltersBar({
  range,
  team,
  onRangeChange,
  onTeamChange,
  onExport,
  exportLabel,
  teams,
}: AnalyticsFiltersBarProps) {
  return (
    <div className="panel p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Date Range</span>
          <select
            value={range}
            onChange={(event) => onRangeChange(event.target.value as AnalyticsRange)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Team</span>
          <select
            value={team}
            onChange={(event) => onTeamChange(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-300"
          >
            {teams.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-end justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800"
        >
          {exportLabel}
        </button>
      </div>
    </div>
  );
}
