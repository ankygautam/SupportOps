interface TeamUtilizationRow {
  name: string;
  tickets: number;
  resolvedToday: number;
  utilization: number;
}

export function TeamUtilizationCard({ rows }: { rows: TeamUtilizationRow[] }) {
  return (
    <div className="panel p-6">
      <div className="mb-5">
        <p className="text-sm font-semibold text-slate-900">Team Utilization</p>
        <p className="mt-1 text-sm text-slate-500">Case ownership and load balance across today's queue.</p>
      </div>
      <div className="space-y-4">
        {rows.map((agent) => (
          <div key={agent.name} className="rounded-2xl border border-slate-100 px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{agent.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {agent.tickets} open tickets • {agent.resolvedToday} resolved today
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-700">{agent.utilization}%</p>
            </div>
            <div className="mt-3 h-2.5 rounded-full bg-slate-100">
              <div className="h-2.5 rounded-full bg-slate-950" style={{ width: `${agent.utilization}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
