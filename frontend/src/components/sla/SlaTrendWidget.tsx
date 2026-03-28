import { InfoCard } from "@/components/ui/InfoCard";

interface SlaTrendPoint {
  day: string;
  breached: number;
  resolved: number;
}

export function SlaTrendWidget({ trend }: { trend: SlaTrendPoint[] }) {
  const peak = Math.max(...trend.flatMap((item) => [item.breached, item.resolved]), 1);

  return (
    <InfoCard title="Breached vs Resolved" description="Seven-day operational pattern across breach handling and queue recovery.">
      <div className="mt-6 grid grid-cols-7 gap-3">
        {trend.map((point) => (
          <div key={point.day} className="flex flex-col items-center gap-2">
            <div className="flex h-28 items-end gap-1">
              <div className="w-3 rounded-full bg-rose-400" style={{ height: `${(point.breached / peak) * 100}%` }} />
              <div className="w-3 rounded-full bg-emerald-500" style={{ height: `${(point.resolved / peak) * 100}%` }} />
            </div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{point.day}</p>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}
