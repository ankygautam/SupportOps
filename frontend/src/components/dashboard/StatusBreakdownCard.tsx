import type { StatusBreakdown } from "@/types/models";

export function StatusBreakdownCard({ items }: { items: StatusBreakdown[] }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="panel p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Tickets by Status</p>
          <p className="mt-1 text-sm text-slate-500">Current workload distribution across the support queue.</p>
        </div>
        <p className="text-sm font-semibold text-slate-900">{total} active</p>
      </div>
      <div className="space-y-4">
        {items.map((item) => {
          const width = `${(item.value / total) * 100}%`;

          return (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between text-sm">
                <p className="font-medium text-slate-700">{item.label}</p>
                <p className="text-slate-500">{item.value}</p>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div className={`h-3 rounded-full ${item.colorClass}`} style={{ width }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
