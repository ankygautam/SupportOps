import { InfoCard } from "@/components/ui/InfoCard";

interface SlaPerformancePoint {
  label: string;
  met: number;
  breached: number;
}

interface SlaPerformanceCardProps {
  points: SlaPerformancePoint[];
}

export function SlaPerformanceCard({ points }: SlaPerformanceCardProps) {
  const metAverage = Math.round(points.reduce((sum, point) => sum + point.met, 0) / points.length);
  const breachedAverage = Math.round(points.reduce((sum, point) => sum + point.breached, 0) / points.length);

  return (
    <InfoCard title="SLA Performance" description="Met versus breached commitments across the current reporting window.">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-emerald-50 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Met</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-emerald-900">{metAverage}%</p>
          <p className="mt-2 text-sm text-emerald-700">Average compliance remained above target across the period.</p>
        </div>
        <div className="rounded-3xl bg-rose-50 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-700">Breached</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-rose-900">{breachedAverage}%</p>
          <p className="mt-2 text-sm text-rose-700">Breaches concentrated in billing and auth-related escalations.</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-3">
        {points.map((point) => (
          <div key={point.label} className="rounded-3xl bg-slate-50 px-3 py-4">
            <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{point.label}</p>
            <div className="mt-4 h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${point.met}%` }} />
            </div>
            <div className="mt-2 h-2 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-rose-500" style={{ width: `${point.breached * 10}%` }} />
            </div>
          </div>
        ))}
      </div>
    </InfoCard>
  );
}
