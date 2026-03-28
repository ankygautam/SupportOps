import type { TrendPoint } from "@/types/models";

function buildChartPoints(values: number[]) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1 || 1)) * 100;
      const y = 100 - ((value - min) / range) * 70 - 10;
      return `${x},${y}`;
    })
    .join(" ");
}

export function ResponseTrendCard({ points }: { points: TrendPoint[] }) {
  const values = points.map((point) => point.value);
  const polylinePoints = buildChartPoints(values);
  const areaPoints = `0,100 ${polylinePoints} 100,100`;

  return (
    <div className="panel p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Average Response Trend</p>
          <p className="mt-1 text-sm text-slate-500">First response time over the last seven days.</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Current</p>
          <p className="mt-1 text-2xl font-bold text-slate-950">{values[values.length - 1] ?? 0}m</p>
        </div>
      </div>
      <div className="rounded-3xl bg-slate-50 p-4">
        <svg viewBox="0 0 100 100" className="h-44 w-full">
          <defs>
            <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <path d={`M ${areaPoints}`} fill="url(#areaFill)" />
          <polyline
            fill="none"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={polylinePoints}
          />
          {values.map((value, index) => {
            const x = (index / (values.length - 1 || 1)) * 100;
            const y = Number(polylinePoints.split(" ")[index].split(",")[1]);
            return <circle key={`${value}-${x}`} cx={x} cy={y} r="2.8" fill="#0ea5e9" />;
          })}
        </svg>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {points.map((point) => (
            <div key={point.label} className="text-center">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-400">{point.label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{point.value}m</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
