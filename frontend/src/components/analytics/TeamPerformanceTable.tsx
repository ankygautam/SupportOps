import type { TeamPerformanceRow } from "@/data/analyticsData";
import { TableWrapper } from "@/components/ui/TableWrapper";

interface TeamPerformanceTableProps {
  rows: TeamPerformanceRow[];
}

export function TeamPerformanceTable({ rows }: TeamPerformanceTableProps) {
  return (
    <TableWrapper
      title="Team Performance"
      description="Resolution throughput, responsiveness, and service quality by frontline owner."
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              <th className="table-head px-5 py-4">Agent</th>
              <th className="table-head px-5 py-4">Assigned</th>
              <th className="table-head px-5 py-4">Resolved</th>
              <th className="table-head px-5 py-4">Avg Response</th>
              <th className="table-head px-5 py-4">SLA Score</th>
              <th className="table-head px-5 py-4">CSAT</th>
              <th className="table-head px-5 py-4">Workload</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-100 transition hover:bg-slate-50/80">
                <td className="table-cell">
                  <div>
                    <p className="font-semibold text-slate-900">{row.agent}</p>
                    <p className="mt-1 text-sm text-slate-500">{row.team}</p>
                  </div>
                </td>
                <td className="table-cell font-medium text-slate-900">{row.assigned}</td>
                <td className="table-cell font-medium text-slate-900">{row.resolved}</td>
                <td className="table-cell">{row.avgResponse}</td>
                <td className="table-cell">{row.slaScore}</td>
                <td className="table-cell">{row.csat}</td>
                <td className="table-cell">
                  <div className="flex items-center gap-3">
                    <div className="h-2.5 w-28 rounded-full bg-slate-100">
                      <div
                        className={`h-2.5 rounded-full ${
                          row.workload >= 80 ? "bg-rose-500" : row.workload >= 70 ? "bg-amber-500" : "bg-emerald-500"
                        }`}
                        style={{ width: `${row.workload}%` }}
                      />
                    </div>
                    <span className="font-medium text-slate-900">{row.workload}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableWrapper>
  );
}
