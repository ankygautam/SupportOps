import type { AnalyticsRange, VolumePoint } from "@/data/analyticsData";
import { InfoCard } from "@/components/ui/InfoCard";

interface VolumeTrendCardProps {
  range: AnalyticsRange;
  points: VolumePoint[];
  onRangeChange: (range: AnalyticsRange) => void;
}

export function VolumeTrendCard({ range, points, onRangeChange }: VolumeTrendCardProps) {
  const peak = Math.max(...points.flatMap((point) => [point.opened, point.resolved]));

  return (
    <InfoCard title="Ticket Volume Trend" description="Opened versus resolved workload over time for leadership review and staffing decisions.">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(["7d", "30d", "90d"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onRangeChange(option)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                option === range ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
            Opened
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Resolved
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:gap-4" style={{ gridTemplateColumns: `repeat(${points.length}, minmax(0, 1fr))` }}>
        {points.map((point) => (
          <div key={point.label} className="flex min-h-[220px] flex-col justify-end gap-3">
            <div className="flex flex-1 items-end justify-center gap-2 rounded-3xl bg-[linear-gradient(180deg,rgba(248,250,252,0.8),rgba(241,245,249,0.95))] px-3 py-4">
              <div
                className="w-3 rounded-full bg-sky-500 shadow-soft transition hover:opacity-90"
                style={{ height: `${(point.opened / peak) * 100}%` }}
              />
              <div
                className="w-3 rounded-full bg-emerald-500 shadow-soft transition hover:opacity-90"
                style={{ height: `${(point.resolved / peak) * 100}%` }}
              />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{point.label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{point.resolved}</p>
            </div>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}
